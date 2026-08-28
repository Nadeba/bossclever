import crypto from "crypto";

// Désactive le parsing automatique du body afin de conserver le JSON BRUT.
// Jèko signe exactement ces octets avec HMAC-SHA256.
export const config = {
  api: {
    bodyParser: false,
  },
};

const SUPABASE_URL = "https://oacjriznecslomgcamkv.supabase.co";

// Montants attendus côté serveur, en centimes Jèko.
const MONTANTS_ATTENDUS = {
  essentiel: {
    mensuel: 1500000,   // 15 000 FCFA
    annuel: 15000000,   // 150 000 FCFA
  },
  croissance: {
    mensuel: 3500000,   // 35 000 FCFA
    annuel: 35000000,   // 350 000 FCFA
  },
};

async function lireCorpsBrut(req) {
  const morceaux = [];

  for await (const morceau of req) {
    morceaux.push(
      Buffer.isBuffer(morceau)
        ? morceau
        : Buffer.from(morceau)
    );
  }

  return Buffer.concat(morceaux);
}

function signatureValide(corpsBrut, signatureRecue, secret) {
  if (!signatureRecue || !secret) return false;

  const recue = String(signatureRecue)
    .trim()
    .replace(/^sha256=/i, "");

  const digestHex = crypto
    .createHmac("sha256", secret)
    .update(corpsBrut)
    .digest("hex");

  const digestBase64 = crypto
    .createHmac("sha256", secret)
    .update(corpsBrut)
    .digest("base64");

  const comparer = (a, b) => {
    const ba = Buffer.from(String(a));
    const bb = Buffer.from(String(b));

    return (
      ba.length === bb.length &&
      crypto.timingSafeEqual(ba, bb)
    );
  };

  return (
    comparer(recue, digestHex) ||
    comparer(recue, digestBase64)
  );
}

function ajouterPeriode(dateDepart, periode) {
  const date = new Date(dateDepart);

  if (periode === "annuel") {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }

  return date;
}

function extraireReference(transaction) {
  return (
    transaction?.reference ||
    transaction?.transactionDetails?.reference ||
    transaction?.paymentRequest?.reference ||
    transaction?.transaction?.reference ||
    null
  );
}

function extraireTransactionId(transaction) {
  return (
    transaction?.id ||
    transaction?.transactionId ||
    transaction?.transaction?.id ||
    null
  );
}

function extraireMontantCentimes(transaction) {
  const valeur =
    transaction?.amountCents ??
    transaction?.amount?.amount ??
    transaction?.transaction?.amount?.amount ??
    transaction?.transactionDetails?.amountCents ??
    null;

  if (valeur === null || valeur === undefined) {
    return null;
  }

  const nombre = Number(valeur);

  return Number.isFinite(nombre)
    ? nombre
    : null;
}

function estPaiementReussi(transaction) {
  const statut = String(
    transaction?.status ??
    transaction?.transaction?.status ??
    ""
  ).toLowerCase();

  return (
    statut === "success" ||
    statut === "successful" ||
    statut === "completed"
  );
}

function estTransfert(transaction) {
  const type = String(
    transaction?.transactionType ??
    transaction?.type ??
    ""
  ).toLowerCase();

  return (
    type === "transfer" ||
    type === "payout"
  );
}

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      raison: "Méthode non autorisée",
    });
  }

  try {

    const secretWebhook =
      process.env.JEKO_WEBHOOK_SECRET;

    const cleService =
      process.env.SUPABASE_SERVICE_KEY;

    if (!secretWebhook || !cleService) {

      console.error(
        "Webhook Jèko : variable serveur manquante."
      );

      return res.status(500).json({
        ok: false,
        raison: "Configuration serveur incomplète",
      });
    }

    // --------------------------------------------------
    // 1. Lire le corps brut AVANT tout JSON.parse
    // --------------------------------------------------

    const corpsBrut =
      await lireCorpsBrut(req);

    // --------------------------------------------------
    // 2. Vérifier la signature Jèko
    // --------------------------------------------------

    const signature =
      req.headers["jeko-signature"] ||
      req.headers["Jeko-Signature"];

    if (
      !signatureValide(
        corpsBrut,
        signature,
        secretWebhook
      )
    ) {

      console.error(
        "Webhook Jèko : signature invalide."
      );

      return res.status(401).json({
        ok: false,
        raison: "Signature invalide",
      });
    }

    // --------------------------------------------------
    // 3. Convertir le JSON
    // --------------------------------------------------

    let transaction;

    try {

      transaction = JSON.parse(
        corpsBrut.toString("utf8")
      );

    } catch {

      return res.status(400).json({
        ok: false,
        raison: "JSON invalide",
      });
    }

    // --------------------------------------------------
    // 4. Ignorer les transferts
    // --------------------------------------------------

    if (estTransfert(transaction)) {

      return res.status(200).json({
        ok: true,
        ignore: true,
      });
    }

    // --------------------------------------------------
    // 5. Vérifier que le paiement est réussi
    // --------------------------------------------------

    if (!estPaiementReussi(transaction)) {

      return res.status(200).json({
        ok: true,
        ignore: true,
        statut:
          transaction?.status || null,
      });
    }

    // --------------------------------------------------
    // 6. Récupérer la référence BossClever
    //
    // Format :
    //
    // rowId_planId_periode_timestamp
    //
    // Exemple :
    //
    // 123_essentiel_annuel_1787930000000
    // --------------------------------------------------

    const reference =
      extraireReference(transaction);

    if (!reference) {

      console.error(
        "Webhook Jèko : référence BossClever absente."
      );

      return res.status(200).json({
        ok: false,
        raison: "Référence absente",
      });
    }

    const morceaux =
      String(reference).split("_");

    const rowId =
      morceaux[0];

    const planId =
      morceaux[1];

    const periodeRecue =
      morceaux[2];

    const periode =
      periodeRecue === "annuel" ||
      periodeRecue === "mensuel"
        ? periodeRecue
        : "mensuel";

    if (
      !rowId ||
      !planId ||
      !MONTANTS_ATTENDUS[planId]
    ) {

      console.error(
        "Webhook Jèko : référence BossClever mal formée.",
        reference
      );

      return res.status(200).json({
        ok: false,
        raison: "Référence mal formée",
      });
    }

    // --------------------------------------------------
    // 7. Vérifier le montant
    // --------------------------------------------------

    const montantAttendu =
      MONTANTS_ATTENDUS[planId][periode];

    const montantRecu =
      extraireMontantCentimes(transaction);

    if (
      montantRecu !== null &&
      montantRecu !== montantAttendu
    ) {

      console.error(
        "Webhook Jèko : montant inattendu.",
        {
          reference,
          montantRecu,
          montantAttendu,
        }
      );

      return res.status(200).json({
        ok: false,
        raison: "Montant inattendu",
      });
    }

    const transactionId =
      extraireTransactionId(transaction) ||
      reference;

    // --------------------------------------------------
    // 8. Lire l'entreprise dans Supabase
    // --------------------------------------------------

    const lectureRes = await fetch(
      `${SUPABASE_URL}/rest/v1/etat_app?id=eq.${encodeURIComponent(
        rowId
      )}&select=donnees`,
      {
        headers: {
          apikey: cleService,
          Authorization:
            `Bearer ${cleService}`,
        },
      }
    );

    if (!lectureRes.ok) {

      throw new Error(
        `Lecture Supabase impossible (${lectureRes.status})`
      );
    }

    const lignes =
      await lectureRes.json();

    if (
      !Array.isArray(lignes) ||
      !lignes[0]
    ) {

      console.error(
        "Webhook Jèko : entreprise introuvable.",
        rowId
      );

      return res.status(200).json({
        ok: false,
        raison: "Entreprise introuvable",
      });
    }

    const donneesActuelles =
      lignes[0].donnees || {};

    const abonnementActuel =
      donneesActuelles.abonnement || null;

    // --------------------------------------------------
    // 9. Éviter de traiter deux fois
    //    la même transaction
    // --------------------------------------------------

    if (
      abonnementActuel?.transactionId ===
        transactionId ||
      abonnementActuel?.reference ===
        reference
    ) {

      return res.status(200).json({
        ok: true,
        dejaTraite: true,
      });
    }

    // --------------------------------------------------
    // 10. Calcul de la durée d'abonnement
    // --------------------------------------------------

    const payeLe =
      new Date();

    const expirationActuelle =
      abonnementActuel?.statut === "actif" &&
      abonnementActuel?.expireLe
        ? new Date(
            abonnementActuel.expireLe
          )
        : null;

    const baseExpiration =
      expirationActuelle &&
      !Number.isNaN(
        expirationActuelle.getTime()
      ) &&
      expirationActuelle > payeLe
        ? expirationActuelle
        : payeLe;

    const expireLe =
      ajouterPeriode(
        baseExpiration,
        periode
      );

    // --------------------------------------------------
    // 11. Préparer les nouvelles données
    // --------------------------------------------------

    const nouvellesDonnees = {

      ...donneesActuelles,

      plan: planId,

      abonnement: {

        transactionId,

        reference,

        planId,

        periode,

        montantCentimes:
          montantRecu ??
          montantAttendu,

        montantFCFA:
          (
            montantRecu ??
            montantAttendu
          ) / 100,

        statut: "actif",

        payeLe:
          payeLe.toISOString(),

        expireLe:
          expireLe.toISOString(),

        prestataire: "jeko",
      },
    };

    // --------------------------------------------------
    // 12. Activer l'abonnement dans Supabase
    // --------------------------------------------------

    const majRes = await fetch(
      `${SUPABASE_URL}/rest/v1/etat_app?id=eq.${encodeURIComponent(
        rowId
      )}`,
      {
        method: "PATCH",

        headers: {

          apikey:
            cleService,

          Authorization:
            `Bearer ${cleService}`,

          "Content-Type":
            "application/json",

          Prefer:
            "return=minimal",
        },

        body: JSON.stringify({
          donnees:
            nouvellesDonnees,
        }),
      }
    );

    if (!majRes.ok) {

      throw new Error(
        `Mise à jour Supabase impossible (${majRes.status})`
      );
    }

    console.log(
      "Webhook Jèko : abonnement activé.",
      {
        reference,
        planId,
        periode,
        expireLe:
          expireLe.toISOString(),
      }
    );

    return res.status(200).json({
      ok: true,
    });

  } catch (e) {

    console.error(
      "Webhook Jèko : erreur serveur.",
      e?.message || e
    );

    return res.status(500).json({
      ok: false,
      raison: "Erreur serveur",
    });
  }
}

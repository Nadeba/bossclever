// ============================================================
// BossClever - Initialisation d'un paiement Jèko
// Fichier : api/initier-paiement.js
// ============================================================

const SUPABASE_URL = "https://oacjriznecslomgcamkv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_80rpe2MRZWELyHmgh1vRTg_q6KsSjPu";

// Valeurs de secours utilisées UNIQUEMENT si la lecture des tarifs dans
// Supabase (table plans_tarifs, modifiable depuis l'admin) échoue — pour
// que le paiement continue de fonctionner même en cas de souci réseau
// ponctuel, plutôt que de bloquer complètement les clients.
// Jèko attend "amountCents" en centimes.
const MONTANTS_PLANS_SECOURS = {
  essentiel: { mensuel: 1500000, annuel: 15000000 },
  croissance: { mensuel: 3500000, annuel: 35000000 },
};

const NOMS_PLANS = {
  essentiel: "Abonnement BossClever - Essentiel",
  croissance: "Abonnement BossClever - Croissance",
};

// Lit le tarif à jour depuis Supabase (table plans_tarifs, éditable
// depuis le portail Super Admin). Retombe sur les valeurs de secours
// codées ci-dessus si la requête échoue pour une raison quelconque.
async function obtenirMontantCentimes(planId, periodeChoisie) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/plans_tarifs?id=eq.${planId}&select=prix_mensuel,prix_annuel`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    const data = await res.json();
    const tarif = Array.isArray(data) ? data[0] : null;
    if (tarif) {
      const prixFcfa = periodeChoisie === "annuel" ? tarif.prix_annuel : tarif.prix_mensuel;
      if (typeof prixFcfa === "number" && prixFcfa > 0) {
        return prixFcfa * 100;
      }
    }
  } catch (erreur) {
    console.error("Erreur lecture tarifs Supabase, utilisation des valeurs de secours :", erreur);
  }

  // Repli sur les valeurs codées en dur.
  const secours = MONTANTS_PLANS_SECOURS[planId];
  return secours ? secours[periodeChoisie] : null;
}

export default async function handler(req, res) {
  // ----------------------------------------------------------
  // 1. Accepter uniquement les requêtes POST
  // ----------------------------------------------------------
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée.",
    });
  }

  try {
    // --------------------------------------------------------
    // 2. Informations envoyées par BossClever
    // --------------------------------------------------------
    const { rowId, planId, periode, paymentMethod, email, nom } = req.body || {};

    // "mensuel" par défaut si rien n'est précisé, pour ne jamais
    // facturer l'annuel par erreur sur une ancienne version du frontend.
    const periodeChoisie = periode === "annuel" ? "annuel" : "mensuel";

    const montantCentimes = await obtenirMontantCentimes(planId, periodeChoisie);

    // --------------------------------------------------------
    // 3. Vérification du plan et de l'entreprise
    // --------------------------------------------------------
    if (!rowId || !montantCentimes) {
      return res.status(400).json({
        error: "Plan ou entreprise invalide.",
      });
    }

    // --------------------------------------------------------
    // 4. Vérification de la configuration Jèko dans Vercel
    // --------------------------------------------------------
    if (
      !process.env.JEKO_API_KEY ||
      !process.env.JEKO_API_KEY_ID ||
      !process.env.JEKO_STORE_ID
    ) {
      return res.status(500).json({
        error: "Configuration Jèko incomplète.",
      });
    }

    // --------------------------------------------------------
    // 5. Création d'une référence unique BossClever
    // --------------------------------------------------------
    const reference = `${rowId}_${planId}_${periodeChoisie}_${Date.now()}`;

    // --------------------------------------------------------
    // 6. Création de la demande de paiement chez Jèko
    // --------------------------------------------------------
    const response = await fetch(
      "https://api.jeko.africa/partner_api/payment_requests",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.JEKO_API_KEY,
          "X-API-KEY-ID": process.env.JEKO_API_KEY_ID,
        },

        body: JSON.stringify({
          storeId: process.env.JEKO_STORE_ID,

          // Montant exprimé en centimes.
          amountCents: montantCentimes,

          currency: "XOF",

          reference,

          paymentDetails: {
            type: "redirect",

            data: {
              // Jèko exige ce champ pour une requête de type "redirect" —
              // on ne peut pas l'omettre sans faire échouer l'appel API.
              // "wave" reste la valeur par défaut en attendant de
              // confirmer, via la documentation Jèko, la façon correcte
              // de proposer tous les moyens de paiement au client.
              paymentMethod: paymentMethod || "wave",

              successUrl:
                "https://bossclever.com/?paiement=succes",

              errorUrl:
                "https://bossclever.com/?paiement=echec",
            },
          },

          metadata: {
            rowId,
            planId,
            periode: periodeChoisie,
            email: email || "",
            nom: nom || "",

            description:
              (NOMS_PLANS[planId] || "Abonnement BossClever") +
              (periodeChoisie === "annuel" ? " (annuel)" : " (mensuel)"),
          },
        }),
      }
    );

    // --------------------------------------------------------
    // 7. Lecture de la réponse Jèko
    // --------------------------------------------------------
    const data = await response.json();

    // --------------------------------------------------------
    // 8. Gestion d'une erreur retournée par Jèko
    // --------------------------------------------------------
    if (!response.ok) {
      console.error("Erreur Jèko :", data);

      return res.status(response.status).json({
        error: "Impossible d'initialiser le paiement Jèko.",
        details: data,
      });
    }

    // --------------------------------------------------------
    // 9. Récupération de l'URL de paiement
    // --------------------------------------------------------
    const paymentUrl =
      data.redirectUrl ||
      data.paymentUrl ||
      data.url ||
      data?.paymentDetails?.redirectUrl;

    if (!paymentUrl) {
      console.error("Réponse Jèko sans URL :", data);

      return res.status(500).json({
        error: "Jèko n'a retourné aucune URL de paiement.",
        details: data,
      });
    }

    // --------------------------------------------------------
    // 10. Retour de l'URL de paiement à BossClever
    // --------------------------------------------------------
    return res.status(200).json({
      success: true,
      payment_url: paymentUrl,
      reference,
    });
  } catch (error) {
    console.error(
      "Erreur serveur paiement Jèko :",
      error
    );

    return res.status(500).json({
      error:
        "Erreur serveur pendant l'initialisation du paiement.",
    });
  }
}

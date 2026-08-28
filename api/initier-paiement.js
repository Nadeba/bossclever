// ============================================================
// BossClever - Initialisation d'un paiement Jèko
// Fichier : api/initier-paiement.js
// ============================================================

// Les montants sont définis côté serveur.
// Le navigateur ne peut donc pas choisir lui-même le montant.
const MONTANTS_PLANS = {
  essentiel: 15000,
  croissance: 35000,
};

const NOMS_PLANS = {
  essentiel: "Abonnement BossClever - Essentiel",
  croissance: "Abonnement BossClever - Croissance",
};

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
    const { rowId, planId, email, nom } = req.body || {};

    const montant = MONTANTS_PLANS[planId];

    // --------------------------------------------------------
    // 3. Vérification du plan et de l'entreprise
    // --------------------------------------------------------
    if (!rowId || !montant) {
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
    const reference = `${rowId}_${planId}_${Date.now()}`;

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

          amountCents: montant,

          currency: "XOF",

          reference,

          paymentDetails: {
            type: "redirect",

            data: {
              // Pour notre premier test, on utilise Wave.
              paymentMethod: "wave",

              // Retour après paiement réussi.
              successUrl:
                "https://bossclever.com/?paiement=succes",

              // Retour en cas d'échec ou d'annulation.
              errorUrl:
                "https://bossclever.com/?paiement=echec",
            },
          },

          // Informations BossClever associées à la transaction.
          metadata: {
            rowId,
            planId,
            email: email || "",
            nom: nom || "",

            description:
              NOMS_PLANS[planId] ||
              "Abonnement BossClever",
          },
        }),
      }
    );

    // --------------------------------------------------------
    // 7. Lecture de la réponse Jèko
    // --------------------------------------------------------
    const data = await response.json();

    // --------------------------------------------------------
    // 8. Si Jèko refuse la demande
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
    // 10. Retour de l'URL à BossClever
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

const MONTANTS_PLANS = {
  essentiel: 15000,
  croissance: 35000,
};

const NOMS_PLANS = {
  essentiel: "Abonnement BossClever - Essentiel",
  croissance: "Abonnement BossClever - Croissance",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée.",
    });
  }

  try {
    const { rowId, planId, email, nom } = req.body || {};

    const montant = MONTANTS_PLANS[planId];

    if (!rowId || !montant) {
      return res.status(400).json({
        error: "Plan ou entreprise invalide.",
      });
    }

    if (
      !process.env.JEKO_API_KEY ||
      !process.env.JEKO_API_KEY_ID ||
      !process.env.JEKO_STORE_ID
    ) {
      return res.status(500).json({
        error: "Configuration Jèko incomplète.",
      });
    }

    const reference = `${rowId}_${planId}_${Date.now()}`;

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
              successUrl: "https://bossclever.com/?paiement=succes",
              errorUrl: "https://bossclever.com/?paiement=echec",
            },
          },

          metadata: {
            rowId,
            planId,
            email: email || "",
            nom: nom || "",
            description:
              NOMS_PLANS[planId] || "Abonnement BossClever",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur Jèko :", data);

      return res.status(response.status).json({
        error: "Impossible d'initialiser le paiement Jèko.",
        details: data,
      });
    }

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

    return res.status(200).json({
      success: true,
      payment_url: paymentUrl,
      reference,
    });
  } catch (error) {
    console.error("Erreur serveur paiement Jèko :", error);

    return res.status(500).json({
      error: "Erreur serveur pendant l'initialisation du paiement.",
    });
  }
}

// Fonction serveur (Vercel) qui initie un paiement CinetPay.
// La clé API et le Site ID restent secrets ici, jamais dans le code
// envoyé au navigateur — c'est tout l'intérêt de passer par le serveur.

const MONTANTS_PLANS = {
  essentiel: 15000,
  croissance: 35000,
  // "decouverte" (gratuit) et "entreprise" (sur devis) ne passent pas
  // par ce circuit de paiement automatisé.
};

const NOMS_PLANS = {
  essentiel: "Abonnement BossClever - Essentiel",
  croissance: "Abonnement BossClever - Croissance",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée." });
    return;
  }

  try {
    const { rowId, planId, email, nom } = req.body || {};

    const montant = MONTANTS_PLANS[planId];
    if (!rowId || !montant) {
      res.status(400).json({ error: "Plan ou entreprise invalide." });
      return;
    }

    // L'identifiant de transaction encode discrètement l'entreprise et le
    // plan visé, pour pouvoir les retrouver plus tard lors de la
    // notification de paiement, sans avoir besoin d'une table dédiée.
    const transactionId = `${rowId}_${planId}_${Date.now()}`;

    const site = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://bossclever.vercel.app";

    const reponse = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: process.env.CINETPAY_APIKEY,
        site_id: process.env.CINETPAY_SITE_ID,
        transaction_id: transactionId,
        amount: montant,
        currency: "XOF",
        description: NOMS_PLANS[planId] || "Abonnement BossClever",
        customer_name: nom || "Client",
        customer_surname: "BossClever",
        customer_email: email || "contact@cleverentreprises.com",
        notify_url: "https://bossclever.vercel.app/api/notification-paiement",
        return_url: "https://bossclever.vercel.app/?paiement=retour",
        channels: "ALL",
      }),
    });

    const data = await reponse.json();

    if (data.code !== "201" || !data.data || !data.data.payment_url) {
      res.status(502).json({ error: data.message || "CinetPay a refusé la demande." });
      return;
    }

    res.status(200).json({ payment_url: data.data.payment_url });
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur lors de l'initialisation du paiement." });
  }
}

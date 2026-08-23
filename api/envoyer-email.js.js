// Fonction serveur (Vercel) qui envoie un email via Resend.
// La clé API reste secrète ici, jamais exposée au navigateur — même
// principe que initier-paiement.js pour CinetPay.
//
// Générique volontairement : le sujet et le contenu HTML sont déjà
// construits côté client (dans App.jsx), cette fonction se contente de
// les transmettre à Resend. Un échec d'envoi ne doit jamais empêcher
// l'action principale (ajout d'employé, validation de tâche...) de se
// dérouler normalement — c'est à l'appelant de traiter l'échec en
// silence si besoin.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée." });
    return;
  }

  try {
    const { destinataire, sujet, corpsHtml } = req.body || {};

    if (!destinataire || !sujet || !corpsHtml) {
      res.status(400).json({ error: "Destinataire, sujet et contenu requis." });
      return;
    }

    const reponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "BossClever <onboarding@resend.dev>",
        to: destinataire,
        subject: sujet,
        html: corpsHtml,
      }),
    });

    const data = await reponse.json();

    if (!reponse.ok) {
      res.status(502).json({ error: data.message || "Le service d'email a refusé l'envoi." });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur lors de l'envoi de l'email." });
  }
}

// BossClever - API Vercel pour les notifications email via Resend
// Emplacement final dans le projet : /api/envoyer-email.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("[BossClever] RESEND_API_KEY absente dans Vercel.");
    return res.status(500).json({
      error: "RESEND_API_KEY n'est pas configurée dans Vercel.",
    });
  }

  const { destinataire, sujet, corpsHtml } = req.body || {};

  if (!destinataire || !sujet || !corpsHtml) {
    return res.status(400).json({
      error: "Destinataire, sujet et contenu sont obligatoires.",
    });
  }

  try {
    const reponseResend = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BossClever <notifications@cleverentreprises.com>",
        to: [destinataire],
        subject: sujet,
        html: corpsHtml,
        reply_to: "contact@cleverentreprises.com",
      }),
    });

    const data = await reponseResend.json().catch(() => ({}));

    if (!reponseResend.ok) {
      console.error("[BossClever] Resend a refusé l'envoi :", data);
      return res.status(reponseResend.status).json({
        error: data?.message || data?.error?.message || "Resend a refusé l'envoi de l'email.",
        details: data,
      });
    }

    console.log("[BossClever] Email envoyé :", {
      id: data.id,
      destinataire,
      sujet,
    });

    return res.status(200).json({ ok: true, id: data.id });
  } catch (erreur) {
    console.error("[BossClever] Erreur serveur email :", erreur);
    return res.status(500).json({
      error: erreur.message || "Erreur interne pendant l'envoi de l'email.",
    });
  }
}

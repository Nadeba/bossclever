// Fonction serveur (Vercel) qui répond aux questions du manager sur son
// équipe, en s'appuyant UNIQUEMENT sur un résumé des vraies données
// envoyé par le client (scores, tâches, retards, absences...).
// La clé API reste secrète ici, jamais exposée au navigateur — même
// principe que initier-paiement.js et envoyer-email.js.

const SYSTEM_PROMPT = `Tu es l'assistant intégré à BossClever, une application de suivi de la performance des employés.
Tu réponds en français, de façon concise et directe, aux questions du manager sur son équipe.

Règles strictes :
- Tu ne réponds qu'à partir des données fournies dans le contexte ci-dessous — jamais d'invention, jamais de supposition présentée comme un fait.
- Si la donnée demandée n'est pas dans le contexte, dis-le clairement plutôt que de deviner.
- Tu ne formules jamais de jugement de valeur sur une personne ("il est mauvais", "elle ne sert à rien") — tu décris des faits chiffrés, jamais un verdict.
- Réponses courtes : 2 à 5 phrases, sauf si le manager demande explicitement plus de détail.
- Pas de markdown lourd (pas de titres, pas de tableaux) — une réponse qui se lit naturellement dans un chat.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée." });
    return;
  }

  try {
    const { question, contexte } = req.body || {};

    if (!question || !contexte) {
      res.status(400).json({ error: "Question et contexte requis." });
      return;
    }

    const reponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Données actuelles de l'équipe (JSON) :\n${JSON.stringify(contexte)}\n\nQuestion du manager : ${question}`,
          },
        ],
      }),
    });

    const data = await reponse.json();

    if (!reponse.ok) {
      res.status(502).json({ error: data.error?.message || "L'assistant n'a pas pu répondre." });
      return;
    }

    const texte = (data.content || []).find((b) => b.type === "text")?.text || "";
    res.status(200).json({ reponse: texte });
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur lors de l'appel à l'assistant." });
  }
}

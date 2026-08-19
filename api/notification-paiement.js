// Fonction serveur (Vercel) appelée par CinetPay après chaque paiement.
// Conformément à leur documentation, on ne fait jamais confiance aux
// données envoyées par la notification elle-même : on rappelle l'API de
// vérification CinetPay avec l'identifiant de transaction pour obtenir le
// statut réel avant d'activer quoi que ce soit.

export default async function handler(req, res) {
  // On répond vite et toujours 200 pour éviter que CinetPay ne renvoie la
  // notification en boucle ; les erreurs internes restent silencieuses
  // côté CinetPay mais sont journalisées côté serveur.
  try {
    const corps = req.body || {};
    const transactionId = corps.cpm_trans_id || corps.transaction_id || corps.trans_id;

    if (!transactionId) {
      res.status(200).json({ ok: false, raison: "transaction_id manquant" });
      return;
    }

    const verification = await fetch("https://api-checkout.cinetpay.com/v2/payment/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction_id: transactionId,
        site_id: process.env.CINETPAY_SITE_ID,
        apikey: process.env.CINETPAY_APIKEY,
      }),
    });
    const resultat = await verification.json();

    if (resultat.code !== "00" || !resultat.data || resultat.data.status !== "ACCEPTED") {
      res.status(200).json({ ok: false, statut: resultat.data && resultat.data.status });
      return;
    }

    // L'identifiant de transaction contient l'entreprise (rowId) et le
    // plan visé, encodés à l'initialisation du paiement.
    const [rowId, planId] = transactionId.split("_");
    if (!rowId || !planId) {
      res.status(200).json({ ok: false, raison: "transaction_id mal formé" });
      return;
    }

    // Lecture puis écriture avec la clé de service Supabase (jamais
    // exposée au navigateur), seule habilitée à modifier n'importe quelle
    // ligne sans dépendre d'une session utilisateur connectée.
    const SUPABASE_URL = "https://oacjriznecslomgcamkv.supabase.co";
    const cleService = process.env.SUPABASE_SERVICE_KEY;

    const lectureRes = await fetch(
      `${SUPABASE_URL}/rest/v1/etat_app?id=eq.${rowId}&select=donnees`,
      { headers: { apikey: cleService, Authorization: `Bearer ${cleService}` } }
    );
    const lignes = await lectureRes.json();
    const donneesActuelles = (lignes && lignes[0] && lignes[0].donnees) || {};

    const payeLe = new Date();
    const expireLe = new Date(payeLe.getTime() + 30 * 24 * 60 * 60 * 1000);

    const nouvellesDonnees = {
      ...donneesActuelles,
      plan: planId,
      abonnement: {
        transactionId,
        montant: resultat.data.amount,
        statut: "actif",
        payeLe: payeLe.toISOString(),
        expireLe: expireLe.toISOString(),
      },
    };

    await fetch(`${SUPABASE_URL}/rest/v1/etat_app?id=eq.${rowId}`, {
      method: "PATCH",
      headers: {
        apikey: cleService,
        Authorization: `Bearer ${cleService}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ donnees: nouvellesDonnees }),
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(200).json({ ok: false, raison: "erreur serveur" });
  }
}

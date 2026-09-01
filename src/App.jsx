import { useState, useMemo, useEffect, useRef } from "react";
import LandingPage from "./LandingPage";

// Page dédiée, sans le contenu marketing autour, pour les Conditions
// d'utilisation et la Politique de confidentialité — accessible via
// l'ancre d'URL (#cgu ou #confidentialite), depuis n'importe où dans
// l'application, sans configuration serveur supplémentaire.
const TEXTES_LEGAUX = {
  cgu: {
    titre: "Conditions d'utilisation",
    paragraphes: [
      {
        texte:
          "BossClever est un service édité par Clever Entreprises (Cocody Riviera Faya, Abidjan, Côte d'Ivoire), destiné aux entreprises souhaitant évaluer objectivement la performance de leurs employés.",
      },
      {
        titre: "Comptes et accès.",
        texte:
          "Un compte « manager » donne accès à la gestion d'une entreprise (employés, critères, validations). Un compte « employé » est créé par l'entreprise et donne accès à un espace personnel limité à ses propres données. Un manager principal peut inviter jusqu'à 3 co-administrateurs, avec des permissions qu'il définit lui-même.",
      },
      {
        titre: "Abonnement et paiement.",
        texte:
          "BossClever propose un palier gratuit et des paliers payants facturés mensuellement. Les paiements sont traités par le prestataire tiers CinetPay ; Clever Entreprises ne stocke aucune donnée de carte bancaire ou de compte Mobile Money.",
      },
      {
        titre: "Utilisation raisonnable.",
        texte:
          "Le service ne doit pas être utilisé pour collecter des données sur des personnes n'ayant pas le statut d'employé de l'entreprise concernée, ni à des fins de surveillance abusive.",
      },
      {
        titre: "Résiliation.",
        texte:
          "Un compte manager peut être fermé à tout moment sur demande auprès de contact@cleverentreprises.com.",
      },
    ],
  },
  confidentialite: {
    titre: "Politique de confidentialité",
    paragraphes: [
      {
        titre: "Données collectées.",
        texte:
          "Nom, email et département de chaque employé ; tâches assignées et déclarées ; scores de performance et critères associés ; rapports journaliers ; notes anonymes entre collègues. Si l'entreprise active le pointage géolocalisé, la position GPS est utilisée au moment du pointage pour vérifier la proximité du lieu de travail, sans suivi continu de localisation.",
      },
      {
        titre: "Finalité.",
        texte:
          "Ces données servent uniquement au calcul du score de performance, au suivi des tâches et à la gestion interne de l'entreprise cliente. Elles ne sont ni vendues ni partagées avec des tiers à des fins publicitaires.",
      },
      {
        titre: "Hébergement.",
        texte:
          "Les données sont hébergées via Supabase. Les paiements sont traités par CinetPay, qui applique sa propre politique de confidentialité pour les données de paiement.",
      },
      {
        titre: "Cookies.",
        texte:
          "BossClever utilise uniquement des cookies techniques nécessaires au maintien de la session de connexion. Aucun cookie publicitaire ou de suivi tiers n'est utilisé à ce jour.",
      },
      {
        titre: "Vos droits.",
        texte:
          "Toute personne peut demander l'accès, la correction ou la suppression de ses données en écrivant à contact@cleverentreprises.com.",
      },
    ],
  },
};

function PageLegale({ page, onRetour }) {
  const contenu = TEXTES_LEGAUX[page];
  if (!contenu) return null;

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "40px 20px 60px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#20231F",
      }}
    >
      <button
        onClick={onRetour}
        style={{
          border: "none",
          background: "none",
          color: "#1877F2",
          cursor: "pointer",
          fontSize: 14,
          padding: 0,
          marginBottom: 24,
        }}
      >
        ← Retour à l'accueil
      </button>

      <h1 style={{ fontSize: 26, fontWeight: 600, margin: "0 0 10px" }}>{contenu.titre}</h1>
      <p style={{ fontStyle: "italic", color: "#5F5E5A", fontSize: 14, lineHeight: 1.6, margin: "0 0 28px" }}>
        Document en cours d'élaboration, à faire valider par un professionnel du droit avant
        d'être considéré comme définitif. Il décrit néanmoins fidèlement le fonctionnement réel du
        service à ce jour.
      </p>

      <div style={{ display: "grid", gap: 18, fontSize: 14.5, lineHeight: 1.7 }}>
        {contenu.paragraphes.map((p, i) => (
          <p key={i} style={{ margin: 0 }}>
            {p.titre && <strong>{p.titre} </strong>}
            {p.texte}
          </p>
        ))}
      </div>
    </div>
  );
}

const TEXTES_ETAPES = {
  "regles-manager": {
    numero: "01",
    titre: "Le manager fixe les règles",
    accroche:
      "Avant même que le premier employé pointe, tout ce qui compte est déjà cadré — pas de zone grise, pas d'improvisation.",
    sections: [
      {
        h: "Un code entreprise unique",
        p: "En créant votre compte, BossClever génère un code entreprise propre à vous. Vos employés le saisissent une seule fois, lors de leur inscription, pour rejoindre automatiquement votre espace — aucun email d'invitation à gérer manuellement.",
      },
      {
        h: "14 critères, une pondération que vous choisissez",
        p: "Objectifs atteints, tâches dans les délais, ponctualité, proactivité, feedback des pairs, fiabilité... 14 critères composent le score, mais leur poids respectif est entièrement réglable. Une entreprise commerciale peut pousser les objectifs à 25 %, un service support peut privilégier la fiabilité — la structure reste la même pour tout le monde, seul le curseur change.",
      },
      {
        h: "Des horaires attendus, pas des impressions",
        p: "Vous définissez l'heure d'arrivée et de départ attendues. À partir de là, un retard n'est plus une question d'appréciation : c'est un fait, calculé automatiquement, visible dans l'onglet Présence.",
      },
      {
        h: "Le pointage géolocalisé, siège par siège",
        p: "Placez-vous physiquement à votre bureau pour enregistrer sa position et son rayon toléré. Si votre entreprise a plusieurs agences, chaque siège a sa propre zone — un employé de Cocody ne peut pas pointer depuis Yopougon, et inversement.",
      },
      {
        h: "Jusqu'à 3 co-administrateurs, chacun avec ses propres droits",
        p: "Déléguez sans tout céder : un co-administrateur peut valider les tâches sans pouvoir toucher aux critères, consulter les rapports sans pouvoir renvoyer un employé. Vous seul gardez le contrôle total, chaque action des autres reste tracée dans un journal d'activité consultable à tout moment.",
      },
      {
        h: "Des tâches avec échéance et priorité",
        p: "Vous assignez, l'employé exécute. Une échéance dépassée sans validation devient automatiquement visible comme un retard — sans avoir à relancer qui que ce soit.",
      },
    ],
  },
  "declaration-validation": {
    numero: "02",
    titre: "L'employé déclare, le manager valide",
    accroche:
      "Rien n'entre dans le score sans une preuve de terrain d'un côté, et un regard humain de l'autre.",
    sections: [
      {
        h: "Pointage vérifié, pas juste déclaré",
        p: "L'employé pointe son arrivée et son départ ; si le géorepérage est actif, sa position est vérifiée en temps réel. En déplacement pour le compte de l'entreprise ? Un mode « Je suis en mission » lui permet d'indiquer où il se trouve et pourquoi, avec sa position confirmée à l'appui — le manager peut vérifier sur une carte, pas seulement lire un texte.",
      },
      {
        h: "Un vrai rapport journalier, matin et soir",
        p: "Planning du matin, réalisé du soir, difficultés rencontrées, actions prévues pour le lendemain. Le manager évalue chaque rapport avec une note et un commentaire — un dialogue continu, pas un formulaire qui dort dans un tiroir.",
      },
      {
        h: "Des tâches déclarées, jamais auto-validées",
        p: "L'employé marque une tâche comme accomplie ; elle reste « en attente » jusqu'à ce que le manager la valide ou la rejette avec un commentaire. Si elle est en retard, l'employé peut indiquer pourquoi — validation manager en attente, client injoignable, budget indisponible, document manquant, problème technique. Cumulés, ces motifs révèlent parfois que l'entreprise elle-même crée le ralentissement, pas l'employé.",
      },
      {
        h: "La proactivité, prouvée et non déclarée",
        p: "Fini la case à cocher « j'ai pris une initiative ». L'employé décrit un problème identifié et la solution qu'il propose ; seule une initiative réellement validée par le manager compte dans le score de proactivité.",
      },
      {
        h: "Un droit de contestation intégré",
        p: "Un score qui semble injuste ? L'employé peut le contester directement dans l'application, avec un motif — le manager répond, tout reste écrit. Un outil de notation qui ne permet pas de se défendre n'a pas sa place ici.",
      },
    ],
  },
  "calcul-score": {
    numero: "03",
    titre: "Le score se calcule tout seul",
    accroche:
      "Un chiffre sur 100, jamais sorti de nulle part — chaque point est traçable jusqu'à l'action qui l'a produit.",
    sections: [
      {
        h: "Un score transparent, recalculé en direct",
        p: "Les 14 critères pondérés donnent un score sur 100, visible par l'employé lui-même à tout moment — pas seulement par le manager. Rien de caché, rien de figé en fin de mois : le score bouge à mesure que le travail avance.",
      },
      {
        h: "Un journal de points horodaté",
        p: "Chaque tâche validée avant délai, chaque initiative retenue, chaque semaine de collaboration ajoute des points identifiables un par un, avec leur date exacte. C'est cette même donnée qui alimente ensuite les statistiques, les archives et les comparaisons dans le temps.",
      },
      {
        h: "Un classement mensuel, avec de vraies médailles",
        p: "Le trio de tête du mois est mis en avant automatiquement. Et l'« Employé du mois » n'est jamais qu'un nom : l'application justifie son choix avec des chiffres concrets — pourcentage d'objectifs atteints, ponctualité, initiatives validées, note moyenne des collègues.",
      },
      {
        h: "Un palmarès façon compétition sportive",
        p: "Ballon d'or pour le meilleur score de l'entreprise sur un mois donné, Soulier d'or pour le meilleur de son département — calculés rétroactivement sur toute l'année, consultables dans le profil de chaque employé comme un vrai palmarès de carrière.",
      },
      {
        h: "Des comparaisons qui montrent où regarder",
        p: "Comparaison entre départements, comparaison entre sièges si votre entreprise a plusieurs agences — un coup d'œil suffit pour repérer qui tire l'équipe vers le haut, et où il faut intervenir.",
      },
      {
        h: "Des alertes avant que le problème n'éclate",
        p: "Quand la performance d'un employé ou d'un département baisse durablement sur quatre semaines, un signal apparaît — jamais un jugement du type « untel est mauvais », toujours une invitation à regarder de plus près. Détecter tôt, plutôt que subir tard.",
      },
      {
        h: "Des archives pour comparer dans le temps",
        p: "Mois par mois, trimestre par trimestre, année par année — consultez les vraies données de n'importe quelle période passée, avec comparaison automatique à la période précédente. Pas d'historique reconstitué, uniquement ce qui a réellement été enregistré.",
      },
    ],
  },
  "14-criteres": {
    numero: "14",
    titre: "14 critères de notation",
    accroche:
      "Un score n'a de valeur que si on comprend exactement ce qu'il mesure. Voici les 14 critères qui composent le score sur 100 — chacun avec son propre poids, réglable par votre entreprise.",
    sections: [
      { h: "Objectifs atteints", p: "Mesure l'avancement réel des tâches assignées à l'employé sur la période. Le critère le plus lourd par défaut, car c'est le cœur de la mission de chacun." },
      { h: "Tâches dans les délais", p: "Proportion de tâches menées à bien parmi tout ce qui a été assigné — pas seulement « fait », mais fait dans le respect des échéances fixées." },
      { h: "Productivité (KPI poste)", p: "Pensé pour refléter un indicateur clé propre au poste de l'employé (volume de dossiers traités, chiffre généré, etc.), à adapter selon le métier." },
      { h: "Proactivité", p: "Basée sur les initiatives réellement validées par le manager — jamais une simple déclaration sur l'honneur." },
      { h: "Feedback des pairs", p: "Moyenne des notes anonymes données par les collègues de travail, pour capter ce que l'évaluation hiérarchique seule ne voit pas toujours." },
      { h: "Fiabilité / autonomie", p: "Calculée à partir des absences réellement enregistrées et de leur statut (justifiée ou non) sur le mois en cours." },
      { h: "Ponctualité", p: "Calculée à partir des retards réellement détectés au pointage, avec le même principe : un retard justifié par le manager ne pénalise pas." },
      { h: "Adaptabilité", p: "Pensé pour refléter la capacité de l'employé à s'ajuster à des changements de contexte ou de priorités." },
      { h: "Communication", p: "Pensé pour refléter la clarté et la régularité des échanges de l'employé avec son équipe et sa hiérarchie." },
      { h: "Collaboration", p: "Reflète la participation réelle de l'employé à des tâches ou objectifs collectifs, pas seulement individuels." },
      { h: "Gestion des erreurs", p: "Pensé pour refléter la façon dont l'employé identifie et corrige ses propres erreurs." },
      { h: "Deadlines critiques", p: "Pensé pour mettre un accent particulier sur le respect des échéances les plus sensibles pour l'entreprise." },
      { h: "Progression (formations)", p: "Pensé pour refléter la montée en compétence de l'employé dans le temps." },
      { h: "Contribution à l'innovation", p: "Pensé pour valoriser les propositions qui vont au-delà du strict cadre du poste." },
    ],
  },
  "six-piliers": {
    numero: "06",
    titre: "6 piliers de suivi",
    accroche:
      "Toute l'application s'organise autour de six axes complémentaires — aucun ne remplace les autres, c'est leur combinaison qui donne une vision complète et honnête de l'activité.",
    sections: [
      { h: "📍 Présence", p: "Le pointage géolocalisé confirme qui est réellement là, à quelle heure — avec un mode « mission » pour les déplacements professionnels légitimes, et désormais un vrai circuit de justification des retards." },
      { h: "✅ Travail", p: "Planning du matin, réalisé du soir, tâches déclarées puis validées par le manager — le travail est suivi du début à la fin, pas juste constaté a posteriori." },
      { h: "📈 Performance", p: "Un score sur 100, transparent, recalculé en direct à partir de 14 critères pondérés — consultable par l'employé lui-même, pas seulement par le manager." },
      { h: "🛡️ Discipline", p: "Retards, absences, avertissements : tout est objectivé avec un vrai circuit de justification, jamais une sanction automatique sans explication possible." },
      { h: "👥 Management", p: "Jusqu'à 3 co-administrateurs avec des permissions personnalisées, un journal d'activité qui trace chaque action, et un modèle qui empêche un seul point de défaillance." },
      { h: "💡 Intelligence", p: "Statistiques, comparaisons entre départements et sièges, détection précoce des baisses de performance, archives par période — pour anticiper les problèmes plutôt que les subir." },
    ],
  },
  "co-administrateurs": {
    numero: "03",
    titre: "3 co-administrateurs, chacun avec ses droits",
    accroche:
      "Déléguer la gestion de l'équipe sans jamais perdre le contrôle total — c'est tout l'enjeu du système de co-administration de BossClever.",
    sections: [
      { h: "Un principal, jusqu'à 3 co-administrateurs", p: "Le manager qui crée le compte de l'entreprise reste seul « administrateur principal » : lui seul peut ajouter ou retirer un employé, gérer les sièges, ou supprimer le compte de l'entreprise. Il peut inviter jusqu'à 3 co-administrateurs pour l'assister au quotidien." },
      { h: "Des permissions choisies une par une", p: "Chaque co-administrateur reçoit exactement les droits dont il a besoin, parmi : valider les tâches, assigner des tâches, configurer les critères de notation, consulter les rapports journaliers, évaluer les rapports journaliers, résoudre les contestations." },
      { h: "Identifiés, pas anonymes", p: "Chaque co-administrateur est enregistré avec son prénom, son nom et son poste — pas juste une adresse email dans une liste." },
      { h: "Une invitation par code entreprise", p: "La personne invitée crée son propre compte manager avec le code entreprise fourni ; elle n'a jamais besoin de partager de mot de passe avec qui que ce soit." },
      { h: "Chaque action tracée", p: "Le journal d'activité, consultable par le principal, enregistre qui a fait quelle action et quand — validation de tâche, ajout d'employé, résolution de contestation... rien ne se passe dans l'ombre." },
    ],
  },
};

function PageEtape({ etape, onRetour }) {
  const contenu = TEXTES_ETAPES[etape];
  if (!contenu) return null;

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "40px 20px 60px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#20231F",
      }}
    >
      <button
        onClick={onRetour}
        style={{
          border: "none",
          background: "none",
          color: "#1877F2",
          cursor: "pointer",
          fontSize: 14,
          padding: 0,
          marginBottom: 24,
        }}
      >
        ← Retour à l'accueil
      </button>

      <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "#1877F2" }}>
        Étape {contenu.numero}
      </p>
      <h1 style={{ fontSize: 30, fontWeight: 700, margin: "0 0 14px", lineHeight: 1.2 }}>
        {contenu.titre}
      </h1>
      <p style={{ fontSize: 16, color: "#5F5E5A", lineHeight: 1.6, margin: "0 0 32px" }}>
        {contenu.accroche}
      </p>

      <div style={{ display: "grid", gap: 26 }}>
        {contenu.sections.map((s, i) => (
          <div key={i}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px" }}>{s.h}</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: "#3A3936" }}>{s.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageContact({ onRetour }) {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");

  const envoyer = () => {
    const sujet = service.trim() ? `Demande : ${service.trim()}` : "Demande de contact BossClever";
    const corps = [
      `Nom : ${prenom.trim()} ${nom.trim()}`.trim(),
      email.trim() ? `Email : ${email.trim()}` : "",
      "",
      message.trim(),
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:contact@cleverentreprises.com?subject=${encodeURIComponent(
      sujet
    )}&body=${encodeURIComponent(corps)}`;
  };

  const champStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #E5E3DA",
    fontSize: 14,
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "40px 20px 60px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#20231F",
      }}
    >
      <button
        onClick={onRetour}
        style={{
          border: "none",
          background: "none",
          color: "#1877F2",
          cursor: "pointer",
          fontSize: 14,
          padding: 0,
          marginBottom: 24,
        }}
      >
        ← Retour à l'accueil
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 32,
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#FAF9F5",
            border: "1px solid #E5E3DA",
            borderRadius: 16,
            padding: "32px 28px",
          }}
        >
          <h1 style={{ fontSize: 26, fontWeight: 600, margin: "0 0 12px" }}>Contactez-nous</h1>
          <p style={{ fontSize: 14, color: "#5F5E5A", lineHeight: 1.6, margin: "0 0 28px" }}>
            Une question, un projet ou besoin d'un devis ? Notre équipe est à votre écoute et vous
            accompagne dans les meilleurs délais.
          </p>

          <div style={{ display: "grid", gap: 20 }}>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600 }}>📍 Notre adresse</p>
              <p style={{ margin: 0, fontSize: 14, color: "#5F5E5A" }}>
                Cocody Riviera Faya, Abidjan, Côte d'Ivoire
              </p>
            </div>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600 }}>📞 Téléphone</p>
              <p style={{ margin: 0, fontSize: 14, color: "#5F5E5A" }}>
                Mobile :{" "}
                <a href="tel:+2250702354211" style={{ color: "#1877F2", textDecoration: "none" }}>
                  +225 07 02 35 42 11
                </a>
              </p>
              <p style={{ margin: 0, fontSize: 14, color: "#5F5E5A" }}>
                Fixe :{" "}
                <a href="tel:+225272240702" style={{ color: "#1877F2", textDecoration: "none" }}>
                  +225 27 22 40 07 02
                </a>
              </p>
            </div>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600 }}>✉️ E-mail</p>
              <p style={{ margin: 0, fontSize: 14, color: "#5F5E5A" }}>
                <a
                  href="mailto:contact@cleverentreprises.com"
                  style={{ color: "#1877F2", textDecoration: "none" }}
                >
                  contact@cleverentreprises.com
                </a>
              </p>
            </div>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600 }}>🕐 Horaires</p>
              <p style={{ margin: 0, fontSize: 14, color: "#5F5E5A" }}>Lundi – Vendredi : 08h00 – 17h00</p>
              <p style={{ margin: 0, fontSize: 14, color: "#5F5E5A" }}>Samedi : 08h00 – 13h00</p>
            </div>
          </div>

          <a
            href="https://wa.me/2250702354211"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 28,
              padding: "12px 22px",
              background: "#16A34A",
              color: "#fff",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Discuter sur WhatsApp
          </a>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E3DA",
            borderRadius: 16,
            padding: "32px 28px",
          }}
        >
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Nom *
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
            <input
              type="text"
              placeholder="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              style={champStyle}
            />
            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              style={champStyle}
            />
          </div>
          <p style={{ margin: "0 0 18px", fontSize: 11, color: "#5F5E5A" }}>Prénom · Nom</p>

          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            E-mail *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...champStyle, marginBottom: 18 }}
          />

          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Service souhaité
          </label>
          <input
            type="text"
            placeholder="Ex : Plan Entreprise BossClever"
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={{ ...champStyle, marginBottom: 18 }}
          />

          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Décrivez votre besoin
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ ...champStyle, height: 120, marginBottom: 20, resize: "vertical" }}
          />

          <button
            onClick={envoyer}
            disabled={!prenom.trim() || !nom.trim() || !email.trim()}
            style={{
              padding: "12px 24px",
              background: "#1877F2",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              opacity: !prenom.trim() || !nom.trim() || !email.trim() ? 0.5 : 1,
            }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

const CRITERES = [
  { key: "objectifs", label: "Objectifs atteints", poids: 18 },
  { key: "taches", label: "Tâches dans les délais", poids: 14 },
  { key: "productivite", label: "Productivité (KPI poste)", poids: 12, fixe: 80 },
  { key: "proactivite", label: "Proactivité", poids: 9 },
  { key: "feedback", label: "Feedback des pairs", poids: 8 },
  { key: "fiabilite", label: "Fiabilité / autonomie", poids: 7 },
  { key: "ponctualite", label: "Ponctualité", poids: 6 },
  { key: "adaptabilite", label: "Adaptabilité", poids: 6, fixe: 80 },
  { key: "communication", label: "Communication", poids: 5, fixe: 80 },
  { key: "collaboration", label: "Collaboration", poids: 4 },
  { key: "erreurs", label: "Gestion des erreurs", poids: 4, fixe: 85 },
  { key: "deadlines", label: "Deadlines critiques", poids: 3, fixe: 80 },
  { key: "progression", label: "Progression (formations)", poids: 2, fixe: 70 },
  { key: "innovation", label: "Contribution à l'innovation", poids: 2, fixe: 70 },
];

const EMPLOYES_INIT = [
  {
    id: 1,
    nom: "Aïcha Fofana",
    dept: "Marketing",
    initiales: "AF",
    historiquePointage: [],
    taches: [
      { id: 1, titre: "Rapport mensuel clients", statut: "en_attente", commentaire: "" },
      { id: 2, titre: "Campagne réseaux sociaux", statut: "a_faire", commentaire: "" },
    ],
    retards: 0,
    equipe: true,
    notesPairs: [4, 5, 4],
    contestations: [],
    journalPoints: [],
    rapportsJournaliers: [],
    avatarUrl: "",
    site: "",
    absences: [],
    objectifs: [],
    entretiens: [],
    retardsTotalVie: 0,
    initiatives: [],
    avertissements: [],
    parcours: [],
    dateEntree: null,
  },
  {
    id: 2,
    nom: "Koffi Diarra",
    dept: "Comptabilité",
    initiales: "KD",
    historiquePointage: [],
    taches: [
      { id: 3, titre: "Clôture comptable juillet", statut: "en_attente", commentaire: "" },
      { id: 4, titre: "Rapprochement bancaire", statut: "a_faire", commentaire: "" },
    ],
    retards: 1,
    equipe: true,
    notesPairs: [4, 3],
    contestations: [],
    journalPoints: [],
    rapportsJournaliers: [],
    avatarUrl: "",
    site: "",
    absences: [],
    objectifs: [],
    entretiens: [],
    retardsTotalVie: 0,
    initiatives: [],
    avertissements: [],
    parcours: [],
    dateEntree: null,
  },
  {
    id: 3,
    nom: "Sara Bamba",
    dept: "RH",
    initiales: "SB",
    historiquePointage: [],
    taches: [{ id: 5, titre: "Entretiens candidats", statut: "a_faire", commentaire: "" }],
    retards: 0,
    equipe: false,
    notesPairs: [3, 4],
    contestations: [],
    journalPoints: [],
    rapportsJournaliers: [],
    avatarUrl: "",
    site: "",
    absences: [],
    objectifs: [],
    entretiens: [],
    retardsTotalVie: 0,
    initiatives: [],
    avertissements: [],
    parcours: [],
    dateEntree: null,
  },
];

function moyenne(arr) {
  if (!arr.length) return 75;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function dateJourISO() {
  return new Date().toISOString().slice(0, 10);
}

// Distance en mètres entre deux points GPS (formule de Haversine), utilisée
// pour vérifier qu'un employé est bien physiquement près du bureau avant
// d'autoriser son pointage.
function distanceMetres(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function obtenirPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("La géolocalisation n'est pas disponible sur cet appareil."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  });
}

function rapportDuJour(emp) {
  const d = dateJourISO();
  return (emp.rapportsJournaliers || []).find((r) => r.date === d) || null;
}

// Un seul enregistrement de pointage par jour et par employé (arrivée et,
// une fois la journée finie, départ) — évite qu'un pointage d'un jour
// précédent ne reste affiché indéfiniment comme "présent".
function pointageDuJour(emp) {
  const d = dateJourISO();
  return (emp.historiquePointage || []).find((p) => p.date === d) || null;
}

function minutesEcart(heureAttendue, heureReelle) {
  const [ha, ma] = heureAttendue.split(":").map(Number);
  const [hr, mr] = heureReelle.split(":").map(Number);
  return hr * 60 + mr - (ha * 60 + ma);
}

function rapportVide(date) {
  return {
    id: Date.now(),
    date,
    planning: [],
    realise: [],
    difficultes: "",
    actionsDemain: "",
    envoye: false,
    envoyeLe: null,
    evaluation: null,
  };
}

// Le statut d'un objectif dépend de la façon dont il a été construit :
// s'il a des tâches rattachées, il est atteint automatiquement dès
// qu'elles sont toutes validées ; sinon (objectif qualitatif, sans tâche
// précise), c'est le manager qui tranche à la main.
function statutObjectif(objectif, taches) {
  if (objectif.statutManuel) return objectif.statutManuel;
  const tachesLiees = taches.filter((t) => t.objectifId === objectif.id);
  if (tachesLiees.length === 0) return "en_cours";
  return tachesLiees.every((t) => t.statut === "validee") ? "atteint" : "en_cours";
}

function calculerScore(emp, criteres = CRITERES) {
  const tachesValidees = emp.taches.filter((t) => t.statut === "validee").length;
  const tachesTotal = emp.taches.length || 1;
  const initiativesValidees = (emp.initiatives || []).filter((i) => i.statut === "validee").length;

  // Un retard ou une absence « en attente » de réponse du manager pénalise
  // temporairement, comme s'il n'était pas justifié — le score se corrige
  // automatiquement dès que le manager tranche. Seul un retard/une absence
  // explicitement justifié(e) (accepté / validée) est neutre pour le score.
  const maintenant = new Date();
  const memeMois = (dateValue) => {
    const d = new Date(dateValue);
    return d.getFullYear() === maintenant.getFullYear() && d.getMonth() === maintenant.getMonth();
  };
  const retardsNonJustifiesCeMois = (emp.historiquePointage || []).filter(
    (p) => p.enRetard && p.statutRetard !== "acceptee" && memeMois(p.date)
  ).length;
  const absencesNonJustifieesCeMois = (emp.absences || []).filter(
    (a) => a.statut !== "validee" && memeMois(a.date)
  ).length;

  const objectifsDefinis = emp.objectifs || [];
  const objectifsAtteints = objectifsDefinis.filter(
    (o) => statutObjectif(o, emp.taches) === "atteint"
  ).length;

  const valeurs = {
    objectifs:
      objectifsDefinis.length > 0
        ? Math.round((objectifsAtteints / objectifsDefinis.length) * 100)
        : emp.taches.every((t) => t.statut !== "a_faire")
        ? 90
        : 60,
    taches: Math.round((tachesValidees / tachesTotal) * 100),
    ponctualite: Math.max(0, 100 - retardsNonJustifiesCeMois * 15),
    proactivite: Math.min(100, 55 + initiativesValidees * 15),
    collaboration: emp.equipe ? 90 : 55,
    feedback: Math.round((moyenne(emp.notesPairs) / 5) * 100),
    fiabilite: Math.max(0, 100 - absencesNonJustifieesCeMois * 20),
  };
  let total = 0;
  const detail = criteres.map((c) => {
    const v = c.fixe !== undefined ? c.fixe : valeurs[c.key];
    total += (v * c.poids) / 100;
    return { ...c, valeur: v };
  });
  return { score: Math.round(total), detail };
}

// Résumé compact des vraies données de l'équipe, envoyé à l'assistant —
// jamais les objets employés bruts (trop volumineux, et certains détails
// n'ont rien à faire dans un appel à un service tiers). Uniquement des
// chiffres déjà calculés ailleurs dans l'application.
function construireContexteAssistant(employes, criteres) {
  const maintenant = new Date();
  const memeMois = (dateValue) => {
    const d = new Date(dateValue);
    return d.getFullYear() === maintenant.getFullYear() && d.getMonth() === maintenant.getMonth();
  };

  return employes.map((e) => {
    const { score } = calculerScore(e, criteres);
    const retardsCeMois = (e.historiquePointage || []).filter((p) => p.enRetard && memeMois(p.date)).length;
    const absencesCeMois = (e.absences || []).filter((a) => memeMois(a.date)).length;
    return {
      nom: e.nom,
      departement: e.dept,
      scoreActuel: score,
      tachesAFaire: e.taches.filter((t) => t.statut === "a_faire").length,
      tachesEnAttenteValidation: e.taches.filter((t) => t.statut === "en_attente").length,
      tachesValidees: e.taches.filter((t) => t.statut === "validee").length,
      retardsCeMois,
      absencesCeMois,
      initiativesValidees: (e.initiatives || []).filter((i) => i.statut === "validee").length,
      noteMoyenneCollegues: e.notesPairs.length ? Math.round((moyenne(e.notesPairs) / 5) * 100) / 20 : null,
      avertissements: (e.avertissements || []).length,
    };
  });
}

async function poserQuestionAssistant(question, contexte) {
  const reponse = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, contexte }),
  });
  const data = await reponse.json();
  if (!reponse.ok) throw new Error(data.error || "L'assistant n'a pas pu répondre.");
  return data.reponse;
}

function exporterPDF(classement, criteres) {
  const date = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const lignesEmployes = classement
    .map(
      (e, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${e.nom}</td>
        <td>${e.dept}</td>
        <td style="text-align:right; font-weight:600;">${e.score}</td>
      </tr>`
    )
    .join("");

  const detailParEmploye = classement
    .map(
      (e) => `
      <h3>${e.nom} — ${e.dept} (score : ${e.score})</h3>
      <table>
        <thead><tr><th>Critère</th><th>Poids</th><th>Valeur</th></tr></thead>
        <tbody>
          ${e.detail
            .map(
              (d) =>
                `<tr><td>${d.label}</td><td>${d.poids}%</td><td>${d.valeur}/100</td></tr>`
            )
            .join("")}
        </tbody>
      </table>`
    )
    .join("");

  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
    <title>Rapport BossClever</title>
    <style>
      body { font-family: -apple-system, Arial, sans-serif; color: #2C2C2A; padding: 40px; }
      h1 { font-size: 20px; margin-bottom: 2px; }
      p.date { color: #5F5E5A; font-size: 13px; margin-top: 0; }
      table { width: 100%; border-collapse: collapse; margin: 12px 0 24px; font-size: 13px; }
      th, td { border-bottom: 1px solid #E5E3DA; padding: 6px 8px; text-align: left; }
      th { color: #5F5E5A; font-weight: 500; }
      h3 { font-size: 14px; margin: 20px 0 6px; }
      @media print { body { padding: 10px; } }
    </style></head>
    <body>
      <h1>BossClever — Rapport de classement</h1>
      <p class="date">Généré le ${date}</p>
      <table>
        <thead><tr><th>Rang</th><th>Employé</th><th>Département</th><th>Score</th></tr></thead>
        <tbody>${lignesEmployes}</tbody>
      </table>
      <h2 style="font-size:16px;">Détail par employé</h2>
      ${detailParEmploye}
      <script>window.onload = () => window.print();</script>
    </body></html>`;

  const fenetre = window.open("", "_blank");
  if (fenetre) {
    fenetre.document.write(html);
    fenetre.document.close();
  }
}

function exporterRapportPDF(emp, rapport) {
  const dateAffichee = new Date(rapport.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const lignesPlanning = rapport.planning
    .map(
      (l) => `
      <tr>
        <td>${l.heure || "—"}</td>
        <td>${l.tache}</td>
        <td>${l.objectif || "—"}</td>
        <td>${l.priorite || "—"}</td>
      </tr>`
    )
    .join("");

  const lignesRealise = rapport.realise
    .map(
      (l) => `
      <tr>
        <td>${l.heure || "—"}</td>
        <td>${l.action}</td>
        <td>${l.resultat || "—"}</td>
        <td>${l.statut === "fait" ? "Fait" : "À suivre"}</td>
      </tr>`
    )
    .join("");

  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
    <title>Rapport journalier — ${emp.nom}</title>
    <style>
      body { font-family: -apple-system, Arial, sans-serif; color: #2C2C2A; padding: 40px; }
      h1 { font-size: 20px; margin-bottom: 2px; }
      p.date { color: #5F5E5A; font-size: 13px; margin-top: 0; text-transform: capitalize; }
      table { width: 100%; border-collapse: collapse; margin: 12px 0 24px; font-size: 13px; }
      th, td { border-bottom: 1px solid #E5E3DA; padding: 6px 8px; text-align: left; }
      th { color: #5F5E5A; font-weight: 500; }
      h3 { font-size: 14px; margin: 20px 0 6px; }
      p.texte { font-size: 13px; line-height: 1.5; white-space: pre-wrap; }
      .eval { background: #F1EFE8; border-radius: 8px; padding: 12px 16px; margin-top: 16px; }
      @media print { body { padding: 10px; } }
    </style></head>
    <body>
      <h1>BossClever — Rapport journalier</h1>
      <p class="date">${emp.nom} — ${emp.dept} — ${dateAffichee}</p>

      <h3>Planning de la journée</h3>
      <table>
        <thead><tr><th>Heure</th><th>Tâche prévue</th><th>Objectif attendu</th><th>Priorité</th></tr></thead>
        <tbody>${lignesPlanning || "<tr><td colspan='4'>Aucune tâche planifiée</td></tr>"}</tbody>
      </table>

      <h3>Activités réalisées</h3>
      <table>
        <thead><tr><th>Heure</th><th>Action réalisée</th><th>Résultat obtenu</th><th>Statut</th></tr></thead>
        <tbody>${lignesRealise || "<tr><td colspan='4'>Rien de déclaré</td></tr>"}</tbody>
      </table>

      <h3>Difficultés rencontrées</h3>
      <p class="texte">${rapport.difficultes || "Aucune difficulté signalée."}</p>

      <h3>Actions prioritaires prévues pour demain</h3>
      <p class="texte">${rapport.actionsDemain || "Non renseigné."}</p>

      ${
        rapport.evaluation
          ? `<div class="eval">
              <h3 style="margin-top:0;">Évaluation du manager</h3>
              <p class="texte"><strong>Note :</strong> ${rapport.evaluation.note}/5</p>
              <p class="texte">${rapport.evaluation.commentaire || "Aucun commentaire."}</p>
            </div>`
          : ""
      }

      <script>window.onload = () => window.print();</script>
    </body></html>`;

  const fenetre = window.open("", "_blank");
  if (fenetre) {
    fenetre.document.write(html);
    fenetre.document.close();
  }
}

// Rapport de présence RH : une feuille exportable pour la paie ou un
// dossier administratif — un vrai détail jour par jour, avec la
// distinction justifié / non justifié, pas seulement un total brut.
function genererRapportPresenceHTML(employes, periode, libellePeriode) {
  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const blocsEmployes = employes
    .map((e) => {
      const pointagesPeriode = (e.historiquePointage || [])
        .filter((p) => dansPeriode(p.date, periode))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      const absencesPeriode = (e.absences || [])
        .filter((a) => dansPeriode(a.date, periode))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const retardsJustifies = pointagesPeriode.filter((p) => p.enRetard && p.statutRetard === "acceptee").length;
      const retardsNonJustifies = pointagesPeriode.filter((p) => p.enRetard && p.statutRetard !== "acceptee").length;
      const absencesJustifiees = absencesPeriode.filter((a) => a.statut === "validee").length;
      const absencesNonJustifiees = absencesPeriode.filter((a) => a.statut !== "validee").length;

      const lignesPointage = pointagesPeriode
        .map((p) => {
          const statutRetard = !p.enRetard
            ? "—"
            : p.statutRetard === "acceptee"
            ? "Justifié"
            : p.statutRetard === "refusee"
            ? "Non justifié"
            : "En attente";
          return `<tr>
            <td>${new Date(p.date).toLocaleDateString("fr-FR")}</td>
            <td>${p.arrivee || "—"}</td>
            <td>${p.depart || "—"}</td>
            <td>${p.enMission ? "Oui — " + (p.lieuMission || "") : "Non"}</td>
            <td>${statutRetard}</td>
          </tr>`;
        })
        .join("");

      const lignesAbsences = absencesPeriode
        .map(
          (a) => `<tr>
            <td>${new Date(a.date).toLocaleDateString("fr-FR")}</td>
            <td>${a.motif}</td>
            <td>${a.statut === "validee" ? "Justifiée" : a.statut === "refusee" ? "Refusée" : "En attente"}</td>
          </tr>`
        )
        .join("");

      return `
        <h2>${e.nom} — ${e.dept}</h2>
        <table class="resume">
          <tr><td>Jours pointés</td><td>${pointagesPeriode.filter((p) => p.arrivee).length}</td></tr>
          <tr><td>Retards justifiés</td><td>${retardsJustifies}</td></tr>
          <tr><td>Retards non justifiés</td><td>${retardsNonJustifies}</td></tr>
          <tr><td>Absences justifiées</td><td>${absencesJustifiees}</td></tr>
          <tr><td>Absences non justifiées</td><td>${absencesNonJustifiees}</td></tr>
        </table>
        ${
          lignesPointage
            ? `<table><thead><tr><th>Date</th><th>Arrivée</th><th>Départ</th><th>Mission</th><th>Retard</th></tr></thead><tbody>${lignesPointage}</tbody></table>`
            : `<p class="vide">Aucun pointage enregistré sur cette période.</p>`
        }
        ${
          lignesAbsences
            ? `<p class="souligne">Absences</p><table><thead><tr><th>Date</th><th>Motif</th><th>Statut</th></tr></thead><tbody>${lignesAbsences}</tbody></table>`
            : ""
        }
      `;
    })
    .join("");

  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
    <title>Rapport de présence RH — BossClever</title>
    <style>
      body { font-family: -apple-system, Arial, sans-serif; color: #2C2C2A; padding: 40px; }
      h1 { font-size: 20px; margin-bottom: 2px; }
      p.date { color: #5F5E5A; font-size: 13px; margin-top: 0; }
      h2 { font-size: 15px; margin: 26px 0 8px; border-top: 1px solid #E5E3DA; padding-top: 16px; }
      p.souligne { font-size: 12px; color: #5F5E5A; margin: 14px 0 4px; font-weight: 600; }
      p.vide { font-size: 13px; color: #5F5E5A; }
      table { width: 100%; border-collapse: collapse; margin: 6px 0 10px; font-size: 12.5px; }
      table.resume { width: auto; margin-bottom: 12px; }
      table.resume td { border: none; padding: 2px 16px 2px 0; }
      th, td { border-bottom: 1px solid #E5E3DA; padding: 5px 8px; text-align: left; }
      th { color: #5F5E5A; font-weight: 500; }
      @media print { body { padding: 10px; } h2 { break-before: auto; } }
    </style></head>
    <body>
      <h1>BossClever — Rapport de présence RH</h1>
      <p class="date">Période : ${libellePeriode} · Généré le ${date}</p>
      ${blocsEmployes}
      <script>window.onload = () => window.print();</script>
    </body></html>`;

  const fenetre = window.open("", "_blank");
  if (fenetre) {
    fenetre.document.write(html);
    fenetre.document.close();
  }
}

// Export CSV — pensé pour être importé tel quel dans un logiciel de paie
// ou un tableur RH : une ligne par jour de pointage réel, colonnes
// stables, encodage compatible Excel.
function exporterPresenceCSV(employes, periode, libellePeriode) {
  const lignes = [["Employé", "Département", "Date", "Arrivée", "Départ", "En mission", "Statut retard"]];

  employes.forEach((e) => {
    (e.historiquePointage || [])
      .filter((p) => dansPeriode(p.date, periode))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach((p) => {
        const statutRetard = !p.enRetard
          ? ""
          : p.statutRetard === "acceptee"
          ? "Justifié"
          : p.statutRetard === "refusee"
          ? "Non justifié"
          : "En attente";
        lignes.push([
          e.nom,
          e.dept,
          new Date(p.date).toLocaleDateString("fr-FR"),
          p.arrivee || "",
          p.depart || "",
          p.enMission ? "Oui" : "Non",
          statutRetard,
        ]);
      });
    (e.absences || [])
      .filter((a) => dansPeriode(a.date, periode))
      .forEach((a) => {
        lignes.push([
          e.nom,
          e.dept,
          new Date(a.date).toLocaleDateString("fr-FR"),
          "ABSENCE",
          a.motif,
          "",
          a.statut === "validee" ? "Absence justifiée" : "Absence non justifiée",
        ]);
      });
  });

  const csv = lignes
    .map((ligne) => ligne.map((champ) => `"${String(champ).replace(/"/g, '""')}"`).join(";"))
    .join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = `presence-bossclever-${libellePeriode.replace(/\s+/g, "-").toLowerCase()}.csv`;
  lien.click();
  URL.revokeObjectURL(url);
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "#F1EFE8", text: "#444441" },
    success: { bg: "#EAF3DE", text: "#27500A" },
    warning: { bg: "#FFF6DA", text: "#7A5B00" },
    accent: { bg: "#E7F0FE", text: "#0F4FA8" },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        background: t.bg,
        color: t.text,
        fontSize: 12,
        padding: "3px 10px",
        borderRadius: 20,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function Avatar({ initiales, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "#F1EFE8", text: "#444441" },
    success: { bg: "#EAF3DE", text: "#27500A" },
    accent: { bg: "#E7F0FE", text: "#1877F2" },
  };
  const t = tones[tone];
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: t.bg,
        color: t.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {initiales}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E3DA",
        borderRadius: 12,
        padding: "1.1rem 1.25rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Alerte({ children, tone = "warning" }) {
  const tones = {
    warning: { bg: "#FFF6DA", text: "#7A5B00", border: "#F0E0A8" },
    accent: { bg: "#E7F0FE", text: "#0F4FA8", border: "#C7DBFB" },
  };
  const t = tones[tone];
  return (
    <div
      style={{
        background: t.bg,
        color: t.text,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      🔔 {children}
    </div>
  );
}

function Bouton({ children, onClick, variant = "secondary", style, disabled }) {
  const variants = {
    primary: { background: "#1877F2", color: "#fff", border: "none" },
    success: { background: "#0F6E56", color: "#fff", border: "none" },
    danger: { background: "#fff", color: "#993C1D", border: "1px solid #E5E3DA" },
    secondary: { background: "#fff", color: "#2C2C2A", border: "1px solid #E5E3DA" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        padding: "9px 16px",
        borderRadius: 8,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "inherit",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function EcranCriteres({ criteres, setCriteres, fermer }) {
  const total = criteres.reduce((s, c) => s + c.poids, 0);

  const modifierPoids = (key, val) =>
    setCriteres((prev) => prev.map((c) => (c.key === key ? { ...c, poids: val } : c)));

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Configuration des critères</h3>
        <Badge tone={total === 100 ? "success" : "warning"}>Total {total}%</Badge>
      </div>
      {total !== 100 && (
        <p style={{ fontSize: 13, color: "#7A5B00", margin: 0 }}>
          Ajustez les poids pour revenir à 100% au total avant de fermer.
        </p>
      )}
      <div style={{ display: "grid", gap: 10 }}>
        {criteres.map((c) => (
          <Card key={c.key} style={{ padding: "10px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ flex: 1, fontSize: 14 }}>{c.label}</span>
              <input
                type="number"
                min="0"
                max="100"
                value={c.poids}
                onChange={(e) => modifierPoids(c.key, Number(e.target.value))}
                style={{
                  width: 56,
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: "1px solid #E5E3DA",
                  fontSize: 14,
                  textAlign: "right",
                }}
              />
              <span style={{ fontSize: 13, color: "#5F5E5A" }}>%</span>
            </div>
          </Card>
        ))}
      </div>
      <Bouton variant="primary" onClick={fermer}>
        Retour au tableau de bord
      </Bouton>
    </div>
  );
}

function TacheAValiderCard({ tache, valider, rejeter, desactive }) {
  const [commentaire, setCommentaire] = useState("");
  return (
    <Card style={{ padding: "12px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14 }}>{tache.titre}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
            Déclaré par {tache.empNom}
          </p>
        </div>
      </div>
      <input
        type="text"
        placeholder="Commentaire pour l'employé (optionnel)"
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        disabled={desactive}
        style={{
          width: "100%",
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid #E5E3DA",
          fontSize: 13,
          marginBottom: 8,
          boxSizing: "border-box",
        }}
      />
      {desactive && (
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "#993C1D" }}>
          Validation suspendue — l'effectif dépasse les limites du plan actuel.
        </p>
      )}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Bouton variant="danger" onClick={() => rejeter(tache.empId, tache.id, commentaire)} disabled={desactive}>
          Rejeter
        </Bouton>
        <Bouton variant="success" onClick={() => valider(tache.empId, tache.id, commentaire)} disabled={desactive}>
          Valider
        </Bouton>
      </div>
    </Card>
  );
}

function InitiativeAValiderCard({ initiative, valider, rejeter, desactive }) {
  const [commentaire, setCommentaire] = useState("");
  return (
    <Card style={{ padding: "12px 16px" }}>
      <div style={{ marginBottom: 8 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{initiative.titre}</p>
        <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>Proposée par {initiative.empNom}</p>
      </div>
      {initiative.probleme && (
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "#5F5E5A" }}>
          <strong>Problème :</strong> {initiative.probleme}
        </p>
      )}
      <p style={{ margin: "0 0 10px", fontSize: 13, color: "#5F5E5A" }}>
        <strong>Solution :</strong> {initiative.solution}
      </p>
      <input
        type="text"
        placeholder="Commentaire pour l'employé (optionnel)"
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        disabled={desactive}
        style={{
          width: "100%",
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid #E5E3DA",
          fontSize: 13,
          marginBottom: 8,
          boxSizing: "border-box",
        }}
      />
      {desactive && (
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "#993C1D" }}>
          Validation suspendue — l'effectif dépasse les limites du plan actuel.
        </p>
      )}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Bouton variant="danger" onClick={() => rejeter(initiative.empId, initiative.id, commentaire)} disabled={desactive}>
          Ne pas retenir
        </Bouton>
        <Bouton variant="success" onClick={() => valider(initiative.empId, initiative.id, commentaire)} disabled={desactive}>
          Valider (+10 pts)
        </Bouton>
      </div>
    </Card>
  );
}

// Icônes légères en SVG inline (pas de dépendance externe), pour garder
// le style visuel cohérent avec la landing page sans alourdir le bundle.
function IconPlanning() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
    </svg>
  );
}
function IconRealise() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
function IconBilan() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19V5a1 1 0 0 1 1-1h9l6 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" strokeLinejoin="round" />
      <path d="M14 4v5h5M8 13h5M8 16h8" strokeLinecap="round" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" />
    </svg>
  );
}

const STYLES_RAPPORT = `
  .rj-wrap { --rj-blue: #1877F2; --rj-yellow: #FFD93B; --rj-ink: #2C2C2A; --rj-muted: #5F5E5A; --rj-line: #E5E3DA; }
  .rj-card {
    background: #fff; border: 1px solid var(--rj-line); border-radius: 14px;
    overflow: hidden; display: flex;
  }
  .rj-tabs {
    display: flex; flex-direction: column; gap: 2px; padding: 10px;
    background: #FAF9F5; border-right: 1px solid var(--rj-line); min-width: 168px;
  }
  .rj-tab {
    display: flex; align-items: center; gap: 9px; padding: 9px 12px;
    border-radius: 8px; border: none; background: transparent; cursor: pointer;
    font-size: 13px; color: var(--rj-muted); text-align: left; font-family: inherit;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .rj-tab:hover { background: #F1EFE8; color: var(--rj-ink); }
  .rj-tab.active { background: var(--rj-blue); color: #fff; }
  .rj-tab .count {
    margin-left: auto; font-size: 11px; background: rgba(0,0,0,0.08);
    border-radius: 20px; padding: 1px 7px;
  }
  .rj-tab.active .count { background: rgba(255,255,255,0.25); }
  .rj-panel { flex: 1; padding: 18px 20px; min-width: 0; }
  .rj-panel-inner { animation: rj-fade-in 0.28s ease; }
  @keyframes rj-fade-in {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .rj-panel-inner { animation: none; }
  }
  .rj-row {
    display: flex; align-items: center; gap: 10px; font-size: 13px;
    padding: 8px 12px; border: 1px solid var(--rj-line); border-radius: 8px;
    background: #fff; transition: border-color 0.15s ease;
  }
  .rj-row:hover { border-color: #C9C6BA; }
  .rj-row-time {
    display: flex; align-items: center; gap: 4px; color: var(--rj-muted);
    width: 54px; flex-shrink: 0; font-size: 12px;
  }
  .rj-empty { font-size: 13px; color: var(--rj-muted); padding: 14px 0; text-align: center; }
  @media (max-width: 640px) {
    .rj-card { flex-direction: column; }
    .rj-tabs { flex-direction: row; overflow-x: auto; border-right: none; border-bottom: 1px solid var(--rj-line); min-width: 0; }
    .rj-tab { white-space: nowrap; }
  }
`;

function LigneRapportLecture({ heure, principal, secondaire, badge, tone }) {
  return (
    <div className="rj-row">
      <span className="rj-row-time">
        <IconClock /> {heure || "—"}
      </span>
      <span style={{ flex: 1 }}>
        {principal}
        {secondaire && <span style={{ color: "var(--rj-muted)" }}> — {secondaire}</span>}
      </span>
      {badge && <Badge tone={tone}>{badge}</Badge>}
    </div>
  );
}

function RapportsJournaliersManager({ employes, evaluerRapport, peutEvaluer = true }) {
  const [empChoisiId, setEmpChoisiId] = useState(employes[0]?.id);
  const [dateChoisie, setDateChoisie] = useState(dateJourISO());
  const [onglet, setOnglet] = useState("planning");
  const [note, setNote] = useState(3);
  const [commentaire, setCommentaire] = useState("");
  const [enregistre, setEnregistre] = useState(false);

  const empChoisi = employes.find((e) => e.id === empChoisiId) || employes[0];
  const rapport = empChoisi
    ? (empChoisi.rapportsJournaliers || []).find((r) => r.date === dateChoisie)
    : null;

  useEffect(() => {
    if (rapport?.evaluation) {
      setNote(rapport.evaluation.note);
      setCommentaire(rapport.evaluation.commentaire || "");
    } else {
      setNote(3);
      setCommentaire("");
    }
  }, [empChoisiId, dateChoisie]);

  const envoyesAujourdhui = employes.filter((e) =>
    (e.rapportsJournaliers || []).some((r) => r.date === dateJourISO() && r.envoye)
  ).length;

  const onglets = [
    { id: "planning", label: "Planning", icone: <IconPlanning />, count: rapport?.planning.length || 0 },
    { id: "realise", label: "Réalisé", icone: <IconRealise />, count: rapport?.realise.length || 0 },
    { id: "bilan", label: "Bilan & évaluation", icone: <IconBilan />, count: 0 },
  ];

  return (
    <div className="rj-wrap">
      <style>{STYLES_RAPPORT}</style>
      <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>Rapports journaliers</h3>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
        {envoyesAujourdhui}/{employes.length} rapport{employes.length > 1 ? "s" : ""} envoyé
        {envoyesAujourdhui > 1 ? "s" : ""} aujourd'hui.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <select
          value={empChoisiId}
          onChange={(e) => setEmpChoisiId(Number(e.target.value))}
          style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #E5E3DA", fontSize: 13 }}
        >
          {employes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nom}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateChoisie}
          max={dateJourISO()}
          onChange={(e) => setDateChoisie(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #E5E3DA", fontSize: 13 }}
        />
        {rapport && (
          <Badge tone={rapport.envoye ? "success" : "warning"}>
            {rapport.envoye ? "Envoyé" : "Brouillon — non envoyé"}
          </Badge>
        )}
      </div>

      {!rapport && (
        <Card>
          <p className="rj-empty">Aucun rapport pour cette date.</p>
        </Card>
      )}

      {rapport && (
        <div className="rj-card">
          <div className="rj-tabs">
            {onglets.map((o) => (
              <button
                key={o.id}
                className={`rj-tab ${onglet === o.id ? "active" : ""}`}
                onClick={() => setOnglet(o.id)}
              >
                {o.icone}
                {o.label}
                {o.count > 0 && <span className="count">{o.count}</span>}
              </button>
            ))}
          </div>

          <div className="rj-panel">
            <div className="rj-panel-inner" key={onglet + empChoisiId + dateChoisie}>
              {onglet === "planning" && (
                <div>
                  <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 500 }}>Planning prévu</p>
                  {rapport.planning.length === 0 ? (
                    <p className="rj-empty">Aucune tâche planifiée.</p>
                  ) : (
                    <div style={{ display: "grid", gap: 6 }}>
                      {rapport.planning.map((l) => (
                        <LigneRapportLecture
                          key={l.id}
                          heure={l.heure}
                          principal={l.tache}
                          secondaire={l.objectif}
                          badge={l.priorite}
                          tone={l.priorite === "Haute" ? "warning" : "neutral"}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {onglet === "realise" && (
                <div>
                  <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 500 }}>
                    Ce qui a été réalisé
                  </p>
                  {rapport.realise.length === 0 ? (
                    <p className="rj-empty">Rien de déclaré.</p>
                  ) : (
                    <div style={{ display: "grid", gap: 6 }}>
                      {rapport.realise.map((l) => (
                        <LigneRapportLecture
                          key={l.id}
                          heure={l.heure}
                          principal={l.action}
                          secondaire={l.resultat}
                          badge={l.statut === "fait" ? "Fait" : "À suivre"}
                          tone={l.statut === "fait" ? "success" : "warning"}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {onglet === "bilan" && (
                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500 }}>
                      Difficultés rencontrées
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: "#5F5E5A" }}>
                      {rapport.difficultes || "Aucune difficulté signalée."}
                    </p>
                  </div>

                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500 }}>
                      Actions prévues pour demain
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: "#5F5E5A" }}>
                      {rapport.actionsDemain || "Non renseigné."}
                    </p>
                  </div>

                  <Bouton onClick={() => exporterRapportPDF(empChoisi, rapport)}>
                    Exporter en PDF
                  </Bouton>

                  {peutEvaluer && (
                  <div style={{ borderTop: "1px solid #E5E3DA", paddingTop: 14, display: "grid", gap: 10 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>
                      Évaluer / commenter ce rapport
                    </p>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setNote(n)}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 6,
                            border: "1px solid #E5E3DA",
                            background: n <= note ? "#1877F2" : "#fff",
                            color: n <= note ? "#fff" : "#2C2C2A",
                            fontSize: 13,
                            cursor: "pointer",
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Annotation ou commentaire pour l'employé"
                      value={commentaire}
                      onChange={(e) => setCommentaire(e.target.value)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 6,
                        border: "1px solid #E5E3DA",
                        fontSize: 13,
                        height: 60,
                        boxSizing: "border-box",
                      }}
                    />
                    <Bouton
                      variant="primary"
                      onClick={() => {
                        evaluerRapport(empChoisi.id, rapport.date, { note, commentaire });
                        setEnregistre(true);
                        setTimeout(() => setEnregistre(false), 3000);
                      }}
                    >
                      {enregistre
                        ? "✓ Enregistré"
                        : rapport.evaluation
                        ? "Mettre à jour l'évaluation"
                        : "Enregistrer l'évaluation"}
                    </Bouton>
                  </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const PLANS = [
  {
    id: "decouverte",
    nom: "Découverte",
    prix: "Gratuit",
    suffixe: "",
    limites: "Jusqu'à 3 employés · 1 administrateur",
    maxEmployes: 3,
    maxCoAdmins: 0,
    fonctionnalites: ["Pointage et tâches", "Score sur 100", "Rapport journalier basique"],
  },
  {
    id: "essentiel",
    nom: "Essentiel",
    prix: "15 000",
    suffixe: "FCFA/mois",
    payant: true,
    limites: "Jusqu'à 10 employés · 1 co-administrateur inclus",
    maxEmployes: 10,
    maxCoAdmins: 1,
    fonctionnalites: ["Pointage géolocalisé", "Rapports journaliers complets", "Export PDF"],
  },
  {
    id: "croissance",
    nom: "Croissance",
    prix: "35 000",
    suffixe: "FCFA/mois",
    populaire: true,
    payant: true,
    limites: "Jusqu'à 30 employés · 3 co-administrateurs",
    maxEmployes: 30,
    maxCoAdmins: 3,
    fonctionnalites: [
      "Permissions personnalisées par co-administrateur",
      "Statistiques avancées et comparaison par département",
      "Logo entreprise, support prioritaire",
    ],
  },
  {
    id: "entreprise",
    nom: "Entreprise",
    prix: "Sur devis",
    suffixe: "",
    limites: "Employés illimités · plusieurs sites",
    maxEmployes: Infinity,
    maxCoAdmins: Infinity,
    fonctionnalites: ["Accompagnement dédié", "Besoins spécifiques"],
  },
];

// Le compte manager passe en mode "gestion gelée" dès que l'effectif ou le
// nombre de co-administrateurs dépasse la limite du plan actuel — que ce
// soit après une échéance dépassée, ou simplement parce que l'entreprise a
// grandi. Les employés continuent de travailler normalement (pointage,
// tâches, rapports) ; seules les actions de gestion du manager sont
// suspendues, pour ne jamais couper l'accès à des employés au hasard.
function calculerDepassementPlan(planId, employes, administrateurs) {
  const planActuel = PLANS.find((p) => p.id === planId) || PLANS[0];
  const exces = {
    employes: Math.max(0, employes.length - planActuel.maxEmployes),
    admins: Math.max(0, administrateurs.length - planActuel.maxCoAdmins),
  };
  return {
    gele: exces.employes > 0 || exces.admins > 0,
    exces,
    planActuel,
  };
}

function GestionAbonnement({ planActuel, abonnement, onChoisir, onPayer }) {
  const [planEnCours, setPlanEnCours] = useState(null);
  const [erreur, setErreur] = useState("");

  const choisir = async (p) => {
    if (!p.payant) {
      onChoisir(p.id);
      return;
    }
    setErreur("");
    setPlanEnCours(p.id);
    try {
      await onPayer(p.id);
      // En cas de succès, onPayer redirige déjà le navigateur vers
      // CinetPay — on ne revient jamais jusqu'ici dans ce cas.
    } catch (e) {
      setErreur(e.message || "Impossible de démarrer le paiement pour le moment.");
    }
    setPlanEnCours(null);
  };

  const joursRestants =
    abonnement && abonnement.expireLe
      ? Math.ceil((new Date(abonnement.expireLe) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>Abonnement</h3>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
        Paiement sécurisé par CinetPay (Orange Money, MTN Money, Moov, Wave, carte bancaire).
      </p>
      {abonnement && abonnement.statut === "actif" && joursRestants !== null && (
        <p style={{ margin: "0 0 12px", fontSize: 13, color: joursRestants <= 5 ? "#993C1D" : "#5F5E5A" }}>
          {joursRestants > 0
            ? `Actif jusqu'au ${new Date(abonnement.expireLe).toLocaleDateString("fr-FR")} (dans ${joursRestants} jour${joursRestants > 1 ? "s" : ""})`
            : "Échéance atteinte aujourd'hui — renouvelez pour ne pas perdre l'accès."}
        </p>
      )}
      {abonnement && abonnement.statut === "expire" && (
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#993C1D" }}>
          Abonnement expiré le {new Date(abonnement.expireLe).toLocaleDateString("fr-FR")} —
          l'entreprise est repassée automatiquement au plan Découverte.
        </p>
      )}
      {erreur && (
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "#993C1D" }}>{erreur}</p>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {PLANS.map((p) => {
          const actif = planActuel === p.id;
          return (
            <Card
              key={p.id}
              style={{
                position: "relative",
                border: p.populaire ? "2px solid #1877F2" : "1px solid #E5E3DA",
              }}
            >
              {p.populaire && (
                <span
                  style={{
                    position: "absolute",
                    top: -10,
                    left: 14,
                    background: "#1877F2",
                    color: "#fff",
                    fontSize: 11,
                    padding: "2px 9px",
                    borderRadius: 20,
                  }}
                >
                  Populaire
                </span>
              )}
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{p.nom}</p>
              <p style={{ margin: "6px 0 2px" }}>
                <span style={{ fontSize: 20, fontWeight: 600 }}>{p.prix}</span>{" "}
                <span style={{ fontSize: 12, color: "#5F5E5A" }}>{p.suffixe}</span>
              </p>
              <p style={{ margin: "0 0 10px", fontSize: 12, color: "#5F5E5A" }}>{p.limites}</p>
              <ul style={{ margin: "0 0 14px", paddingLeft: 16, fontSize: 12.5, color: "#444441" }}>
                {p.fonctionnalites.map((f) => (
                  <li key={f} style={{ marginBottom: 3 }}>
                    {f}
                  </li>
                ))}
              </ul>
              {actif ? (
                <Badge tone="success">Plan actuel</Badge>
              ) : p.id === "entreprise" ? (
                <Bouton variant="secondary" onClick={() => (window.location.hash = "contact")}>
                  Nous contacter
                </Bouton>
              ) : (
                <Bouton
                  variant={p.populaire ? "primary" : "secondary"}
                  onClick={() => choisir(p)}
                  disabled={planEnCours === p.id}
                >
                  {planEnCours === p.id ? "Redirection..." : "Choisir ce plan"}
                </Bouton>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const LISTE_PERMISSIONS_ADMIN = [
  { cle: "validerTaches", label: "Valider / rejeter les tâches" },
  { cle: "assignerTaches", label: "Assigner des tâches" },
  { cle: "configurerCriteres", label: "Configurer les critères de notation" },
  { cle: "consulterRapports", label: "Consulter les rapports journaliers" },
  { cle: "evaluerRapports", label: "Évaluer les rapports journaliers" },
  { cle: "resoudreContestations", label: "Résoudre les contestations" },
];

function permissionsVides() {
  const p = {};
  LISTE_PERMISSIONS_ADMIN.forEach((l) => (p[l.cle] = false));
  return p;
}

function GestionAdministrateurs({ administrateurs, codeEntreprise, onAjouter, onRetirer }) {
  const [email, setEmail] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [poste, setPoste] = useState("");
  const [permissions, setPermissions] = useState(permissionsVides());
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [afficherForm, setAfficherForm] = useState(false);

  const plafondAtteint = administrateurs.length >= 3;

  const inviter = async () => {
    if (!email.trim() || !prenom.trim() || !nom.trim()) return;
    setEnCours(true);
    setErreur("");
    try {
      await onAjouter({
        email: email.trim(),
        prenom: prenom.trim(),
        nom: nom.trim(),
        poste: poste.trim(),
        permissions,
      });
      setEmail("");
      setPrenom("");
      setNom("");
      setPoste("");
      setPermissions(permissionsVides());
      setAfficherForm(false);
    } catch (e) {
      setErreur(e.message || "Impossible d'ajouter cet administrateur.");
    }
    setEnCours(false);
  };

  const champStyle = {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #E5E3DA",
    fontSize: 14,
  };

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>Administrateurs</h3>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
        {administrateurs.length}/3 co-administrateur{administrateurs.length > 1 ? "s" : ""}{" "}
        ajouté{administrateurs.length > 1 ? "s" : ""}. Vous seul(e) pouvez en ajouter, en retirer,
        ou ajouter/retirer un employé.
      </p>

      <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
        {administrateurs.length === 0 && (
          <p style={{ fontSize: 13, color: "#5F5E5A", margin: 0 }}>
            Aucun co-administrateur pour le moment.
          </p>
        )}
        {administrateurs.map((a) => (
          <Card
            key={a.id}
            style={{
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 14 }}>
                {a.prenom || a.nom ? `${a.prenom || ""} ${a.nom || ""}`.trim() : a.email}
                {a.poste && <span style={{ color: "#5F5E5A", fontWeight: 400 }}> — {a.poste}</span>}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
                {a.email} —{" "}
                {a.user_id ? "Actif" : "En attente d'inscription"}
              </p>
            </div>
            <Bouton variant="danger" onClick={() => onRetirer(a.id)}>
              Retirer
            </Bouton>
          </Card>
        ))}
      </div>

      {!plafondAtteint && !afficherForm && (
        <Bouton variant="secondary" onClick={() => setAfficherForm(true)}>
          + Inviter un co-administrateur
        </Bouton>
      )}

      {!plafondAtteint && afficherForm && (
        <Card style={{ display: "grid", gap: 10 }}>
          <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
            La personne devra créer un compte manager avec cet email exact et le code entreprise{" "}
            <strong>{codeEntreprise}</strong>.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input
              type="text"
              placeholder="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              style={champStyle}
            />
            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              style={champStyle}
            />
          </div>
          <input
            type="text"
            placeholder="Poste (ex : RH, DG, Gérant)"
            value={poste}
            onChange={(e) => setPoste(e.target.value)}
            style={champStyle}
          />
          <input
            type="email"
            placeholder="Email professionnel"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={champStyle}
          />
          <div style={{ display: "grid", gap: 6 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>
              Ce que cette personne pourra faire
            </p>
            {LISTE_PERMISSIONS_ADMIN.map((p) => (
              <label
                key={p.cle}
                style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}
              >
                <input
                  type="checkbox"
                  checked={permissions[p.cle]}
                  onChange={(e) =>
                    setPermissions((prev) => ({ ...prev, [p.cle]: e.target.checked }))
                  }
                />
                {p.label}
              </label>
            ))}
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#5F5E5A" }}>
              Un co-administrateur ne peut jamais ajouter ni retirer d'employé, supprimer le
              compte de l'entreprise, ni retirer l'administrateur principal.
            </p>
          </div>
          {erreur && (
            <p style={{ margin: 0, fontSize: 12, color: "#993C1D" }}>{erreur}</p>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <Bouton
              variant="primary"
              onClick={inviter}
              disabled={enCours || !email.trim() || !prenom.trim() || !nom.trim()}
            >
              {enCours ? "Ajout..." : "Ajouter cet administrateur"}
            </Bouton>
            <Bouton variant="secondary" onClick={() => setAfficherForm(false)}>
              Annuler
            </Bouton>
          </div>
        </Card>
      )}
    </div>
  );
}

// Icônes de la barre d'onglets horizontale (même famille visuelle que
// celles du rapport journalier, dessinées à la main pour éviter toute
// dépendance externe).
function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" strokeLinejoin="round" />
    </svg>
  );
}
function IconPeople(props) {
  return (
    <svg width={props?.taille || 16} height={props?.taille || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.7-3 2.9-5 5.5-5s4.8 2 5.5 5" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.3 12.2c2.2.2 4 1.9 4.6 4.3" strokeLinecap="round" />
    </svg>
  );
}
function IconClipboard(props) {
  return (
    <svg width={props?.taille || 16} height={props?.taille || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}
function IconAlertTriangle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 4 2.5 20h19L12 4Z" strokeLinejoin="round" />
      <path d="M12 10v4.5" strokeLinecap="round" />
      <circle cx="12" cy="17.3" r="0.4" fill="currentColor" />
    </svg>
  );
}
function IconGear() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3.2" />
      <path
        d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5M18.4 18.4l-1.5-1.5M7.1 7.1 5.6 5.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTrendUp(props) {
  return (
    <svg width={props?.taille || 16} height={props?.taille || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 17 9.5 10.5 13.5 14.5 21 6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArchive() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="4" width="17" height="5" rx="1.2" />
      <path d="M4.5 9v9a1.5 1.5 0 0 0 1.5 1.5h12A1.5 1.5 0 0 0 19.5 18V9" />
      <path d="M10 13h4" strokeLinecap="round" />
    </svg>
  );
}

function IconPin(props) {
  return (
    <svg width={props?.taille || 20} height={props?.taille || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function IconShield(props) {
  return (
    <svg width={props?.taille || 20} height={props?.taille || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3.5 19 6.5v5c0 5-3 8.3-7 9.9-4-1.6-7-4.9-7-9.9v-5L12 3.5Z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBulb(props) {
  return (
    <svg width={props?.taille || 20} height={props?.taille || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 18h6M10 21h4" strokeLinecap="round" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.45 1 1.15 1 1.9V16h5v-.2c0-.75.4-1.45 1-1.9A6 6 0 0 0 12 3Z" strokeLinejoin="round" />
    </svg>
  );
}

const SIX_PILIERS = [
  { titre: "Présence", texte: "Pointage géolocalisé — vous savez qui est là, à quelle heure.", icone: <IconPin taille={22} /> },
  { titre: "Travail", texte: "Planning du matin, réalisé du soir, tâches suivies jusqu'au bout.", icone: <IconClipboard taille={22} /> },
  { titre: "Performance", texte: "Un score objectif sur 100, transparent et contestable.", icone: <IconTrendUp taille={22} /> },
  { titre: "Discipline", texte: "Retards, avertissements et respect des délais, sans subjectivité.", icone: <IconShield taille={22} /> },
  { titre: "Management", texte: "Jusqu'à 3 co-administrateurs, chacun avec ses propres droits.", icone: <IconPeople taille={22} /> },
  { titre: "Intelligence", texte: "Statistiques, tendances et archives pour anticiper, pas subir.", icone: <IconBulb taille={22} /> },
];

// Illustration décorative pour l'en-tête de l'onglet Statistiques — dessinée
// sur mesure aux couleurs de la marque plutôt qu'une photo, pour rester
// légère et cohérente avec le reste de l'application.
function IllustrationCroissance() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="stat-illu">
      <circle cx="32" cy="32" r="30" fill="#E7F0FE" />
      <rect x="16" y="34" width="7" height="16" rx="2" fill="#C7DBFB" />
      <rect x="26" y="26" width="7" height="24" rx="2" fill="#8FB6F5" />
      <rect x="36" y="18" width="7" height="32" rx="2" fill="#1877F2" />
      <path
        d="M15 30 25 20 34 26 47 12"
        stroke="#FFD93B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M40 12h7v7" stroke="#FFD93B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PALETTE_DEPARTEMENTS = ["#1877F2", "#16A34A", "#D97706", "#E11D48", "#7C3AED", "#0D9488"];

function libelleTendance(pente) {
  if (pente > 3) return { texte: "Forte progression", tone: "success" };
  if (pente > 0.3) return { texte: "En progression", tone: "success" };
  if (pente < -3) return { texte: "Forte baisse", tone: "warning" };
  if (pente < -0.3) return { texte: "En baisse", tone: "warning" };
  return { texte: "Stable", tone: "neutral" };
}

function couleurScore(v) {
  if (v >= 80) return "#16A34A";
  if (v >= 60) return "#D97706";
  return "#E11D48";
}

// Justifie le titre "Employé du mois" avec de vrais chiffres — jamais un
// simple nom sans preuve. Toutes les valeurs viennent du score déjà
// calculé et des initiatives réellement validées ce mois-ci.
function calculerJustificationEmployeDuMois(emp, criteres) {
  const { score, detail } = calculerScore(emp, criteres);
  const parCle = Object.fromEntries(detail.map((d) => [d.key, d.valeur]));
  const periodeMoisCourant = {
    type: "mois",
    annee: new Date().getFullYear(),
    valeur: new Date().getMonth(),
  };
  const initiativesCeMois = (emp.initiatives || []).filter(
    (i) => i.statut === "validee" && dansPeriode(i.dateTraitee || i.dateProposee, periodeMoisCourant)
  ).length;
  return {
    score,
    objectifs: parCle.objectifs ?? null,
    taches: parCle.taches ?? null,
    ponctualite: parCle.ponctualite ?? null,
    initiativesCeMois,
    noteCollegues: moyenne(emp.notesPairs || []),
  };
}

// Palmarès dérivé du vrai journal de points, mois par mois : le "Ballon
// d'or" récompense le meilleur score de points de toute l'entreprise ce
// mois-là, le "Soulier d'or" le meilleur de son département. Rien n'est
// stocké séparément — c'est recalculé à la volée depuis statsAnnee.
// Évolution mensuelle sur l'année en cours, calculée à partir du journal
// de points de chaque employé (dont l'identifiant sert d'horodatage
// réel). Extrait en fonction autonome pour être réutilisé aussi bien côté
// manager (tous les employés) que côté employé (lui-même + ses collègues).
// Détermine si une date (ou un horodatage) tombe dans une période donnée
// (mois, trimestre, semestre ou année). Sert de base à tout le système
// d'archives : on filtre les vraies données datées (journal de points,
// pointages, rapports, initiatives, avertissements) plutôt que de
// recalculer ou d'inventer un historique qu'on n'a pas.
function dansPeriode(valeurDate, periode) {
  if (!valeurDate) return false;
  const d = new Date(valeurDate);
  if (isNaN(d.getTime())) return false;
  if (d.getFullYear() !== periode.annee) return false;
  if (periode.type === "annee") return true;
  const mois = d.getMonth();
  if (periode.type === "mois") return mois === periode.valeur;
  if (periode.type === "trimestre") return Math.floor(mois / 3) === periode.valeur;
  if (periode.type === "semestre") return Math.floor(mois / 6) === periode.valeur;
  return true;
}

function libellePeriode(periode) {
  const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  if (periode.type === "annee") return `Année ${periode.annee}`;
  if (periode.type === "mois") return `${MOIS[periode.valeur]} ${periode.annee}`;
  if (periode.type === "trimestre") return `T${periode.valeur + 1} ${periode.annee}`;
  if (periode.type === "semestre") return `S${periode.valeur + 1} ${periode.annee}`;
  return "";
}

// Période précédente de même type — sert au bouton de comparaison.
function periodePrecedente(periode) {
  if (periode.type === "annee") return { ...periode, annee: periode.annee - 1 };
  if (periode.type === "mois") {
    return periode.valeur === 0
      ? { ...periode, annee: periode.annee - 1, valeur: 11 }
      : { ...periode, valeur: periode.valeur - 1 };
  }
  if (periode.type === "trimestre") {
    return periode.valeur === 0
      ? { ...periode, annee: periode.annee - 1, valeur: 3 }
      : { ...periode, valeur: periode.valeur - 1 };
  }
  if (periode.type === "semestre") {
    return periode.valeur === 0
      ? { ...periode, annee: periode.annee - 1, valeur: 1 }
      : { ...periode, valeur: periode.valeur - 1 };
  }
  return periode;
}

// Calcule, pour chaque employé, les vraies statistiques archivées d'une
// période donnée : points gagnés, jours pointés, retards, rapports
// envoyés, initiatives et avertissements. Tout est recalculé à partir des
// enregistrements datés existants, jamais stocké séparément.
function calculerArchives(employes, periode, heureArrivee) {
  return employes.map((e) => {
    const pointsPeriode = (e.journalPoints || [])
      .filter((p) => dansPeriode(p.id, periode))
      .reduce((s, p) => s + p.points, 0);

    const pointagesPeriode = (e.historiquePointage || []).filter((p) => dansPeriode(p.date, periode));
    const joursPresents = pointagesPeriode.filter((p) => p.arrivee).length;
    const joursRetard = pointagesPeriode.filter((p) =>
      typeof p.enRetard === "boolean" ? p.enRetard : p.arrivee && heureArrivee && p.arrivee > heureArrivee
    ).length;

    const rapportsEnvoyes = (e.rapportsJournaliers || []).filter(
      (r) => dansPeriode(r.date, periode) && r.envoye
    ).length;

    const initiativesPeriode = (e.initiatives || []).filter((i) => dansPeriode(i.dateProposee, periode));
    const initiativesValidees = initiativesPeriode.filter((i) => i.statut === "validee").length;

    const avertissementsPeriode = (e.avertissements || []).filter((a) => dansPeriode(a.date, periode)).length;

    return {
      id: e.id,
      nom: e.nom,
      dept: e.dept,
      initiales: e.initiales,
      pointsPeriode,
      joursPresents,
      joursRetard,
      rapportsEnvoyes,
      initiativesProposees: initiativesPeriode.length,
      initiativesValidees,
      avertissementsPeriode,
    };
  });
}

// Liste des années pour lesquelles il existe au moins une donnée réelle,
// utilisée pour peupler le sélecteur d'année (n'affiche jamais une année
// vide où rien ne s'est passé).
function anneesDisponibles(employes) {
  const annees = new Set([new Date().getFullYear()]);
  employes.forEach((e) => {
    (e.journalPoints || []).forEach((p) => annees.add(new Date(p.id).getFullYear()));
    (e.historiquePointage || []).forEach((p) => annees.add(new Date(p.date).getFullYear()));
    (e.rapportsJournaliers || []).forEach((r) => annees.add(new Date(r.date).getFullYear()));
  });
  return [...annees].sort((a, b) => b - a);
}

// Points gagnés par semaine glissante, sur les nbSemaines dernières
// semaines (index 0 = semaine en cours). Base honnête pour repérer une
// tendance sans dépendre d'un historique de score qu'on ne stocke pas.
function pointsParSemaine(journalPoints, nbSemaines = 8) {
  const maintenant = new Date();
  const semaines = new Array(nbSemaines).fill(0);
  (journalPoints || []).forEach((p) => {
    const d = new Date(p.id);
    const joursEcart = Math.floor((maintenant - d) / (1000 * 60 * 60 * 24));
    const idx = Math.floor(joursEcart / 7);
    if (idx >= 0 && idx < nbSemaines) semaines[idx] += p.points;
  });
  return semaines;
}

// Compare les 4 dernières semaines aux 4 précédentes. Ne signale une
// anomalie que si une vraie activité existait déjà avant (sinon la
// variation en % n'a pas de sens), et seulement au-delà d'un seuil pour
// éviter le bruit sur de petites variations normales.
const SEUIL_BAISSE_ANOMALIE = 15;

function detecterBaisse(journalPoints) {
  const semaines = pointsParSemaine(journalPoints, 8);
  const recent = semaines.slice(0, 4).reduce((s, v) => s + v, 0);
  const anterieur = semaines.slice(4, 8).reduce((s, v) => s + v, 0);
  if (anterieur <= 0) return null;
  const variation = ((recent - anterieur) / anterieur) * 100;
  if (variation <= -SEUIL_BAISSE_ANOMALIE) {
    return Math.round(Math.abs(variation));
  }
  return null;
}

function detecterAnomaliesEmployes(employes) {
  return employes
    .map((e) => ({ nom: e.nom, baisse: detecterBaisse(e.journalPoints) }))
    .filter((r) => r.baisse !== null);
}

function detecterAnomaliesDepartements(employes) {
  const parDept = {};
  employes.forEach((e) => {
    const d = e.dept || "Sans département";
    (parDept[d] = parDept[d] || []).push(...(e.journalPoints || []));
  });
  return Object.entries(parDept)
    .map(([dept, points]) => ({ dept, baisse: detecterBaisse(points) }))
    .filter((r) => r.baisse !== null);
}

const MOTIFS_BLOCAGE = [
  { cle: "validation_manager", label: "J'attends la validation du manager" },
  { cle: "client_injoignable", label: "Client injoignable" },
  { cle: "budget_indisponible", label: "Budget indisponible" },
  { cle: "document_manquant", label: "Document manquant" },
  { cle: "probleme_technique", label: "Problème technique" },
];

const MOTIFS_ABSENCE = ["Maladie", "Congé posé", "Événement familial", "Autre"];

// Diagnostic d'entreprise, pas d'évaluation individuelle : sur toutes les
// tâches en retard où l'employé a indiqué une cause, quelle proportion
// vient de chaque motif ? Permet de repérer un vrai goulot d'étranglement
// (ex : trop de retards viennent de la lenteur de validation du manager)
// plutôt que d'accuser systématiquement l'employé.
function calculerBlocages(employes) {
  const maintenant = new Date();
  const tachesBloquees = employes.flatMap((e) =>
    e.taches.filter(
      (t) => t.statut !== "validee" && t.echeance && new Date(t.echeance) < maintenant && t.blocage
    )
  );
  const total = tachesBloquees.length;
  const repartition = MOTIFS_BLOCAGE.map((m) => {
    const nb = tachesBloquees.filter((t) => t.blocage === m.cle).length;
    return { ...m, nb, pourcentage: total > 0 ? Math.round((nb / total) * 100) : 0 };
  }).filter((r) => r.nb > 0);
  return { total, repartition };
}

// Temps moyen entre la déclaration d'une tâche par l'employé et sa
// validation par le manager — un indicateur du rythme de validation de
// l'entreprise, pas encore attribuable à un manager précis tant que les
// actions ne sont pas nominatives.
function calculerTempsValidation(employes) {
  const delais = employes
    .flatMap((e) => e.taches)
    .filter((t) => t.declareLe && t.valideeLe)
    .map((t) => (new Date(t.valideeLe) - new Date(t.declareLe)) / (1000 * 60 * 60));
  if (delais.length === 0) return null;
  const moyenneHeures = delais.reduce((s, v) => s + v, 0) / delais.length;
  return moyenneHeures;
}

function calculerStatsAnnee(employes) {
  const maintenant = new Date();
  const annee = maintenant.getFullYear();
  const moisCourant = maintenant.getMonth();
  const moisNoms = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

  const parEmploye = employes.map((e) => {
    const points = new Array(12).fill(0);
    (e.journalPoints || []).forEach((p) => {
      const d = new Date(p.id);
      if (d.getFullYear() === annee) points[d.getMonth()] += p.points;
    });
    return { id: e.id, nom: e.nom, dept: e.dept, initiales: e.initiales, points };
  });

  const deptsSet = [...new Set(employes.map((e) => e.dept || "Sans département"))];
  const parDept = deptsSet.map((dept) => {
    const points = new Array(12).fill(0);
    parEmploye
      .filter((e) => (e.dept || "Sans département") === dept)
      .forEach((e) => e.points.forEach((v, i) => (points[i] += v)));
    return { dept, points };
  });

  const total = new Array(12).fill(0);
  parEmploye.forEach((e) => e.points.forEach((v, i) => (total[i] += v)));

  const pente = (serie) => {
    const xs = [];
    const ys = [];
    for (let i = 0; i <= moisCourant; i++) {
      xs.push(i);
      ys.push(serie[i]);
    }
    const n = xs.length;
    if (n < 2) return 0;
    const moyX = xs.reduce((a, b) => a + b, 0) / n;
    const moyY = ys.reduce((a, b) => a + b, 0) / n;
    const num = xs.reduce((s, x, i) => s + (x - moyX) * (ys[i] - moyY), 0);
    const den = xs.reduce((s, x) => s + (x - moyX) ** 2, 0);
    return den === 0 ? 0 : num / den;
  };

  return {
    moisNoms,
    moisCourant,
    parEmploye: parEmploye.map((e) => ({ ...e, pente: pente(e.points) })),
    parDept: parDept.map((d) => ({ ...d, pente: pente(d.points) })),
    total,
    penteTotal: pente(total),
  };
}

function calculerPalmares(statsAnnee) {
  const { parEmploye, moisCourant } = statsAnnee;
  const ballonDor = {};
  const soulierDor = {};

  for (let m = 0; m <= moisCourant; m++) {
    let meilleur = null;
    parEmploye.forEach((e) => {
      if (e.points[m] > 0 && (!meilleur || e.points[m] > meilleur.points)) {
        meilleur = { id: e.id, points: e.points[m] };
      }
    });
    if (meilleur) ballonDor[meilleur.id] = (ballonDor[meilleur.id] || 0) + 1;

    const parDept = {};
    parEmploye.forEach((e) => {
      const d = e.dept || "Sans département";
      (parDept[d] = parDept[d] || []).push(e);
    });
    Object.values(parDept).forEach((liste) => {
      if (liste.length < 2) return;
      let top = null;
      liste.forEach((e) => {
        if (e.points[m] > 0 && (!top || e.points[m] > top.points)) {
          top = { id: e.id, points: e.points[m] };
        }
      });
      if (top) soulierDor[top.id] = (soulierDor[top.id] || 0) + 1;
    });
  }

  return { ballonDor, soulierDor };
}

function anciennete(dateEntree) {
  if (!dateEntree) return null;
  const debut = new Date(dateEntree);
  const maintenant = new Date();
  let mois = (maintenant.getFullYear() - debut.getFullYear()) * 12 + (maintenant.getMonth() - debut.getMonth());
  if (mois < 0) mois = 0;
  if (mois < 1) return "moins d'un mois";
  if (mois < 12) return `${mois} mois`;
  const ans = Math.floor(mois / 12);
  const reste = mois % 12;
  return reste === 0 ? `${ans} an${ans > 1 ? "s" : ""}` : `${ans} an${ans > 1 ? "s" : ""} et ${reste} mois`;
}

const STYLES_STATS = `
  .stat-illu { animation: stat-float 3.5s ease-in-out infinite; }
  @keyframes stat-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  .stat-chart-wrap { animation: stat-fade 0.5s ease; }
  @keyframes stat-fade {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .stat-line { stroke-dasharray: 1400; stroke-dashoffset: 1400; animation: stat-draw 1.2s ease forwards; }
  @keyframes stat-draw { to { stroke-dashoffset: 0; } }
  .stat-area { animation: stat-fade 1s ease; }
  .stat-dot {
    transform-box: fill-box; transform-origin: center;
    animation: stat-pop 0.35s ease backwards;
  }
  @keyframes stat-pop {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .stat-illu, .stat-chart-wrap, .stat-line, .stat-area, .stat-dot { animation: none; }
  }
`;

function GraphiqueEvolution({ points, moisNoms, moisCourant, couleur = "#1877F2", hauteur = 130 }) {
  const largeur = 600;
  const marge = 8;
  const maxVal = Math.max(1, ...points);
  const pasX = (largeur - marge * 2) / (points.length - 1);
  const coords = points.map((v, i) => {
    const x = marge + i * pasX;
    const y = hauteur - marge - (Math.max(0, v) / maxVal) * (hauteur - marge * 2);
    return [x, y];
  });
  const ligne = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const aire = `${ligne} L${coords[coords.length - 1][0]},${hauteur - marge} L${coords[0][0]},${hauteur - marge} Z`;
  const idGrad = `sg-${couleur.replace("#", "")}`;

  return (
    <div className="stat-chart-wrap">
      <svg viewBox={`0 0 ${largeur} ${hauteur + 20}`} width="100%" height={hauteur + 20} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={idGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={couleur} stopOpacity="0.32" />
            <stop offset="100%" stopColor={couleur} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={aire} fill={`url(#${idGrad})`} className="stat-area" />
        <path d={ligne} fill="none" stroke={couleur} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stat-line" />
        {coords.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === moisCourant ? 4.5 : 2.5}
            fill={couleur}
            className="stat-dot"
            style={{ animationDelay: `${i * 0.05}s` }}
            opacity={i <= moisCourant ? 1 : 0.25}
          />
        ))}
        {moisNoms.map((m, i) => (
          <text key={m} x={coords[i][0]} y={hauteur + 15} fontSize="9" textAnchor="middle" fill="#5F5E5A">
            {m}
          </text>
        ))}
      </svg>
    </div>
  );
}

const STYLES_NAV = `
  .nav-tabs { display: flex; gap: 2px; border-bottom: 1px solid #E5E3DA; margin-bottom: 22px; overflow-x: auto; }
  .nav-tab {
    display: flex; align-items: center; gap: 7px; padding: 11px 15px;
    border: none; background: transparent; cursor: pointer; white-space: nowrap;
    font-size: 13.5px; color: #5F5E5A; font-family: inherit;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
    transition: color 0.15s ease, border-color 0.15s ease;
  }
  .nav-tab:hover { color: #2C2C2A; }
  .nav-tab.active { color: #1877F2; border-bottom-color: #1877F2; font-weight: 500; }
  .nav-tab .n-count {
    font-size: 11px; background: #FFF6DA; color: #7A5B00; border-radius: 20px; padding: 1px 6px;
  }
  .nav-tab.active .n-count { background: #E7F0FE; color: #0F4FA8; }
  .nav-panel-inner { animation: nav-fade 0.25s ease; }
  @keyframes nav-fade {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .nav-panel-inner { animation: none; }
  }

  .nav-shell { display: flex; gap: 22px; align-items: flex-start; }
  .nav-sidebar {
    display: flex; flex-direction: column; gap: 3px;
    width: 188px; flex-shrink: 0;
    background: #FAF9F5; border: 1px solid #E5E3DA; border-radius: 12px;
    padding: 8px; position: sticky; top: 16px;
  }
  .nav-tab-v {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border: none; background: transparent; cursor: pointer; text-align: left;
    font-size: 13.5px; color: #5F5E5A; font-family: inherit; border-radius: 8px;
    border-left: 3px solid transparent;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .nav-tab-v:hover { background: #F1EFE8; color: #2C2C2A; }
  .nav-tab-v.active {
    background: #1877F2; color: #fff; font-weight: 500;
    border-left: 3px solid #FFD93B;
  }
  .nav-tab-v .n-count {
    margin-left: auto; font-size: 11px; background: #FFF6DA; color: #7A5B00;
    border-radius: 20px; padding: 1px 7px;
  }
  .nav-tab-v.active .n-count { background: #FFD93B; color: #5C4600; }
  .nav-content { flex: 1; min-width: 0; }
  @media (max-width: 760px) {
    .nav-shell { flex-direction: column; }
    .nav-sidebar {
      width: 100%; flex-direction: row; overflow-x: auto; position: static;
    }
    .nav-tab-v {
      flex-shrink: 0; border-left: none; border-bottom: 3px solid transparent; border-radius: 8px 8px 0 0;
    }
    .nav-tab-v.active { border-left: none; border-bottom: 3px solid #FFD93B; }
  }
`;

function OngletsNav({ onglets, actif, onChange }) {
  return (
    <div className="nav-sidebar">
      {onglets.map((o) => (
        <button
          key={o.id}
          className={`nav-tab-v ${actif === o.id ? "active" : ""}`}
          onClick={() => onChange(o.id)}
        >
          {o.icone}
          {o.label}
          {o.count > 0 && <span className="n-count">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

function GestionSieges({ sites, onAjouter, onRenommer, onSupprimer }) {
  const [nouveauSite, setNouveauSite] = useState("");
  const [renommageId, setRenommageId] = useState(null);
  const [nomRenomme, setNomRenomme] = useState("");

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>Sièges / agences</h3>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
        Dès que 2 sièges ou plus sont enregistrés, un écran de sélection apparaît à la connexion et
        les employés peuvent y être rattachés.
      </p>
      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        {sites.length === 0 && (
          <p style={{ fontSize: 13, color: "#5F5E5A", margin: 0 }}>Aucun siège pour le moment.</p>
        )}
        {sites.map((s) => (
          <Card key={s} style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            {renommageId === s ? (
              <>
                <input
                  type="text"
                  value={nomRenomme}
                  onChange={(e) => setNomRenomme(e.target.value)}
                  style={{ flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 13 }}
                />
                <Bouton
                  onClick={() => {
                    onRenommer(s, nomRenomme);
                    setRenommageId(null);
                  }}
                >
                  Enregistrer
                </Bouton>
                <Bouton variant="secondary" onClick={() => setRenommageId(null)}>
                  Annuler
                </Bouton>
              </>
            ) : (
              <>
                <span style={{ flex: 1, fontSize: 14 }}>{s}</span>
                <Bouton
                  variant="secondary"
                  onClick={() => {
                    setRenommageId(s);
                    setNomRenomme(s);
                  }}
                >
                  Renommer
                </Bouton>
                <Bouton
                  variant="danger"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Supprimer le siège "${s}" ? Les employés qui y sont rattachés n'auront plus de siège assigné.`
                      )
                    ) {
                      onSupprimer(s);
                    }
                  }}
                >
                  Retirer
                </Bouton>
              </>
            )}
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Nom du nouveau siège (ex : Cocody)"
          value={nouveauSite}
          onChange={(e) => setNouveauSite(e.target.value)}
          style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14 }}
        />
        <Bouton
          variant="primary"
          onClick={() => {
            onAjouter(nouveauSite);
            setNouveauSite("");
          }}
          disabled={!nouveauSite.trim()}
        >
          + Ajouter
        </Bouton>
      </div>
    </div>
  );
}

function JournalActiviteVue({ journalActivite }) {
  const [limite, setLimite] = useState(25);
  const entrees = journalActivite.slice(0, limite);

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>Journal d'activité</h3>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
        Qui a fait quoi, et quand — pour les actions clés de l'administrateur principal et des
        co-administrateurs.
      </p>
      {journalActivite.length === 0 ? (
        <p style={{ fontSize: 13, color: "#5F5E5A" }}>Aucune activité enregistrée pour l'instant.</p>
      ) : (
        <>
          <div style={{ display: "grid", gap: 6 }}>
            {entrees.map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 13,
                  padding: "8px 12px",
                  border: "1px solid #E5E3DA",
                  borderRadius: 8,
                  background: "#fff",
                }}
              >
                <span style={{ color: "#5F5E5A", width: 120, flexShrink: 0, fontSize: 12 }}>
                  {new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}{" "}
                  {new Date(a.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span style={{ flex: 1 }}>
                  <strong>{a.auteur}</strong>
                  {a.posteAuteur && <span style={{ color: "#5F5E5A" }}> ({a.posteAuteur})</span>} —{" "}
                  {a.action}
                  {a.details && <span style={{ color: "#5F5E5A" }}> · {a.details}</span>}
                </span>
              </div>
            ))}
          </div>
          {limite < journalActivite.length && (
            <Bouton
              variant="secondary"
              onClick={() => setLimite((l) => l + 25)}
              style={{ marginTop: 10 }}
            >
              Voir plus
            </Bouton>
          )}
        </>
      )}
    </div>
  );
}

function ChangerMotDePasseCarte({ onChanger }) {
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [afficher, setAfficher] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const [enCours, setEnCours] = useState(false);

  const valider = async () => {
    setErreur("");
    setSucces(false);
    if (motDePasse.length < 6) {
      setErreur("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (motDePasse !== confirmation) {
      setErreur("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setEnCours(true);
    try {
      await onChanger(motDePasse);
      setSucces(true);
      setMotDePasse("");
      setConfirmation("");
    } catch (e) {
      setErreur(e.message);
    }
    setEnCours(false);
  };

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>Mot de passe</h3>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
        Changez le mot de passe de votre compte.
      </p>
      <Card style={{ display: "grid", gap: 10, maxWidth: 360 }}>
        <input
          type={afficher ? "text" : "password"}
          placeholder="Nouveau mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14 }}
        />
        <input
          type={afficher ? "text" : "password"}
          placeholder="Confirmer le mot de passe"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14 }}
        />
        <label style={{ fontSize: 12, color: "#5F5E5A", display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={afficher} onChange={(e) => setAfficher(e.target.checked)} />
          Afficher les mots de passe
        </label>
        {erreur && <p style={{ margin: 0, fontSize: 12, color: "#993C1D" }}>{erreur}</p>}
        <Bouton variant="primary" onClick={valider} disabled={enCours || !motDePasse || !confirmation}>
          {enCours ? "Enregistrement…" : succes ? "✓ Mot de passe modifié" : "Changer mon mot de passe"}
        </Bouton>
      </Card>
    </div>
  );
}

function ConfigurationBureau({ bureau, definirBureauSurPositionActuelle, majRayonBureau, retirerBureau }) {
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [rayonSaisi, setRayonSaisi] = useState(bureau?.rayon || 150);

  const activer = async () => {
    setErreur("");
    setEnCours(true);
    try {
      await definirBureauSurPositionActuelle(rayonSaisi);
    } catch (e) {
      setErreur(
        e && e.code === 1
          ? "Autorisez la localisation dans votre navigateur pour définir la position du bureau."
          : "Impossible d'obtenir votre position. Réessayez depuis le lieu du bureau."
      );
    }
    setEnCours(false);
  };

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>
        Pointage géolocalisé
      </h3>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
        Une fois activé, un employé ne peut pointer son arrivée que s'il se trouve physiquement
        près de cet emplacement.
      </p>
      <Card style={{ display: "grid", gap: 12 }}>
        {bureau ? (
          <>
            <Badge tone="success">Position du bureau enregistrée</Badge>
            <label style={{ fontSize: 13 }}>
              Rayon toléré (mètres)
              <input
                type="number"
                min="20"
                step="10"
                value={bureau.rayon}
                onChange={(e) => majRayonBureau(Number(e.target.value))}
                style={{
                  display: "block",
                  marginTop: 4,
                  width: 120,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #E5E3DA",
                }}
              />
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <Bouton onClick={activer} disabled={enCours}>
                {enCours ? "Localisation..." : "Redéfinir depuis ma position actuelle"}
              </Bouton>
              <Bouton variant="danger" onClick={retirerBureau}>
                Désactiver
              </Bouton>
            </div>
          </>
        ) : (
          <>
            <p style={{ margin: 0, fontSize: 13, color: "#5F5E5A" }}>
              Placez-vous physiquement au bureau, puis cliquez ci-dessous pour enregistrer cette
              position.
            </p>
            <label style={{ fontSize: 13 }}>
              Rayon toléré (mètres)
              <input
                type="number"
                min="20"
                step="10"
                value={rayonSaisi}
                onChange={(e) => setRayonSaisi(Number(e.target.value))}
                style={{
                  display: "block",
                  marginTop: 4,
                  width: 120,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #E5E3DA",
                }}
              />
            </label>
            <Bouton variant="primary" onClick={activer} disabled={enCours}>
              {enCours ? "Localisation..." : "Utiliser ma position actuelle"}
            </Bouton>
          </>
        )}
        {erreur && <p style={{ margin: 0, fontSize: 12, color: "#993C1D" }}>{erreur}</p>}
      </Card>
    </div>
  );
}

function ConfigurationBureauSite({ site, bureau, onDefinir, onMajRayon, onRetirer }) {
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [rayonSaisi, setRayonSaisi] = useState(bureau?.rayon || 150);

  const activer = async () => {
    setErreur("");
    setEnCours(true);
    try {
      await onDefinir(site, rayonSaisi);
    } catch (e) {
      setErreur(
        e && e.code === 1
          ? "Autorisez la localisation dans votre navigateur pour définir la position de ce siège."
          : "Impossible d'obtenir votre position. Réessayez depuis ce siège."
      );
    }
    setEnCours(false);
  };

  return (
    <Card style={{ display: "grid", gap: 10, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <strong style={{ fontSize: 14 }}>{site}</strong>
        {bureau ? (
          <Badge tone="success">Position enregistrée</Badge>
        ) : (
          <Badge tone="neutral">Non configuré</Badge>
        )}
      </div>

      {bureau ? (
        <>
          <label style={{ fontSize: 13 }}>
            Rayon toléré (mètres)
            <input
              type="number"
              min="20"
              step="10"
              value={bureau.rayon}
              onChange={(e) => onMajRayon(site, Number(e.target.value))}
              style={{
                display: "block",
                marginTop: 4,
                width: 120,
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #E5E3DA",
              }}
            />
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <Bouton onClick={activer} disabled={enCours}>
              {enCours ? "Localisation..." : "Redéfinir depuis ma position actuelle"}
            </Bouton>
            <Bouton variant="danger" onClick={() => onRetirer(site)}>
              Désactiver
            </Bouton>
          </div>
        </>
      ) : (
        <>
          <p style={{ margin: 0, fontSize: 13, color: "#5F5E5A" }}>
            Placez-vous physiquement à ce siège, puis cliquez ci-dessous pour enregistrer cette
            position.
          </p>
          <label style={{ fontSize: 13 }}>
            Rayon toléré (mètres)
            <input
              type="number"
              min="20"
              step="10"
              value={rayonSaisi}
              onChange={(e) => setRayonSaisi(Number(e.target.value))}
              style={{
                display: "block",
                marginTop: 4,
                width: 120,
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #E5E3DA",
              }}
            />
          </label>
          <Bouton variant="primary" onClick={activer} disabled={enCours}>
            {enCours ? "Localisation..." : "Utiliser ma position actuelle"}
          </Bouton>
        </>
      )}
      {erreur && <p style={{ margin: 0, fontSize: 12, color: "#993C1D" }}>{erreur}</p>}
    </Card>
  );
}

function ConfigurationBureauxMultiples({ sites, bureaux, onDefinir, onMajRayon, onRetirer }) {
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>
        Pointage géolocalisé par siège
      </h3>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
        Chaque siège a sa propre position et son propre rayon toléré. Un employé rattaché à un
        siège ne peut pointer que s'il s'y trouve physiquement — s'il n'a pas de siège assigné,
        aucune vérification de position n'est appliquée.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {sites.map((site) => (
          <ConfigurationBureauSite
            key={site}
            site={site}
            bureau={bureaux[site] || null}
            onDefinir={onDefinir}
            onMajRayon={onMajRayon}
            onRetirer={onRetirer}
          />
        ))}
      </div>
    </div>
  );
}

function ProfilEmployeCarte({
  employe,
  statsAnnee,
  palmares,
  estPrincipal,
  majDateEntree,
  ajouterEtapeParcours,
  retirerEtapeParcours,
  ajouterAvertissement,
  retirerAvertissement,
}) {
  const [dateForm, setDateForm] = useState("");
  const [titreForm, setTitreForm] = useState("");
  const [motifAvert, setMotifAvert] = useState("");

  const empStats = statsAnnee.parEmploye.find((e) => e.id === employe.id);
  const ballonDor = (palmares.ballonDor && palmares.ballonDor[employe.id]) || 0;
  const soulierDor = (palmares.soulierDor && palmares.soulierDor[employe.id]) || 0;
  const totalPointsVie = (employe.journalPoints || []).reduce((s, p) => s + p.points, 0);
  const tachesValidees = employe.taches.filter((t) => t.statut === "validee").length;
  const parcoursTrie = [...(employe.parcours || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: employe.avatarUrl ? `#fff url(${employe.avatarUrl}) center/cover no-repeat` : "#F1EFE8",
            border: "1px solid #E5E3DA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: "#5F5E5A",
            flexShrink: 0,
          }}
        >
          {!employe.avatarUrl && employe.initiales}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{employe.nom}</p>
          <p style={{ margin: 0, fontSize: 13, color: "#5F5E5A" }}>
            {employe.dept}
            {employe.dateEntree && ` · ${anciennete(employe.dateEntree)} d'ancienneté`}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Card style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🏆</span>
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{ballonDor}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#5F5E5A" }}>Ballon d'or (employé du mois)</p>
          </div>
        </Card>
        <Card style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🥇</span>
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{soulierDor}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#5F5E5A" }}>Soulier d'or (meilleur du département)</p>
          </div>
        </Card>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 10,
        }}
      >
        {[
          { label: "Tâches validées", valeur: tachesValidees },
          { label: "Points cumulés", valeur: totalPointsVie },
          {
            label: "Retards à vie",
            valeur: (employe.historiquePointage || []).filter((p) => p.enRetard).length,
          },
          { label: "Avertissements", valeur: (employe.avertissements || []).length },
        ].map((s) => (
          <Card key={s.label} style={{ padding: "10px 14px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{s.valeur}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#5F5E5A" }}>{s.label}</p>
          </Card>
        ))}
      </div>

      <div>
        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 500 }}>Initiatives</p>
        <StatsInitiatives initiatives={employe.initiatives} />
      </div>

      {empStats && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 500 }}>
            Évolution des points sur l'année
          </p>
          <Card>
            <GraphiqueEvolution
              points={empStats.points}
              moisNoms={statsAnnee.moisNoms}
              moisCourant={statsAnnee.moisCourant}
              couleur="#7C3AED"
              hauteur={110}
            />
          </Card>
        </div>
      )}

      <div>
        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 500 }}>Parcours dans l'entreprise</p>
        {estPrincipal && (
          <label style={{ fontSize: 12, color: "#5F5E5A", display: "block", marginBottom: 10 }}>
            Date d'entrée
            <input
              type="date"
              value={employe.dateEntree || ""}
              onChange={(e) => majDateEntree(employe.id, e.target.value)}
              style={{
                display: "block",
                marginTop: 4,
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #E5E3DA",
                fontSize: 13,
              }}
            />
          </label>
        )}
        {parcoursTrie.length === 0 ? (
          <p style={{ fontSize: 13, color: "#5F5E5A", margin: "0 0 10px" }}>
            Aucune étape enregistrée pour l'instant.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
            {parcoursTrie.map((p) => (
              <div key={p.id} className="rj-row">
                <span className="rj-row-time">
                  {new Date(p.date).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                </span>
                <span style={{ flex: 1 }}>{p.titre}</span>
                {estPrincipal && (
                  <button
                    onClick={() => retirerEtapeParcours(employe.id, p.id)}
                    style={{ border: "none", background: "none", color: "#993C1D", cursor: "pointer", fontSize: 12 }}
                  >
                    Retirer
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {estPrincipal && (
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr auto", gap: 6 }}>
            <input
              type="date"
              value={dateForm}
              onChange={(e) => setDateForm(e.target.value)}
              style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 12 }}
            />
            <input
              type="text"
              placeholder="Ex : Stagiaire, Chef d'équipe..."
              value={titreForm}
              onChange={(e) => setTitreForm(e.target.value)}
              style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 13 }}
            />
            <Bouton
              onClick={() => {
                if (!dateForm || !titreForm.trim()) return;
                ajouterEtapeParcours(employe.id, { date: dateForm, titre: titreForm.trim() });
                setDateForm("");
                setTitreForm("");
              }}
              disabled={!dateForm || !titreForm.trim()}
            >
              + Ajouter
            </Bouton>
          </div>
        )}
      </div>

      <div>
        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 500 }}>Avertissements</p>
        {(employe.avertissements || []).length === 0 ? (
          <p style={{ fontSize: 13, color: "#5F5E5A", margin: "0 0 10px" }}>Aucun avertissement.</p>
        ) : (
          <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
            {employe.avertissements.map((a) => (
              <div key={a.id} className="rj-row">
                <span className="rj-row-time">
                  {new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                </span>
                <span style={{ flex: 1 }}>{a.motif}</span>
                {estPrincipal && (
                  <button
                    onClick={() => retirerAvertissement(employe.id, a.id)}
                    style={{ border: "none", background: "none", color: "#993C1D", cursor: "pointer", fontSize: 12 }}
                  >
                    Retirer
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {estPrincipal && (
          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="text"
              placeholder="Motif de l'avertissement"
              value={motifAvert}
              onChange={(e) => setMotifAvert(e.target.value)}
              style={{ flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 13 }}
            />
            <Bouton
              variant="danger"
              onClick={() => {
                if (!motifAvert.trim()) return;
                ajouterAvertissement(employe.id, {
                  date: new Date().toISOString().slice(0, 10),
                  motif: motifAvert.trim(),
                });
                setMotifAvert("");
              }}
              disabled={!motifAvert.trim()}
            >
              Émettre
            </Bouton>
          </div>
        )}
      </div>
    </div>
  );
}

const SELECT_STYLE = { padding: "6px 10px", borderRadius: 8, border: "1px solid #E5E3DA", fontSize: 13 };
const MOIS_LONGS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const TRIMESTRES_LABELS = ["T1 (Jan-Mar)", "T2 (Avr-Juin)", "T3 (Juil-Sep)", "T4 (Oct-Déc)"];
const SEMESTRES_LABELS = ["S1 (Jan-Juin)", "S2 (Juil-Déc)"];

function SelecteurPeriode({ periode, onChange, annees }) {
  const options =
    periode.type === "mois" ? MOIS_LONGS : periode.type === "trimestre" ? TRIMESTRES_LABELS : SEMESTRES_LABELS;

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <select
        value={periode.type}
        onChange={(e) => onChange({ ...periode, type: e.target.value, valeur: 0 })}
        style={SELECT_STYLE}
      >
        <option value="mois">Mois</option>
        <option value="trimestre">Trimestre</option>
        <option value="semestre">Semestre</option>
        <option value="annee">Année</option>
      </select>

      {periode.type !== "annee" && (
        <select
          value={periode.valeur}
          onChange={(e) => onChange({ ...periode, valeur: Number(e.target.value) })}
          style={SELECT_STYLE}
        >
          {options.map((label, i) => (
            <option key={i} value={i}>
              {label}
            </option>
          ))}
        </select>
      )}

      <select
        value={periode.annee}
        onChange={(e) => onChange({ ...periode, annee: Number(e.target.value) })}
        style={SELECT_STYLE}
      >
        {annees.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}

// Détermine, parmi des données d'archives déjà calculées pour une
// période, l'employé et le département qui ont le plus contribué —
// toujours sur la base des points réellement gagnés durant cette
// période précise, jamais du score actuel appliqué rétroactivement.
function meilleurEmploye(donneesArchives) {
  if (!donneesArchives.length) return null;
  const classes = [...donneesArchives].sort((a, b) => b.pointsPeriode - a.pointsPeriode);
  return classes[0].pointsPeriode > 0 ? classes[0] : null;
}

function meilleurDepartement(donneesArchives) {
  const parDept = {};
  donneesArchives.forEach((e) => {
    const d = e.dept || "Sans département";
    if (!parDept[d]) {
      parDept[d] = {
        dept: d,
        pointsPeriode: 0,
        joursPresents: 0,
        joursRetard: 0,
        rapportsEnvoyes: 0,
        initiativesValidees: 0,
        avertissementsPeriode: 0,
        nbEmployes: 0,
      };
    }
    parDept[d].pointsPeriode += e.pointsPeriode;
    parDept[d].joursPresents += e.joursPresents;
    parDept[d].joursRetard += e.joursRetard;
    parDept[d].rapportsEnvoyes += e.rapportsEnvoyes;
    parDept[d].initiativesValidees += e.initiativesValidees;
    parDept[d].avertissementsPeriode += e.avertissementsPeriode;
    parDept[d].nbEmployes += 1;
  });
  const liste = Object.values(parDept).sort((a, b) => b.pointsPeriode - a.pointsPeriode);
  return liste.length && liste[0].pointsPeriode > 0 ? liste[0] : null;
}

function CarteChampion({ titre, sousTitre, initiales, nom, pointsPeriode, lignes }) {
  return (
    <Card
      style={{
        background: "linear-gradient(135deg, #1877F2 0%, #0F4FA8 100%)",
        color: "#fff",
        border: "none",
      }}
    >
      <p style={{ margin: "0 0 10px", fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, color: "#D9E7FD" }}>
        {titre}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        {initiales && <Avatar initiales={initiales} tone="success" />}
        <div>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{nom}</p>
          {sousTitre && <p style={{ margin: 0, fontSize: 12.5, color: "#D9E7FD" }}>{sousTitre}</p>}
        </div>
        <span style={{ marginLeft: "auto", fontSize: 22, fontWeight: 700 }}>{pointsPeriode} pts</span>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 5, fontSize: 13 }}>
        {lignes.map((l, i) => (
          <li key={i}>✓ {l}</li>
        ))}
      </ul>
    </Card>
  );
}

function PanneauArchives({ employes, heureArrivee, seulEmploye = false }) {
  const annees = useMemo(() => anneesDisponibles(employes), [employes]);
  const [periode, setPeriode] = useState({
    type: "mois",
    annee: new Date().getFullYear(),
    valeur: new Date().getMonth(),
  });
  const [comparer, setComparer] = useState(false);

  const donnees = useMemo(() => calculerArchives(employes, periode, heureArrivee), [employes, periode, heureArrivee]);
  const periodeComp = periodePrecedente(periode);
  const donneesComp = useMemo(
    () => (comparer ? calculerArchives(employes, periodeComp, heureArrivee) : null),
    [employes, periodeComp, heureArrivee, comparer]
  );

  const total = (champ, liste) => liste.reduce((s, e) => s + e[champ], 0);

  const CARTES = [
    { label: "Points totaux", champ: "pointsPeriode" },
    { label: "Jours pointés", champ: "joursPresents" },
    { label: "Retards", champ: "joursRetard" },
    { label: "Rapports envoyés", champ: "rapportsEnvoyes" },
    { label: "Initiatives validées", champ: "initiativesValidees" },
    { label: "Avertissements", champ: "avertissementsPeriode" },
  ];

  const champEmploye = !seulEmploye ? meilleurEmploye(donnees) : null;
  const champDept = !seulEmploye ? meilleurDepartement(donnees) : null;

  return (
    <div>
      {!seulEmploye && (
        <>
          <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>Archives</h3>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "#5F5E5A" }}>
            Consultez les données de n'importe quel mois, trimestre, semestre ou année passés.
          </p>
        </>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <SelecteurPeriode periode={periode} onChange={setPeriode} annees={annees} />
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, color: "#5F5E5A" }}>
          <input type="checkbox" checked={comparer} onChange={(e) => setComparer(e.target.checked)} />
          Comparer avec {libellePeriode(periodeComp)}
        </label>
      </div>

      {!seulEmploye && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <Bouton
            variant="secondary"
            onClick={() => genererRapportPresenceHTML(employes, periode, libellePeriode(periode))}
          >
            📄 Rapport de présence RH (PDF)
          </Bouton>
          <Bouton
            variant="secondary"
            onClick={() => exporterPresenceCSV(employes, periode, libellePeriode(periode))}
          >
            ⬇ Exporter en CSV (paie)
          </Bouton>
        </div>
      )}

      {(champEmploye || champDept) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {champEmploye && (
            <CarteChampion
              titre={`Employé — ${libellePeriode(periode)}`}
              nom={champEmploye.nom}
              sousTitre={champEmploye.dept}
              initiales={champEmploye.initiales}
              pointsPeriode={champEmploye.pointsPeriode}
              lignes={[
                `${champEmploye.joursPresents} jour(s) pointé(s)`,
                `${champEmploye.joursRetard} retard(s)`,
                `${champEmploye.rapportsEnvoyes} rapport(s) envoyé(s)`,
                `${champEmploye.initiativesValidees} initiative(s) validée(s)`,
              ]}
            />
          )}
          {champDept && (
            <CarteChampion
              titre={`Département — ${libellePeriode(periode)}`}
              nom={champDept.dept}
              sousTitre={`${champDept.nbEmployes} employé${champDept.nbEmployes > 1 ? "s" : ""}`}
              pointsPeriode={champDept.pointsPeriode}
              lignes={[
                `${champDept.joursPresents} jour(s) pointé(s) au total`,
                `${champDept.joursRetard} retard(s) au total`,
                `${champDept.rapportsEnvoyes} rapport(s) envoyé(s)`,
                `${champDept.initiativesValidees} initiative(s) validée(s)`,
              ]}
            />
          )}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {CARTES.map((s) => {
          const val = total(s.champ, donnees);
          const valComp = donneesComp ? total(s.champ, donneesComp) : null;
          return (
            <Card key={s.champ} style={{ padding: "12px 14px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>{val}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#5F5E5A" }}>{s.label}</p>
              {donneesComp && (
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 11,
                    color: val >= valComp ? "#16A34A" : "#E11D48",
                  }}
                >
                  {val >= valComp ? "↑" : "↓"} vs {valComp}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {!seulEmploye && (
        <>
          <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 500 }}>
            Détail par employé — {libellePeriode(periode)}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 8,
            }}
          >
            {donnees.map((e) => (
              <Card key={e.id} style={{ padding: "10px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <Avatar initiales={e.initiales} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>{e.nom}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>{e.dept}</p>
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 600 }}>{e.pointsPeriode} pts</span>
                </div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12, color: "#5F5E5A" }}>
                  <span>{e.joursPresents} jours pointés</span>
                  <span>{e.joursRetard} retard(s)</span>
                  <span>{e.rapportsEnvoyes} rapport(s)</span>
                  <span>
                    {e.initiativesValidees}/{e.initiativesProposees} initiative(s) validée(s)
                  </span>
                  {e.avertissementsPeriode > 0 && (
                    <span style={{ color: "#993C1D" }}>{e.avertissementsPeriode} avertissement(s)</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CarteEmployeDuMois({ classement, criteres }) {
  if (!classement.length) return null;
  const leader = classement[0];
  const j = calculerJustificationEmployeDuMois(leader, criteres);
  const moisNom = new Date().toLocaleDateString("fr-FR", { month: "long" });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 20 }}>🏆</span>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
          Employé du mois — {moisNom}
        </h3>
      </div>
      <Card
        style={{
          background: "linear-gradient(135deg, #1877F2 0%, #0F4FA8 100%)",
          color: "#fff",
          border: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
          <Avatar initiales={leader.initiales} tone="success" />
          <div>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{leader.nom}</p>
            <p style={{ margin: 0, fontSize: 13, color: "#D9E7FD" }}>{leader.dept}</p>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 26, fontWeight: 700 }}>{j.score}/100</span>
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 7, fontSize: 13.5 }}>
          {j.objectifs !== null && <li>✓ {j.objectifs}% des objectifs atteints</li>}
          {j.taches !== null && <li>✓ {j.taches}% des tâches menées à bien</li>}
          {j.ponctualite !== null && <li>✓ {j.ponctualite}% de ponctualité</li>}
          <li>
            ✓ {j.initiativesCeMois} initiative{j.initiativesCeMois > 1 ? "s" : ""} validée
            {j.initiativesCeMois > 1 ? "s" : ""} ce mois-ci
          </li>
          <li>✓ Note moyenne des collègues : {j.noteCollegues.toFixed(1)}/5</li>
        </ul>
      </Card>
    </div>
  );
}

function NombreAnime({ cible, duree = 700 }) {
  const [valeur, setValeur] = useState(0);
  const precedent = useRef(cible);

  useEffect(() => {
    const depart = precedent.current;
    const debut = performance.now();
    let frame;
    const tick = (maintenant) => {
      const progres = Math.min(1, (maintenant - debut) / duree);
      setValeur(Math.round(depart + (cible - depart) * progres));
      if (progres < 1) frame = requestAnimationFrame(tick);
      else precedent.current = cible;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [cible, duree]);

  return <>{valeur}</>;
}

function VueManager({
  employes,
  valider,
  rejeter,
  assigner,
  criteres,
  setCriteres,
  resoudreContestation,
  ajouterEmploye,
  supprimerEmploye,
  codeEntreprise,
  evaluerRapport,
  estPrincipal,
  peutFaire,
  administrateurs,
  ajouterAdministrateur,
  retirerAdministrateur,
  bureau,
  definirBureauSurPositionActuelle,
  majRayonBureau,
  retirerBureau,
  majDateEntree,
  ajouterEtapeParcours,
  retirerEtapeParcours,
  ajouterAvertissement,
  retirerAvertissement,
  heureArrivee,
  majHeureArrivee,
  heureDepart,
  majHeureDepart,
  majMonMotDePasse,
  validerInitiative,
  rejeterInitiative,
  journalActivite,
  majSite,
  sites,
  siteActif,
  onChangerSiege,
  ajouterSiteEntreprise,
  renommerSiteEntreprise,
  supprimerSiteEntreprise,
  bureaux,
  definirBureauSiteSurPositionActuelle,
  majRayonBureauSite,
  retirerBureauSite,
  gestionGelee,
  traiterJustificationRetard,
  traiterAbsence,
  ajouterObjectif,
  retirerObjectif,
  marquerObjectifManuel,
  session,
  monIdentite,
  nomEntreprise,
  setNomEntreprise,
  adresseEntreprise,
  setAdresseEntreprise,
  felicitations,
  posterFelicitation,
  aimerFelicitation,
  lancerEntretien,
  soumettreEvaluationManager,
}) {
  const [empChoisi, setEmpChoisi] = useState(employes[0]?.id);
  const [titreTache, setTitreTache] = useState("");
  const [echeanceTache, setEcheanceTache] = useState("");
  const [prioriteTache, setPrioriteTache] = useState("Normal");
  const [afficherCriteres, setAfficherCriteres] = useState(false);
  const [employeDeplie, setEmployeDeplie] = useState(null);
  const [afficherAjoutEmploye, setAfficherAjoutEmploye] = useState(false);
  const [nouveauNom, setNouveauNom] = useState("");
  const [nouveauDept, setNouveauDept] = useState("");
  const [nouvelEmail, setNouvelEmail] = useState("");
  const [ongletActif, setOngletActif] = useState("apercu");
  const [empStatChoisi, setEmpStatChoisi] = useState(employes[0]?.id);
  const [profilOuvertId, setProfilOuvertId] = useState(null);

  const classement = useMemo(
    () =>
      employes
        .map((e) => ({ ...e, ...calculerScore(e, criteres) }))
        .sort((a, b) => b.score - a.score),
    [employes, criteres]
  );

  // Comparaison par département : moyenne du score en direct, et tendance
  // basée sur les points réellement engrangés ce mois-ci vs le mois dernier
  // (l'identifiant de chaque entrée du journal de points est un horodatage,
  // ce qui permet ce calcul sans avoir besoin d'un historique séparé).
  const parDepartement = useMemo(() => {
    const maintenant = new Date();
    const moisActuel = maintenant.getMonth();
    const anneeActuelle = maintenant.getFullYear();
    const moisPrecedent = moisActuel === 0 ? 11 : moisActuel - 1;
    const anneeMoisPrecedent = moisActuel === 0 ? anneeActuelle - 1 : anneeActuelle;

    const groupes = {};
    employes.forEach((e) => {
      const dept = e.dept || "Sans département";
      if (!groupes[dept]) groupes[dept] = { dept, employes: [], pointsCeMois: 0, pointsMoisDernier: 0 };
      const { score } = calculerScore(e, criteres);
      groupes[dept].employes.push({ ...e, score });
      (e.journalPoints || []).forEach((p) => {
        const d = new Date(p.id);
        if (d.getFullYear() === anneeActuelle && d.getMonth() === moisActuel) {
          groupes[dept].pointsCeMois += p.points;
        } else if (d.getFullYear() === anneeMoisPrecedent && d.getMonth() === moisPrecedent) {
          groupes[dept].pointsMoisDernier += p.points;
        }
      });
    });

    return Object.values(groupes)
      .map((g) => ({
        ...g,
        moyenne: Math.round(g.employes.reduce((s, e) => s + e.score, 0) / g.employes.length),
        tendance: g.pointsCeMois - g.pointsMoisDernier,
        aHistorique: g.pointsMoisDernier !== 0 || g.pointsCeMois !== 0,
      }))
      .sort((a, b) => b.moyenne - a.moyenne);
  }, [employes, criteres]);

  // Évolution mensuelle sur l'année en cours, calculée à partir du journal
  // de points de chaque employé (dont l'identifiant sert d'horodatage
  // réel). Sert au graphique de la comparaison annuelle.
  const statsAnnee = useMemo(() => calculerStatsAnnee(employes), [employes]);

  const palmares = useMemo(() => calculerPalmares(statsAnnee), [statsAnnee]);
  const anomaliesEmployes = useMemo(() => detecterAnomaliesEmployes(employes), [employes]);
  const anomaliesDepartements = useMemo(() => detecterAnomaliesDepartements(employes), [employes]);
  const blocages = useMemo(() => calculerBlocages(employes), [employes]);
  const tempsValidation = useMemo(() => calculerTempsValidation(employes), [employes]);

  const [presenceSousOnglet, setPresenceSousOnglet] = useState("presents");
  const presenceAujourdhui = useMemo(
    () =>
      employes.map((e) => {
        const p = pointageDuJour(e);
        const arrivee = (p && p.arrivee) || null;
        const depart = (p && p.depart) || null;
        const enRetard =
          p && typeof p.enRetard === "boolean"
            ? p.enRetard
            : !!(arrivee && heureArrivee && arrivee > heureArrivee);
        const departAnticipe = !!(depart && heureDepart && depart < heureDepart);
        const enMission = !!(p && p.enMission);
        const lieuMission = (p && p.lieuMission) || "";
        const justificationMission = (p && p.justificationMission) || "";
        const coordsMission = (p && p.coordsMission) || null;
        const justificationRetard = (p && p.justificationRetard) || "";
        const statutRetard = (p && p.statutRetard) || "";
        return {
          ...e,
          arrivee,
          depart,
          enRetard,
          departAnticipe,
          enMission,
          lieuMission,
          justificationMission,
          coordsMission,
          justificationRetard,
          statutRetard,
        };
      }),
    [employes, heureArrivee, heureDepart]
  );
  const presentsAujourdhui = presenceAujourdhui.filter((e) => e.arrivee);
  const absentsAujourdhui = presenceAujourdhui.filter((e) => !e.arrivee);
  const retardsAujourdhui = presentsAujourdhui.filter((e) => e.enRetard);

  const toutesLesAbsences = employes.flatMap((e) =>
    (e.absences || [])
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((a) => ({ ...a, empId: e.id, empNom: e.nom, empDept: e.dept, empInitiales: e.initiales }))
  );
  const absencesEnAttente = toutesLesAbsences.filter((a) => a.statut === "en_attente");

  const enAttente = employes.flatMap((e) =>
    e.taches
      .filter((t) => t.statut === "en_attente")
      .map((t) => ({ ...t, empId: e.id, empNom: e.nom }))
  );

  const initiativesEnAttente = employes.flatMap((e) =>
    (e.initiatives || [])
      .filter((i) => i.statut === "en_attente")
      .map((i) => ({ ...i, empId: e.id, empNom: e.nom }))
  );

  const toutesLesTaches = employes.flatMap((e) =>
    e.taches
      .filter((t) => t.statut !== "validee")
      .map((t) => ({ ...t, empId: e.id, empNom: e.nom }))
  );

  const tachesParEmploye = employes
    .map((e) => ({
      empId: e.id,
      empNom: e.nom,
      dept: e.dept,
      initiales: e.initiales,
      taches: e.taches.filter((t) => t.statut !== "validee"),
    }))
    .filter((g) => g.taches.length > 0);

  const contestationsOuvertes = employes.flatMap((e) =>
    (e.contestations || [])
      .filter((c) => c.statut === "en_attente")
      .map((c) => ({ ...c, empId: e.id, empNom: e.nom }))
  );

  // Radar du dirigeant : une synthèse quotidienne, calculée uniquement à
  // partir de données déjà présentes dans l'application (pas de nouvelle
  // saisie côté employé).
  const radarDirigeant = useMemo(() => {
    const total = employes.length;
    const presents = employes.filter((e) => {
      const p = pointageDuJour(e);
      return p && p.arrivee;
    }).length;
    const retardsSemaine = employes.reduce((s, e) => s + (e.retards || 0), 0);
    const maintenant = new Date();
    const tachesCritiques = toutesLesTaches.filter((t) => {
      if (!t.echeance) return false;
      if (t.priorite !== "Urgent" && t.priorite !== "Prioritaire") return false;
      return new Date(t.echeance) < maintenant;
    }).length;
    const deptLeader = parDepartement[0] || null;
    return { total, presents, retardsSemaine, tachesCritiques, deptLeader };
  }, [employes, toutesLesTaches, parDepartement]);

  // Business Health Score : moyenne simple de 5 dimensions déjà mesurées
  // ailleurs dans l'application (aucune pondération cachée), pour donner
  // une vue d'ensemble en un coup d'œil.
  const healthScore = useMemo(() => {
    const total = employes.length || 1;
    const presence =
      (employes.filter((e) => {
        const p = pointageDuJour(e);
        return p && p.arrivee;
      }).length /
        total) *
      100;
    const performance = classement.length
      ? classement.reduce((s, e) => s + e.score, 0) / classement.length
      : 75;
    const tachesActives = toutesLesTaches;
    const dansLesDelais = tachesActives.length
      ? (tachesActives.filter((t) => !t.echeance || new Date(t.echeance) >= new Date()).length /
          tachesActives.length) *
        100
      : 100;
    const rapportsEnvoyes = employes.length
      ? (employes.filter((e) => {
          const r = rapportDuJour(e);
          return r && r.envoye;
        }).length /
          total) *
        100
      : 0;
    const collaboration = employes.length
      ? employes.reduce((s, e) => s + (moyenne(e.notesPairs || []) / 5) * 100, 0) / employes.length
      : 75;

    const dimensions = [
      { label: "Présence", valeur: Math.round(presence) },
      { label: "Performance", valeur: Math.round(performance) },
      { label: "Respect des délais", valeur: Math.round(dansLesDelais) },
      { label: "Rapports remis", valeur: Math.round(rapportsEnvoyes) },
      { label: "Collaboration", valeur: Math.round(collaboration) },
    ];
    const global = Math.round(dimensions.reduce((s, d) => s + d.valeur, 0) / dimensions.length);
    return { global, dimensions };
  }, [employes, classement, toutesLesTaches]);

  const [objectifLie, setObjectifLie] = useState("");
  const [titreObjectif, setTitreObjectif] = useState("");
  const [echeanceObjectif, setEcheanceObjectif] = useState("");

  const soumettreTache = () => {
    if (!titreTache.trim() || !empChoisi) return;
    assigner(empChoisi, titreTache.trim(), echeanceTache, prioriteTache, objectifLie || null);
    setTitreTache("");
    setEcheanceTache("");
    setPrioriteTache("Normal");
    setObjectifLie("");
  };

  if (afficherCriteres) {
    return (
      <EcranCriteres
        criteres={criteres}
        setCriteres={setCriteres}
        fermer={() => setAfficherCriteres(false)}
      />
    );
  }

  const onglets = [
    { id: "apercu", label: "Aperçu", icone: <IconHome />, count: 0 },
    { id: "presence", label: "Présence", icone: <IconRealise />, count: retardsAujourdhui.length },
    { id: "employes", label: "Employés", icone: <IconPeople />, count: employes.length },
    ...(estPrincipal || peutFaire("assignerTaches") || peutFaire("validerTaches")
      ? [{ id: "taches", label: "Tâches", icone: <IconClipboard />, count: enAttente.length }]
      : []),
    ...(estPrincipal || peutFaire("consulterRapports")
      ? [{ id: "rapports", label: "Rapports", icone: <IconCalendar />, count: 0 }]
      : []),
    ...(estPrincipal || peutFaire("resoudreContestations")
      ? [{ id: "contestations", label: "Contestations", icone: <IconAlertTriangle />, count: contestationsOuvertes.length }]
      : []),
    { id: "reconnaissance", label: "Reconnaissance", icone: <span style={{ fontSize: 16 }}>👏</span>, count: 0 },
    {
      id: "entretiens",
      label: "Entretiens",
      icone: <span style={{ fontSize: 16 }}>🗣️</span>,
      count: employes.reduce(
        (s, e) => s + (e.entretiens || []).filter((ent) => ent.statut === "en_attente_manager").length,
        0
      ),
    },
    { id: "statistiques", label: "Statistiques", icone: <IconTrendUp />, count: 0 },
    { id: "assistant", label: "Assistant", icone: <span style={{ fontSize: 16 }}>🤖</span>, count: 0 },
    { id: "archives", label: "Archives", icone: <IconArchive />, count: 0 },
    { id: "compte", label: "Compte", icone: <IconGear />, count: 0 },
  ];

  return (
    <div className="nav-shell">
      <style>{STYLES_NAV}</style>
      <OngletsNav onglets={onglets} actif={ongletActif} onChange={setOngletActif} />

      <div className="nav-content">
      {sites.length > 1 && siteActif && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
            fontSize: 13,
            color: "#5F5E5A",
          }}
        >
          <span>
            📍 Siège actif : <strong style={{ color: "#2C2C2A" }}>{siteActif}</strong>
          </span>
          <span onClick={onChangerSiege} style={{ color: "#1877F2", cursor: "pointer" }}>
            Changer de siège
          </span>
        </div>
      )}
      <div className="nav-panel-inner" key={ongletActif} style={{ display: "grid", gap: 24 }}>
        {ongletActif === "apercu" && (
          <>
            <style>{STYLES_STATS}</style>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: 20,
                alignItems: "stretch",
              }}
            >
              <Card style={{ background: "#20231F", color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 18 }}>🧭</span>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Radar du jour</p>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 7, fontSize: 13.5 }}>
                  <li>
                    👥 {radarDirigeant.presents}/{radarDirigeant.total} employé
                    {radarDirigeant.total > 1 ? "s" : ""} {radarDirigeant.presents > 1 ? "ont" : "a"} pointé
                    aujourd'hui
                  </li>
                  {radarDirigeant.retardsSemaine > 0 && (
                    <li>⏰ {radarDirigeant.retardsSemaine} retard(s) signalé(s) cette semaine</li>
                  )}
                  {radarDirigeant.tachesCritiques > 0 && (
                    <li>🔴 {radarDirigeant.tachesCritiques} tâche(s) urgente(s) en retard</li>
                  )}
                  {radarDirigeant.deptLeader && (
                    <li>
                      🏆 Département en tête : {radarDirigeant.deptLeader.dept} (
                      {radarDirigeant.deptLeader.moyenne}/100)
                    </li>
                  )}
                  {enAttente.length > 0 && (
                    <li>📋 {enAttente.length} tâche(s) en attente de votre validation</li>
                  )}
                  {contestationsOuvertes.length > 0 && (
                    <li>⚠️ {contestationsOuvertes.length} contestation(s) en attente</li>
                  )}
                  {radarDirigeant.retardsSemaine === 0 &&
                    radarDirigeant.tachesCritiques === 0 &&
                    enAttente.length === 0 &&
                    contestationsOuvertes.length === 0 && <li>✅ Tout est calme aujourd'hui.</li>}
                </ul>
              </Card>

              <Card className="stat-chart-wrap">
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      background: `conic-gradient(${couleurScore(healthScore.global)} ${
                        healthScore.global * 3.6
                      }deg, #F1EFE8 0deg)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 76,
                        height: 76,
                        borderRadius: "50%",
                        background: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: 24, fontWeight: 700 }}>
                        <NombreAnime cible={healthScore.global} />
                      </span>
                      <span style={{ fontSize: 10, color: "#5F5E5A" }}>/100</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Santé de l'entreprise</p>
                      {statsAnnee.penteTotal !== 0 && (
                        <Badge tone={statsAnnee.penteTotal > 0 ? "success" : "warning"}>
                          {statsAnnee.penteTotal > 0 ? "↑ tendance positive" : "↓ tendance en baisse"}
                        </Badge>
                      )}
                    </div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {healthScore.dimensions.map((d) => (
                        <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                          <span style={{ width: 110, color: "#5F5E5A" }}>{d.label}</span>
                          <div style={{ flex: 1, height: 6, background: "#F1EFE8", borderRadius: 4, overflow: "hidden" }}>
                            <div
                              style={{
                                width: `${d.valeur}%`,
                                height: "100%",
                                background: couleurScore(d.valeur),
                                borderRadius: 4,
                                transition: "width 0.4s ease",
                              }}
                            />
                          </div>
                          <span style={{ width: 28, textAlign: "right" }}>{d.valeur}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
                gap: 24,
                alignItems: "start",
              }}
            >
              <div style={{ display: "grid", gap: 24 }}>
                {enAttente.length > 0 && (
                  <Alerte>
                    {enAttente.length === 1
                      ? `${enAttente[0].empNom} a déclaré « ${enAttente[0].titre} » comme accomplie — en attente de votre validation.`
                      : `${enAttente.length} tâches déclarées accomplies en attente de votre validation.`}
                  </Alerte>
                )}
                {contestationsOuvertes.length > 0 && (
                  <Alerte tone="accent">
                    {contestationsOuvertes.length} contestation{contestationsOuvertes.length > 1 ? "s" : ""}{" "}
                    en attente de réponse.
                  </Alerte>
                )}

                {(anomaliesEmployes.length > 0 || anomaliesDepartements.length > 0) && (
                  <div style={{ display: "grid", gap: 8 }}>
                    {anomaliesEmployes.map((a) => (
                      <Alerte key={a.nom} tone="accent">
                        ⚠️ Attention : la performance de {a.nom} a diminué de {a.baisse}% sur les
                        quatre dernières semaines.
                      </Alerte>
                    ))}
                    {anomaliesDepartements.map((a) => (
                      <Alerte key={a.dept} tone="accent">
                        ⚠️ Le département {a.dept} connaît une baisse d'activité de {a.baisse}% sur
                        les quatre dernières semaines.
                      </Alerte>
                    ))}
                  </div>
                )}

                <CarteEmployeDuMois classement={classement} criteres={criteres} />

                {parDepartement.length > 1 && (
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>
                      Comparaison par département
                    </h3>
                    <div style={{ display: "grid", gap: 8 }}>
                      {parDepartement.map((g) => (
                        <Card key={g.dept} style={{ padding: "12px 16px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 8,
                            }}
                          >
                            <div>
                              <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{g.dept}</p>
                              <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
                                {g.employes.length} employé{g.employes.length > 1 ? "s" : ""}
                              </p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              {g.aHistorique && (
                                <Badge tone={g.tendance >= 0 ? "success" : "warning"}>
                                  {g.tendance >= 0 ? "↑" : "↓"} {Math.abs(g.tendance)} pts vs mois dernier
                                </Badge>
                              )}
                              <span style={{ fontSize: 20, fontWeight: 600 }}>{g.moyenne}</span>
                            </div>
                          </div>
                          <div
                            style={{
                              height: 6,
                              borderRadius: 4,
                              background: "#F1EFE8",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${Math.max(0, Math.min(100, g.moyenne))}%`,
                                background: "#1877F2",
                                borderRadius: 4,
                                transition: "width 0.4s ease",
                              }}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
                    Classement (calcul en direct)
                  </h3>
                  <Bouton variant="secondary" onClick={() => exporterPDF(classement, criteres)}>
                    ⬇ Exporter en PDF
                  </Bouton>
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {classement.map((e, i) => (
                    <Card key={e.id} style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ width: 22, fontWeight: 500, fontSize: 14 }}>
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                        </span>
                        <Avatar initiales={e.initiales} tone={i === 0 ? "success" : "neutral"} />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: 14 }}>{e.nom}</p>
                          <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>{e.dept}</p>
                        </div>
                        <span style={{ fontSize: 18, fontWeight: 500 }}>{e.score}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {ongletActif === "presence" && (
          <>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
              Heure d'arrivée attendue : <strong>{heureArrivee}</strong>. Basé sur le pointage
              géolocalisé du jour, réinitialisé chaque matin.
            </p>

            <div className="nav-tabs" style={{ marginBottom: 16 }}>
              <button
                className={`nav-tab ${presenceSousOnglet === "presents" ? "active" : ""}`}
                onClick={() => setPresenceSousOnglet("presents")}
              >
                Présents aujourd'hui <span className="n-count">{presentsAujourdhui.length}</span>
              </button>
              <button
                className={`nav-tab ${presenceSousOnglet === "retards" ? "active" : ""}`}
                onClick={() => setPresenceSousOnglet("retards")}
              >
                Retards <span className="n-count">{retardsAujourdhui.length}</span>
              </button>
              <button
                className={`nav-tab ${presenceSousOnglet === "absences" ? "active" : ""}`}
                onClick={() => setPresenceSousOnglet("absences")}
              >
                Absences <span className="n-count">{absencesEnAttente.length}</span>
              </button>
            </div>

            {presenceSousOnglet === "presents" && (
              <div style={{ display: "grid", gap: 8 }}>
                {presentsAujourdhui.map((e) => (
                  <Card key={e.id} style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar initiales={e.initiales} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14 }}>{e.nom}</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>{e.dept}</p>
                      </div>
                      {e.enMission ? (
                        <Badge tone="accent">En mission — arrivée {e.arrivee}</Badge>
                      ) : (
                        <Badge tone={e.enRetard ? "warning" : "success"}>Arrivée {e.arrivee}</Badge>
                      )}
                      {e.depart ? (
                        <Badge tone={e.departAnticipe ? "warning" : "neutral"}>
                          Départ {e.depart}
                          {e.departAnticipe ? " (anticipé)" : ""}
                        </Badge>
                      ) : (
                        <span style={{ fontSize: 12, color: "#5F5E5A" }}>Encore présent</span>
                      )}
                    </div>
                    {e.enMission && (
                      <div
                        style={{
                          marginTop: 10,
                          paddingTop: 10,
                          borderTop: "1px solid #E5E3DA",
                          fontSize: 12.5,
                          color: "#5F5E5A",
                        }}
                      >
                        <p style={{ margin: "0 0 3px" }}>
                          <strong>Lieu :</strong> {e.lieuMission}
                        </p>
                        <p style={{ margin: e.coordsMission ? "0 0 3px" : 0 }}>
                          <strong>Justification :</strong> {e.justificationMission}
                        </p>
                        {e.coordsMission && (
                          <a
                            href={`https://www.google.com/maps?q=${e.coordsMission.lat},${e.coordsMission.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#1877F2", textDecoration: "none" }}
                          >
                            📍 Voir la position confirmée sur la carte
                          </a>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
                {absentsAujourdhui.length > 0 && (
                  <>
                    <p style={{ margin: "12px 0 4px", fontSize: 13, fontWeight: 500 }}>
                      Pas encore pointé ({absentsAujourdhui.length})
                    </p>
                    {absentsAujourdhui.map((e) => (
                      <Card key={e.id} style={{ padding: "10px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <Avatar initiales={e.initiales} />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 14 }}>{e.nom}</p>
                            <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>{e.dept}</p>
                          </div>
                          <Badge tone="neutral">Absent</Badge>
                        </div>
                      </Card>
                    ))}
                  </>
                )}
                {presentsAujourdhui.length === 0 && absentsAujourdhui.length === 0 && (
                  <p style={{ fontSize: 13, color: "#5F5E5A" }}>Aucun employé pour le moment.</p>
                )}
              </div>
            )}

            {presenceSousOnglet === "retards" && (
              <div style={{ display: "grid", gap: 8 }}>
                {retardsAujourdhui.length === 0 && (
                  <p style={{ fontSize: 13, color: "#5F5E5A" }}>
                    Aucun retard signalé aujourd'hui.
                  </p>
                )}
                {retardsAujourdhui.map((e) => (
                  <Card key={e.id} style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar initiales={e.initiales} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14 }}>{e.nom}</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>{e.dept}</p>
                      </div>
                      <Badge tone="warning">
                        {minutesEcart(heureArrivee, e.arrivee)} min de retard (arrivée {e.arrivee})
                      </Badge>
                    </div>
                    {e.justificationRetard && (
                      <div
                        style={{
                          marginTop: 10,
                          paddingTop: 10,
                          borderTop: "1px solid #E5E3DA",
                        }}
                      >
                        <p style={{ margin: "0 0 8px", fontSize: 13, color: "#5F5E5A" }}>
                          <strong>Explication :</strong> {e.justificationRetard}
                        </p>
                        {(!e.statutRetard || e.statutRetard === "en_attente") && (
                          <div style={{ display: "flex", gap: 8 }}>
                            <Bouton
                              variant="danger"
                              onClick={() => traiterJustificationRetard(e.id, "refusee")}
                            >
                              Refuser
                            </Bouton>
                            <Bouton
                              variant="success"
                              onClick={() => traiterJustificationRetard(e.id, "acceptee")}
                            >
                              Accepter
                            </Bouton>
                          </div>
                        )}
                        {e.statutRetard === "acceptee" && <Badge tone="success">Retard justifié</Badge>}
                        {e.statutRetard === "refusee" && <Badge tone="warning">Retard non justifié</Badge>}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {presenceSousOnglet === "absences" && (
              <div style={{ display: "grid", gap: 8 }}>
                {toutesLesAbsences.length === 0 && (
                  <p style={{ fontSize: 13, color: "#5F5E5A" }}>Aucune absence déclarée.</p>
                )}
                {toutesLesAbsences.map((a) => (
                  <Card key={a.id} style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <Avatar initiales={a.empInitiales} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14 }}>{a.empNom}</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
                          {a.empDept} ·{" "}
                          {new Date(a.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      {a.statut === "en_attente" && <Badge tone="warning">En attente</Badge>}
                      {a.statut === "validee" && <Badge tone="success">Validée</Badge>}
                      {a.statut === "refusee" && <Badge tone="neutral">Refusée</Badge>}
                    </div>
                    <p style={{ margin: "0 0 4px", fontSize: 13, color: "#5F5E5A" }}>
                      <strong>Motif :</strong> {a.motif}
                    </p>
                    {a.commentaire && (
                      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#5F5E5A" }}>{a.commentaire}</p>
                    )}
                    {a.statut === "en_attente" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <Bouton variant="danger" onClick={() => traiterAbsence(a.empId, a.id, "refusee")}>
                          Refuser
                        </Bouton>
                        <Bouton variant="success" onClick={() => traiterAbsence(a.empId, a.id, "validee")}>
                          Valider
                        </Bouton>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {ongletActif === "employes" && (
          <>
            {estPrincipal && (
              <div>
                <Bouton
                  variant="secondary"
                  onClick={() => setAfficherAjoutEmploye(!afficherAjoutEmploye)}
                >
                  + Ajouter un employé
                </Bouton>
              </div>
            )}

            {afficherAjoutEmploye && estPrincipal && (
              <Card style={{ display: "grid", gap: 10 }}>
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={nouveauNom}
                  onChange={(e) => setNouveauNom(e.target.value)}
                  style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14 }}
                />
                <input
                  type="text"
                  placeholder="Département"
                  value={nouveauDept}
                  onChange={(e) => setNouveauDept(e.target.value)}
                  style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14 }}
                />
                <input
                  type="email"
                  placeholder="Email professionnel (pour la connexion)"
                  value={nouvelEmail}
                  onChange={(e) => setNouvelEmail(e.target.value)}
                  style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14 }}
                />
                <p style={{ fontSize: 12, color: "#5F5E5A", margin: 0 }}>
                  L'employé pourra créer son propre compte en s'inscrivant avec cet email exact.
                </p>
                <Bouton
                  variant="primary"
                  disabled={!nouveauNom.trim() || !nouvelEmail.trim()}
                  onClick={() => {
                    ajouterEmploye(nouveauNom.trim(), nouveauDept.trim(), nouvelEmail.trim());
                    setNouveauNom("");
                    setNouveauDept("");
                    setNouvelEmail("");
                    setAfficherAjoutEmploye(false);
                  }}
                >
                  Ajouter cet employé
                </Bouton>
              </Card>
            )}

            <div>
              <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>
                Employés ({employes.length})
              </h3>
              <div style={{ display: "grid", gap: 8 }}>
                {employes.map((e) => (
                  <Card key={e.id} style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar initiales={e.initiales} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14 }}>{e.nom}</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
                          {e.dept} {e.email ? `· ${e.email}` : ""}
                        </p>
                      </div>
                      {estPrincipal && sites.length > 0 ? (
                        <select
                          value={e.site || ""}
                          onChange={(ev) => majSite(e.id, ev.target.value)}
                          style={{
                            width: 120,
                            padding: "6px 8px",
                            borderRadius: 6,
                            border: "1px solid #E5E3DA",
                            fontSize: 12,
                          }}
                        >
                          <option value="">Aucun siège</option>
                          {sites.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        e.site && <Badge tone="neutral">{e.site}</Badge>
                      )}
                      <Bouton
                        variant="secondary"
                        onClick={() => setProfilOuvertId(profilOuvertId === e.id ? null : e.id)}
                      >
                        {profilOuvertId === e.id ? "Fermer" : "Profil"}
                      </Bouton>
                      {estPrincipal && (
                        <Bouton
                          variant="danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Retirer ${e.nom} de l'équipe ? Son compte n'aura plus accès aux données de l'entreprise.`
                              )
                            ) {
                              supprimerEmploye(e.id);
                            }
                          }}
                        >
                          Retirer
                        </Bouton>
                      )}
                    </div>
                    {profilOuvertId === e.id && (
                      <div style={{ borderTop: "1px solid #E5E3DA", marginTop: 12, paddingTop: 16 }}>
                        <ProfilEmployeCarte
                          employe={e}
                          statsAnnee={statsAnnee}
                          palmares={palmares}
                          estPrincipal={estPrincipal}
                          majDateEntree={majDateEntree}
                          ajouterEtapeParcours={ajouterEtapeParcours}
                          retirerEtapeParcours={retirerEtapeParcours}
                          ajouterAvertissement={ajouterAvertissement}
                          retirerAvertissement={retirerAvertissement}
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {ongletActif === "taches" && (
          <>
            {(estPrincipal || peutFaire("assignerTaches")) && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>
                  Assigner une tâche
                </h3>
                <Card style={{ display: "grid", gap: 10 }}>
                  <select
                    value={empChoisi}
                    onChange={(e) => setEmpChoisi(Number(e.target.value))}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #E5E3DA",
                      fontSize: 14,
                    }}
                  >
                    {employes.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nom} — {e.dept}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Ex : Rapport mensuel clients"
                    value={titreTache}
                    onChange={(e) => setTitreTache(e.target.value)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #E5E3DA",
                      fontSize: 14,
                    }}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <input
                      type="date"
                      value={echeanceTache}
                      onChange={(e) => setEcheanceTache(e.target.value)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 6,
                        border: "1px solid #E5E3DA",
                        fontSize: 14,
                      }}
                    />
                    <select
                      value={prioriteTache}
                      onChange={(e) => setPrioriteTache(e.target.value)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 6,
                        border: "1px solid #E5E3DA",
                        fontSize: 14,
                      }}
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="Prioritaire">Prioritaire</option>
                      <option value="Important">Important</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </div>
                  {(() => {
                    const empSelectionne = employes.find((e) => e.id === empChoisi);
                    const sesObjectifs = empSelectionne?.objectifs || [];
                    return (
                      <select
                        value={objectifLie}
                        onChange={(e) => setObjectifLie(e.target.value ? Number(e.target.value) : "")}
                        style={{
                          padding: "8px 10px",
                          borderRadius: 6,
                          border: "1px solid #E5E3DA",
                          fontSize: 14,
                        }}
                      >
                        <option value="">Objectif lié (optionnel)</option>
                        {sesObjectifs.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.titre}
                          </option>
                        ))}
                      </select>
                    );
                  })()}
                  <Bouton variant="primary" onClick={soumettreTache} disabled={!titreTache.trim()}>
                    + Ajouter la tâche
                  </Bouton>
                </Card>
              </div>
            )}

            {(estPrincipal || peutFaire("assignerTaches")) &&
              (() => {
                const empSelectionne = employes.find((e) => e.id === empChoisi);
                const sesObjectifs = empSelectionne?.objectifs || [];
                return (
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>
                      Objectifs de {empSelectionne?.nom}
                    </h3>
                    <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
                      Un objectif atteint automatiquement dès que toutes ses tâches liées sont
                      validées — ou, s'il n'a aucune tâche liée, à trancher vous-même.
                    </p>
                    <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                      {sesObjectifs.length === 0 && (
                        <p style={{ fontSize: 13, color: "#5F5E5A" }}>
                          Aucun objectif fixé pour l'instant — le score utilise en attendant une
                          règle générale basée sur les tâches.
                        </p>
                      )}
                      {sesObjectifs.map((o) => {
                        const statut = statutObjectif(o, empSelectionne.taches);
                        const nbTachesLiees = empSelectionne.taches.filter(
                          (t) => t.objectifId === o.id
                        ).length;
                        return (
                          <Card key={o.id} style={{ padding: "10px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: 14 }}>{o.titre}</p>
                                <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
                                  {o.echeance
                                    ? `Échéance ${new Date(o.echeance).toLocaleDateString("fr-FR")}`
                                    : "Sans échéance"}{" "}
                                  · {nbTachesLiees} tâche{nbTachesLiees > 1 ? "s" : ""} liée
                                  {nbTachesLiees > 1 ? "s" : ""}
                                </p>
                              </div>
                              {statut === "atteint" && <Badge tone="success">Atteint</Badge>}
                              {statut === "non_atteint" && <Badge tone="warning">Non atteint</Badge>}
                              {statut === "en_cours" && <Badge tone="neutral">En cours</Badge>}
                              <Bouton variant="danger" onClick={() => retirerObjectif(empChoisi, o.id)}>
                                Retirer
                              </Bouton>
                            </div>
                            {nbTachesLiees === 0 && (
                              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                                <Bouton
                                  variant="success"
                                  onClick={() => marquerObjectifManuel(empChoisi, o.id, "atteint")}
                                >
                                  Marquer atteint
                                </Bouton>
                                <Bouton
                                  variant="secondary"
                                  onClick={() => marquerObjectifManuel(empChoisi, o.id, "non_atteint")}
                                >
                                  Marquer non atteint
                                </Bouton>
                              </div>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                    <Card style={{ display: "grid", gap: 10 }}>
                      <input
                        type="text"
                        placeholder="Ex : Signer 5 nouveaux clients ce mois-ci"
                        value={titreObjectif}
                        onChange={(e) => setTitreObjectif(e.target.value)}
                        style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14 }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="date"
                          value={echeanceObjectif}
                          onChange={(e) => setEcheanceObjectif(e.target.value)}
                          style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14 }}
                        />
                        <Bouton
                          variant="primary"
                          onClick={() => {
                            if (!titreObjectif.trim()) return;
                            ajouterObjectif(empChoisi, {
                              titre: titreObjectif.trim(),
                              echeance: echeanceObjectif,
                            });
                            setTitreObjectif("");
                            setEcheanceObjectif("");
                          }}
                          disabled={!titreObjectif.trim()}
                        >
                          + Fixer cet objectif
                        </Bouton>
                      </div>
                    </Card>
                  </div>
                );
              })()}

            <div>
              <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>
                Tâches en cours ({toutesLesTaches.length})
              </h3>
              {tachesParEmploye.length === 0 && (
                <p style={{ fontSize: 14, color: "#5F5E5A" }}>
                  Aucune tâche en cours pour le moment.
                </p>
              )}
              <div style={{ display: "grid", gap: 8 }}>
                {tachesParEmploye.map((g) => (
                  <Card key={g.empId} style={{ padding: 0, overflow: "hidden" }}>
                    <div
                      onClick={() =>
                        setEmployeDeplie(employeDeplie === g.empId ? null : g.empId)
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        cursor: "pointer",
                      }}
                    >
                      <Avatar initiales={g.initiales} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14 }}>{g.empNom}</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>{g.dept}</p>
                      </div>
                      <Badge>{g.taches.length} tâche{g.taches.length > 1 ? "s" : ""}</Badge>
                      <span style={{ fontSize: 12, color: "#5F5E5A" }}>
                        {employeDeplie === g.empId ? "▲" : "▼"}
                      </span>
                    </div>
                    {employeDeplie === g.empId && (
                      <div style={{ borderTop: "1px solid #E5E3DA" }}>
                        {g.taches.map((t) => (
                          <div
                            key={t.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "10px 16px",
                              borderTop: "1px solid #F1EFE8",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontSize: 14 }}>{t.titre}</p>
                              {t.echeance && (
                                <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
                                  Échéance :{" "}
                                  {new Date(t.echeance).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </p>
                              )}
                            </div>
                            {t.priorite && (
                              <Badge
                                tone={
                                  t.priorite === "Urgent"
                                    ? "warning"
                                    : t.priorite === "Prioritaire"
                                    ? "accent"
                                    : "neutral"
                                }
                              >
                                {t.priorite}
                              </Badge>
                            )}
                            {t.statut === "a_faire" && <Badge>À faire</Badge>}
                            {t.statut === "en_attente" && <Badge tone="warning">En attente</Badge>}
                            {(estPrincipal || peutFaire("assignerTaches")) && (
                              <button
                                type="button"

                                onClick={(e) => {
                                  e.stopPropagation();
                                  supprimerTache(g.empId, t.id);
                                }}
                                title="Supprimer cette tâche"
                                style={{
                                  border: "1px solid #F3C6C6",
                                  background: "#FFF7F7",
                                  color: "#B42318",
                                  borderRadius: 7,
                                  padding: "5px 9px",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  opacity: 1,
                                  flexShrink: 0,
                                }}
                              >
                                🗑 Supprimer
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {(estPrincipal || peutFaire("validerTaches")) && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                  gap: 24,
                }}
              >
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>
                    Tâches à valider ({enAttente.length})
                  </h3>
                  {enAttente.length === 0 && (
                    <p style={{ fontSize: 14, color: "#5F5E5A" }}>Rien en attente pour le moment.</p>
                  )}
                  <div style={{ display: "grid", gap: 8 }}>
                    {enAttente.map((t) => (
                      <TacheAValiderCard
                        key={t.id}
                        tache={t}
                        valider={valider}
                        rejeter={rejeter}
                        desactive={gestionGelee}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>
                    Initiatives à valider ({initiativesEnAttente.length})
                  </h3>
                  {initiativesEnAttente.length === 0 && (
                    <p style={{ fontSize: 14, color: "#5F5E5A" }}>Rien en attente pour le moment.</p>
                  )}
                  <div style={{ display: "grid", gap: 8 }}>
                    {initiativesEnAttente.map((i) => (
                      <InitiativeAValiderCard
                        key={i.id}
                        initiative={i}
                        valider={validerInitiative}
                        rejeter={rejeterInitiative}
                        desactive={gestionGelee}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(estPrincipal || peutFaire("validerTaches")) && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>
                  Proactivité de l'équipe
                </h3>
                <Card style={{ padding: 0, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#FAF9F5" }}>
                        <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 500, color: "#5F5E5A" }}>
                          Employé
                        </th>
                        <th style={{ textAlign: "center", padding: "10px 8px", fontWeight: 500, color: "#5F5E5A" }}>
                          Proposées
                        </th>
                        <th style={{ textAlign: "center", padding: "10px 8px", fontWeight: 500, color: "#16A34A" }}>
                          Validées
                        </th>
                        <th style={{ textAlign: "center", padding: "10px 8px", fontWeight: 500, color: "#E11D48" }}>
                          Refusées
                        </th>
                        <th style={{ textAlign: "center", padding: "10px 8px", fontWeight: 500, color: "#D97706" }}>
                          En attente
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {employes.map((e) => {
                        const liste = e.initiatives || [];
                        const validees = liste.filter((i) => i.statut === "validee").length;
                        const rejetees = liste.filter((i) => i.statut === "rejetee").length;
                        const attente = liste.filter((i) => i.statut === "en_attente").length;
                        return (
                          <tr key={e.id} style={{ borderTop: "1px solid #E5E3DA" }}>
                            <td style={{ padding: "10px 14px" }}>{e.nom}</td>
                            <td style={{ textAlign: "center", padding: "10px 8px" }}>{liste.length}</td>
                            <td style={{ textAlign: "center", padding: "10px 8px", color: "#16A34A", fontWeight: 500 }}>
                              {validees}
                            </td>
                            <td style={{ textAlign: "center", padding: "10px 8px", color: "#E11D48" }}>
                              {rejetees}
                            </td>
                            <td style={{ textAlign: "center", padding: "10px 8px", color: "#D97706" }}>
                              {attente}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}
          </>
        )}

        {ongletActif === "rapports" && (estPrincipal || peutFaire("consulterRapports")) && (
          <RapportsJournaliersManager
            employes={employes}
            evaluerRapport={evaluerRapport}
            peutEvaluer={estPrincipal || peutFaire("evaluerRapports")}
          />
        )}

        {ongletActif === "contestations" && (estPrincipal || peutFaire("resoudreContestations")) && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>
              Contestations ({contestationsOuvertes.length})
            </h3>
            {contestationsOuvertes.length === 0 && (
              <p style={{ fontSize: 14, color: "#5F5E5A" }}>Aucune contestation en attente.</p>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: 12,
              }}
            >
              {contestationsOuvertes.map((c) => (
                <ContestationCard
                  key={c.id}
                  contestation={c}
                  onResoudre={(reponse) => resoudreContestation(c.empId, c.id, reponse)}
                />
              ))}
            </div>
          </div>
        )}

        {ongletActif === "reconnaissance" && (
          <MurReconnaissance
            felicitations={felicitations}
            employes={employes}
            auteurId={null}
            auteurNom={
              monIdentite?.estPrincipal
                ? "La direction"
                : `${monIdentite?.prenom || ""} ${monIdentite?.nom || ""}`.trim() || "Manager"
            }
            moiId="manager"
            onPoster={posterFelicitation}
            onAimer={aimerFelicitation}
          />
        )}

        {ongletActif === "entretiens" && (
          <PanneauEntretiensManager
            employes={employes}
            lancerEntretien={lancerEntretien}
            soumettreEvaluationManager={soumettreEvaluationManager}
          />
        )}

        {ongletActif === "statistiques" && (
          <>
            <style>{STYLES_STATS}</style>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <IllustrationCroissance />
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Statistiques & évolution</h3>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "#5F5E5A" }}>
                  Basé sur les points réellement enregistrés dans le journal de chaque employé,
                  mois par mois sur {new Date().getFullYear()}.
                </p>
              </div>
            </div>

            {(blocages.total > 0 || tempsValidation !== null) && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 20,
                }}
              >
                {blocages.total > 0 && (
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 8px" }}>
                      Causes des retards ({blocages.total} tâche{blocages.total > 1 ? "s" : ""} concernée
                      {blocages.total > 1 ? "s" : ""})
                    </h4>
                    <Card style={{ display: "grid", gap: 10 }}>
                      {blocages.repartition.map((r) => (
                        <div key={r.cle}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                            <span>{r.label}</span>
                            <strong>
                              {r.pourcentage}% ({r.nb})
                            </strong>
                          </div>
                          <div style={{ height: 6, background: "#F1EFE8", borderRadius: 4, overflow: "hidden" }}>
                            <div
                              style={{
                                width: `${r.pourcentage}%`,
                                height: "100%",
                                background: r.cle === "validation_manager" ? "#D97706" : "#1877F2",
                                borderRadius: 4,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </Card>
                  </div>
                )}

                {tempsValidation !== null && (
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 8px" }}>
                      Temps moyen de validation
                    </h4>
                    <Card>
                      <p style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>
                        {tempsValidation < 24
                          ? `${Math.round(tempsValidation)} h`
                          : `${(tempsValidation / 24).toFixed(1)} j`}
                      </p>
                      <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#5F5E5A" }}>
                        Délai moyen, à l'échelle de l'entreprise, entre le moment où une tâche est
                        déclarée accomplie et sa validation. Pas encore ventilé par
                        administrateur.
                      </p>
                    </Card>
                  </div>
                )}
              </div>
            )}

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <h4 style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>
                  Vue d'ensemble de l'entreprise
                </h4>
                <Badge tone={libelleTendance(statsAnnee.penteTotal).tone}>
                  {libelleTendance(statsAnnee.penteTotal).texte}
                </Badge>
              </div>
              <Card>
                <GraphiqueEvolution
                  points={statsAnnee.total}
                  moisNoms={statsAnnee.moisNoms}
                  moisCourant={statsAnnee.moisCourant}
                  couleur="#1877F2"
                  hauteur={160}
                />
              </Card>
            </div>

            {statsAnnee.parDept.length > 1 && (
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 8px" }}>
                  Comparaison par département
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 12,
                  }}
                >
                  {statsAnnee.parDept.map((d, i) => (
                    <Card key={d.dept}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{d.dept}</p>
                        <Badge tone={libelleTendance(d.pente).tone}>
                          {libelleTendance(d.pente).texte}
                        </Badge>
                      </div>
                      <GraphiqueEvolution
                        points={d.points}
                        moisNoms={statsAnnee.moisNoms}
                        moisCourant={statsAnnee.moisCourant}
                        couleur={PALETTE_DEPARTEMENTS[i % PALETTE_DEPARTEMENTS.length]}
                        hauteur={90}
                      />
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <h4 style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>Évolution d'un employé</h4>
                <select
                  value={empStatChoisi}
                  onChange={(e) => setEmpStatChoisi(Number(e.target.value))}
                  style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #E5E3DA", fontSize: 13 }}
                >
                  {employes.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nom}
                    </option>
                  ))}
                </select>
              </div>
              {statsAnnee.parEmploye
                .filter((e) => e.id === empStatChoisi)
                .map((empData) => (
                  <Card key={empData.id}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <Avatar initiales={empData.initiales} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14 }}>{empData.nom}</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>{empData.dept}</p>
                      </div>
                      <Badge tone={libelleTendance(empData.pente).tone}>
                        {libelleTendance(empData.pente).texte}
                      </Badge>
                    </div>
                    <GraphiqueEvolution
                      points={empData.points}
                      moisNoms={statsAnnee.moisNoms}
                      moisCourant={statsAnnee.moisCourant}
                      couleur="#7C3AED"
                      hauteur={130}
                    />
                  </Card>
                ))}
            </div>
          </>
        )}

        {ongletActif === "assistant" && (
          <PanneauAssistant employes={employes} criteres={criteres} />
        )}

        {ongletActif === "archives" && (
          <PanneauArchives employes={employes} heureArrivee={heureArrivee} />
        )}

        {ongletActif === "compte" && (
          <>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>
                Informations de l'entreprise
              </h3>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
                Connecté en tant que{" "}
                <strong>
                  {monIdentite?.estPrincipal
                    ? "Administrateur principal"
                    : `${monIdentite?.prenom || ""} ${monIdentite?.nom || ""}`.trim() || "Administrateur"}
                </strong>
                {monIdentite && !monIdentite.estPrincipal && monIdentite.poste ? ` — ${monIdentite.poste}` : ""}.
              </p>
              <Card style={{ display: "grid", gap: 14 }}>
                <label style={{ fontSize: 13, color: "#5F5E5A" }}>
                  Nom de l'entreprise
                  <input
                    type="text"
                    placeholder="Ex : Clever Entreprises"
                    value={nomEntreprise}
                    onChange={(e) => setNomEntreprise(e.target.value)}
                    disabled={!estPrincipal}
                    style={{
                      display: "block",
                      marginTop: 4,
                      width: "100%",
                      maxWidth: 380,
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #E5E3DA",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                  />
                </label>
                <label style={{ fontSize: 13, color: "#5F5E5A" }}>
                  Adresse
                  <input
                    type="text"
                    placeholder="Ex : Cocody Riviera Faya, Abidjan"
                    value={adresseEntreprise}
                    onChange={(e) => setAdresseEntreprise(e.target.value)}
                    disabled={!estPrincipal}
                    style={{
                      display: "block",
                      marginTop: 4,
                      width: "100%",
                      maxWidth: 380,
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #E5E3DA",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                  />
                </label>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: 13, color: "#5F5E5A" }}>
                    Email de connexion
                  </p>
                  <p style={{ margin: 0, fontSize: 14 }}>{session?.email}</p>
                </div>
              </Card>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 20,
                alignItems: "start",
              }}
            >
              <ChangerMotDePasseCarte onChanger={majMonMotDePasse} />

              {codeEntreprise && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>
                    Code entreprise
                  </h3>
                  <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
                    À transmettre à vos employés.
                  </p>
                  <Card style={{ background: "#E7F0FE", border: "1px solid #C7DBFB" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 13, color: "#0F4FA8" }}>
                      Code entreprise à transmettre à vos employés
                    </p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#0F4FA8", letterSpacing: 1 }}>
                      {codeEntreprise}
                    </p>
                    <p style={{ margin: "6px 0 0", fontSize: 12, color: "#0F4FA8" }}>
                      Vos employés doivent saisir ce code lors de la création de leur compte.
                    </p>
                  </Card>
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 20,
                alignItems: "start",
              }}
            >
              {(estPrincipal || peutFaire("configurerCriteres")) && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>
                    Critères de notation
                  </h3>
                  <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
                    Ajustez la pondération des 14 critères qui composent le score.
                  </p>
                  <Bouton variant="secondary" onClick={() => setAfficherCriteres(true)}>
                    ⚙ Configurer les critères de notation
                  </Bouton>
                </div>
              )}

              {estPrincipal && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>
                    Horaires de travail attendus
                  </h3>
                  <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
                    Sert à déterminer automatiquement les retards et départs anticipés.
                  </p>
                  <Card style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                    <label style={{ fontSize: 13, color: "#5F5E5A" }}>
                      Arrivée attendue
                      <input
                        type="time"
                        value={heureArrivee}
                        onChange={(e) => majHeureArrivee(e.target.value)}
                        style={{
                          display: "block",
                          marginTop: 4,
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid #E5E3DA",
                          fontSize: 14,
                        }}
                      />
                    </label>
                    <label style={{ fontSize: 13, color: "#5F5E5A" }}>
                      Départ attendu
                      <input
                        type="time"
                        value={heureDepart}
                        onChange={(e) => majHeureDepart(e.target.value)}
                        style={{
                          display: "block",
                          marginTop: 4,
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid #E5E3DA",
                          fontSize: 14,
                        }}
                      />
                    </label>
                  </Card>
                </div>
              )}
            </div>

            {estPrincipal && sites.length > 1 && (
              <ConfigurationBureauxMultiples
                sites={sites}
                bureaux={bureaux}
                onDefinir={definirBureauSiteSurPositionActuelle}
                onMajRayon={majRayonBureauSite}
                onRetirer={retirerBureauSite}
              />
            )}

            {estPrincipal && sites.length <= 1 && (
              <ConfigurationBureau
                bureau={bureau}
                definirBureauSurPositionActuelle={definirBureauSurPositionActuelle}
                majRayonBureau={majRayonBureau}
                retirerBureau={retirerBureau}
              />
            )}

            {estPrincipal && (
              <GestionAdministrateurs
                administrateurs={administrateurs}
                codeEntreprise={codeEntreprise}
                onAjouter={ajouterAdministrateur}
                onRetirer={retirerAdministrateur}
              />
            )}

            {estPrincipal && (
              <GestionSieges
                sites={sites}
                onAjouter={ajouterSiteEntreprise}
                onRenommer={renommerSiteEntreprise}
                onSupprimer={supprimerSiteEntreprise}
              />
            )}

            {estPrincipal && (
              <JournalActiviteVue journalActivite={journalActivite} />
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
}

// Partagé entre la vue manager et la vue employé : un mur public où
// n'importe qui (manager ou employé) félicite nommément un employé.
// Toujours signé, jamais anonyme — à l'inverse de la notation entre
// pairs — et ça ne rentre jamais dans aucun calcul de score.
function PanneauAssistant({ employes, criteres }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const suggestions = [
    "Qui a le score le plus bas ce mois-ci ?",
    "Résume la situation de mon équipe en 3 phrases",
    "Qui a le plus de tâches en attente de ma validation ?",
    "Y a-t-il des retards ou absences non justifiés à surveiller ?",
  ];

  const envoyer = async (texte) => {
    const q = (texte || question).trim();
    if (!q || enCours) return;
    setMessages((prev) => [...prev, { role: "user", texte: q }]);
    setQuestion("");
    setErreur("");
    setEnCours(true);
    try {
      const contexte = construireContexteAssistant(employes, criteres);
      const reponse = await poserQuestionAssistant(q, contexte);
      setMessages((prev) => [...prev, { role: "assistant", texte: reponse }]);
    } catch (e) {
      setErreur(
        e.message === "L'assistant n'a pas pu répondre."
          ? "L'assistant n'a pas pu répondre — vérifiez que la clé d'API est bien configurée."
          : e.message
      );
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>Assistant</h3>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "#5F5E5A" }}>
        Posez une question sur votre équipe — l'assistant répond uniquement à partir des vraies
        données de l'application, jamais d'invention.
      </p>

      {messages.length === 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => envoyer(s)}
              style={{
                border: "1px solid #E5E3DA",
                background: "#FAF9F5",
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 13,
                color: "#3A3936",
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              background: m.role === "user" ? "#1877F2" : "#FAF9F5",
              color: m.role === "user" ? "#fff" : "#20231F",
              borderRadius: 14,
              padding: "10px 14px",
              fontSize: 14,
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            {m.texte}
          </div>
        ))}
        {enCours && (
          <div style={{ fontSize: 13, color: "#5F5E5A" }}>L'assistant réfléchit...</div>
        )}
        {erreur && (
          <Alerte tone="accent">{erreur}</Alerte>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Posez votre question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && envoyer()}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #E5E3DA",
            fontSize: 14,
          }}
        />
        <Bouton variant="primary" onClick={() => envoyer()} disabled={!question.trim() || enCours}>
          Envoyer
        </Bouton>
      </div>
    </div>
  );
}

function CarteEntretienManager({ employe, entretien, soumettreEvaluationManager }) {
  const [pointsForts, setPointsForts] = useState("");
  const [axesAmelioration, setAxesAmelioration] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [noteGlobale, setNoteGlobale] = useState(3);
  const [planDeveloppement, setPlanDeveloppement] = useState("");

  const cloturer = () => {
    soumettreEvaluationManager(employe.id, entretien.id, {
      pointsForts: pointsForts.trim(),
      axesAmelioration: axesAmelioration.trim(),
      commentaire: commentaire.trim(),
      noteGlobale,
      planDeveloppement: planDeveloppement.trim(),
    });
  };

  return (
    <Card style={{ padding: "14px 16px", display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar initiales={employe.initiales} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{employe.nom}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>{entretien.periode}</p>
        </div>
        <Badge tone="accent">À évaluer</Badge>
      </div>

      <div style={{ background: "#FAF9F5", borderRadius: 8, padding: 12 }}>
        <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#5F5E5A" }}>
          Auto-évaluation de {employe.nom}
        </p>
        <p style={{ margin: "0 0 4px", fontSize: 13 }}>
          <strong>Points forts :</strong> {entretien.autoEvaluation?.pointsForts || "—"}
        </p>
        <p style={{ margin: "0 0 4px", fontSize: 13 }}>
          <strong>Axes d'amélioration :</strong> {entretien.autoEvaluation?.axesAmelioration || "—"}
        </p>
        {entretien.autoEvaluation?.commentaire && (
          <p style={{ margin: 0, fontSize: 13 }}>{entretien.autoEvaluation.commentaire}</p>
        )}
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#5F5E5A" }}>Votre évaluation</p>
        <textarea
          placeholder="Points forts observés"
          value={pointsForts}
          onChange={(e) => setPointsForts(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14, height: 50 }}
        />
        <textarea
          placeholder="Axes d'amélioration"
          value={axesAmelioration}
          onChange={(e) => setAxesAmelioration(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14, height: 50 }}
        />
        <textarea
          placeholder="Commentaire libre (optionnel)"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14, height: 50 }}
        />
        <textarea
          placeholder="Plan de développement pour la prochaine période"
          value={planDeveloppement}
          onChange={(e) => setPlanDeveloppement(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14, height: 50 }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ fontSize: 13, color: "#5F5E5A" }}>Note globale</label>
          <select
            value={noteGlobale}
            onChange={(e) => setNoteGlobale(Number(e.target.value))}
            style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14 }}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}/5
              </option>
            ))}
          </select>
        </div>
        <Bouton
          variant="primary"
          onClick={cloturer}
          disabled={!pointsForts.trim() || !axesAmelioration.trim()}
        >
          Clôturer l'entretien
        </Bouton>
      </div>
    </Card>
  );
}

function PanneauEntretiensManager({ employes, lancerEntretien, soumettreEvaluationManager }) {
  const [periodeParEmploye, setPeriodeParEmploye] = useState({});

  const enAttenteManager = employes.flatMap((e) =>
    (e.entretiens || [])
      .filter((ent) => ent.statut === "en_attente_manager")
      .map((ent) => ({ employe: e, entretien: ent }))
  );

  const historique = employes.flatMap((e) =>
    (e.entretiens || [])
      .filter((ent) => ent.statut !== "en_attente_manager")
      .map((ent) => ({ employe: e, entretien: ent }))
  );

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {enAttenteManager.length > 0 && (
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>
            À évaluer ({enAttenteManager.length})
          </h3>
          <div style={{ display: "grid", gap: 12 }}>
            {enAttenteManager.map(({ employe, entretien }) => (
              <CarteEntretienManager
                key={entretien.id}
                employe={employe}
                entretien={entretien}
                soumettreEvaluationManager={soumettreEvaluationManager}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>Lancer un entretien</h3>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
          L'employé recevra une demande d'auto-évaluation pour la période indiquée.
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {employes.map((e) => (
            <Card key={e.id} style={{ padding: "10px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar initiales={e.initiales} />
                <p style={{ flex: 1, margin: 0, fontSize: 14 }}>{e.nom}</p>
                <input
                  type="text"
                  placeholder="Ex : Semestre 2 2026"
                  value={periodeParEmploye[e.id] || ""}
                  onChange={(ev) =>
                    setPeriodeParEmploye((prev) => ({ ...prev, [e.id]: ev.target.value }))
                  }
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid #E5E3DA",
                    fontSize: 13,
                    width: 180,
                  }}
                />
                <Bouton
                  variant="secondary"
                  onClick={() => {
                    const periode = (periodeParEmploye[e.id] || "").trim();
                    if (!periode) return;
                    lancerEntretien(e.id, periode);
                    setPeriodeParEmploye((prev) => ({ ...prev, [e.id]: "" }));
                  }}
                  disabled={!(periodeParEmploye[e.id] || "").trim()}
                >
                  Lancer
                </Bouton>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {historique.length > 0 && (
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>Historique</h3>
          <div style={{ display: "grid", gap: 8 }}>
            {historique
              .slice()
              .sort((a, b) => new Date(b.entretien.dateCreation) - new Date(a.entretien.dateCreation))
              .map(({ employe, entretien }) => (
                <Card key={entretien.id} style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <Avatar initiales={employe.initiales} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 14 }}>{employe.nom}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>{entretien.periode}</p>
                    </div>
                    {entretien.statut === "termine" && <Badge tone="success">Terminé</Badge>}
                    {entretien.statut === "en_attente_auto_eval" && (
                      <Badge tone="warning">Attente auto-évaluation</Badge>
                    )}
                  </div>
                  {entretien.statut === "termine" && entretien.evaluationManager && (
                    <p style={{ margin: 0, fontSize: 13, color: "#5F5E5A" }}>
                      Note globale : {entretien.evaluationManager.noteGlobale}/5
                    </p>
                  )}
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CarteAutoEvaluation({ employe, entretien, soumettreAutoEvaluation }) {
  const [pointsForts, setPointsForts] = useState("");
  const [axesAmelioration, setAxesAmelioration] = useState("");
  const [commentaire, setCommentaire] = useState("");

  const soumettre = () => {
    soumettreAutoEvaluation(employe.id, entretien.id, {
      pointsForts: pointsForts.trim(),
      axesAmelioration: axesAmelioration.trim(),
      commentaire: commentaire.trim(),
    });
  };

  return (
    <Card style={{ padding: "14px 16px", display: "grid", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <p style={{ flex: 1, margin: 0, fontSize: 14, fontWeight: 500 }}>
          Entretien — {entretien.periode}
        </p>
        <Badge tone="warning">Votre auto-évaluation attendue</Badge>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "#5F5E5A" }}>
        Votre manager verra ces réponses avant de faire la sienne — soyez honnête, ça sert à vous
        deux.
      </p>
      <textarea
        placeholder="Vos points forts sur cette période"
        value={pointsForts}
        onChange={(e) => setPointsForts(e.target.value)}
        style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14, height: 60 }}
      />
      <textarea
        placeholder="Ce que vous aimeriez améliorer"
        value={axesAmelioration}
        onChange={(e) => setAxesAmelioration(e.target.value)}
        style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14, height: 60 }}
      />
      <textarea
        placeholder="Commentaire libre (optionnel)"
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14, height: 60 }}
      />
      <Bouton
        variant="primary"
        onClick={soumettre}
        disabled={!pointsForts.trim() || !axesAmelioration.trim()}
      >
        Envoyer mon auto-évaluation
      </Bouton>
    </Card>
  );
}

function PanneauEntretiensEmploye({ employe, soumettreAutoEvaluation }) {
  const entretiens = employe.entretiens || [];
  const enAttente = entretiens.filter((ent) => ent.statut === "en_attente_auto_eval");
  const autres = entretiens.filter((ent) => ent.statut !== "en_attente_auto_eval");

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {enAttente.length === 0 && autres.length === 0 && (
        <p style={{ fontSize: 13, color: "#5F5E5A" }}>
          Aucun entretien pour l'instant — votre manager en lancera un le moment venu.
        </p>
      )}

      {enAttente.map((ent) => (
        <CarteAutoEvaluation
          key={ent.id}
          employe={employe}
          entretien={ent}
          soumettreAutoEvaluation={soumettreAutoEvaluation}
        />
      ))}

      {autres.length > 0 && (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 12px" }}>Historique</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {autres
              .slice()
              .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
              .map((ent) => (
                <Card key={ent.id} style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <p style={{ flex: 1, margin: 0, fontSize: 14, fontWeight: 500 }}>
                      {ent.periode}
                    </p>
                    {ent.statut === "termine" && <Badge tone="success">Terminé</Badge>}
                    {ent.statut === "en_attente_manager" && (
                      <Badge tone="neutral">En attente de votre manager</Badge>
                    )}
                  </div>
                  {ent.autoEvaluation && (
                    <div style={{ marginBottom: ent.statut === "termine" ? 10 : 0 }}>
                      <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#5F5E5A" }}>
                        Votre auto-évaluation
                      </p>
                      <p style={{ margin: "0 0 2px", fontSize: 13 }}>
                        <strong>Points forts :</strong> {ent.autoEvaluation.pointsForts}
                      </p>
                      <p style={{ margin: 0, fontSize: 13 }}>
                        <strong>À améliorer :</strong> {ent.autoEvaluation.axesAmelioration}
                      </p>
                    </div>
                  )}
                  {ent.statut === "termine" && ent.evaluationManager && (
                    <div style={{ paddingTop: 10, borderTop: "1px solid #E5E3DA" }}>
                      <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#5F5E5A" }}>
                        Évaluation de votre manager — note {ent.evaluationManager.noteGlobale}/5
                      </p>
                      <p style={{ margin: "0 0 2px", fontSize: 13 }}>
                        <strong>Points forts :</strong> {ent.evaluationManager.pointsForts}
                      </p>
                      <p style={{ margin: "0 0 2px", fontSize: 13 }}>
                        <strong>À améliorer :</strong> {ent.evaluationManager.axesAmelioration}
                      </p>
                      {ent.evaluationManager.planDeveloppement && (
                        <p style={{ margin: 0, fontSize: 13 }}>
                          <strong>Plan de développement :</strong>{" "}
                          {ent.evaluationManager.planDeveloppement}
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MurReconnaissance({ felicitations, employes, auteurId, auteurNom, moiId, onPoster, onAimer }) {
  const [destinataireId, setDestinataireId] = useState("");
  const [message, setMessage] = useState("");

  const soumettre = () => {
    if (!destinataireId || !message.trim()) return;
    const dest = employes.find((e) => String(e.id) === String(destinataireId));
    onPoster({
      deId: auteurId,
      deNom: auteurNom,
      aId: destinataireId,
      aNom: dest ? dest.nom : "",
      message: message.trim(),
    });
    setDestinataireId("");
    setMessage("");
  };

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>Mur de reconnaissance</h3>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
        Un mot public pour dire merci ou féliciter un collègue — signé, visible par toute
        l'équipe, et sans aucun effet sur le score de personne.
      </p>
      <Card style={{ display: "grid", gap: 10, marginBottom: 16 }}>
        <select
          value={destinataireId}
          onChange={(e) => setDestinataireId(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14 }}
        >
          <option value="">Féliciter qui ?</option>
          {employes
            .filter((e) => String(e.id) !== String(auteurId))
            .map((e) => (
              <option key={e.id} value={e.id}>
                {e.nom} — {e.dept}
              </option>
            ))}
        </select>
        <textarea
          placeholder="Ex : Merci pour ton aide sur le dossier client hier, ça a fait toute la différence !"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14, height: 70 }}
        />
        <Bouton
          variant="primary"
          onClick={soumettre}
          disabled={!destinataireId || !message.trim()}
        >
          👏 Publier sur le mur
        </Bouton>
      </Card>

      <div style={{ display: "grid", gap: 8 }}>
        {felicitations.length === 0 && (
          <p style={{ fontSize: 13, color: "#5F5E5A" }}>
            Rien encore sur le mur — soyez le premier à féliciter quelqu'un.
          </p>
        )}
        {felicitations.map((f) => {
          const jAime = (f.likes || []).some((id) => String(id) === String(moiId));
          return (
            <Card key={f.id} style={{ padding: "12px 16px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, color: "#5F5E5A" }}>
                <strong style={{ color: "#20231F" }}>{f.deNom || "Manager"}</strong> a félicité{" "}
                <strong style={{ color: "#20231F" }}>{f.aNom}</strong>
                {" · "}
                {new Date(f.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
              </p>
              <p style={{ margin: "0 0 8px", fontSize: 14 }}>{f.message}</p>
              <button
                onClick={() => onAimer(f.id, moiId)}
                style={{
                  border: "none",
                  background: jAime ? "#FFF6DA" : "#F1EFE8",
                  color: jAime ? "#7A5B00" : "#5F5E5A",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                👏 {(f.likes || []).length}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ContestationCard({ contestation, onResoudre }) {
  const [reponse, setReponse] = useState("");
  return (
    <Card style={{ padding: "12px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p style={{ margin: 0, fontSize: 14 }}>{contestation.sujet}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
            {contestation.empNom} — {contestation.motif}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input
          type="text"
          placeholder="Votre réponse"
          value={reponse}
          onChange={(e) => setReponse(e.target.value)}
          style={{
            flex: 1,
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #E5E3DA",
            fontSize: 13,
          }}
        />
        <Bouton
          variant="primary"
          onClick={() => reponse.trim() && onResoudre(reponse.trim())}
          disabled={!reponse.trim()}
        >
          Répondre
        </Bouton>
      </div>
    </Card>
  );
}

function RapportJournalierEmploye({
  employe,
  ajouterLignePlanning,
  retirerLignePlanning,
  ajouterLigneRealise,
  retirerLigneRealise,
  majChampRapport,
  envoyerRapportDuJour,
}) {
  const rapport = rapportDuJour(employe) || rapportVide(dateJourISO());
  const [onglet, setOnglet] = useState("planning");
  const [heurePlan, setHeurePlan] = useState("");
  const [tachePlan, setTachePlan] = useState("");
  const [objectifPlan, setObjectifPlan] = useState("");
  const [prioritePlan, setPrioritePlan] = useState("Moyenne");
  const [heureRealise, setHeureRealise] = useState("");
  const [actionRealise, setActionRealise] = useState("");
  const [resultatRealise, setResultatRealise] = useState("");
  const [statutRealise, setStatutRealise] = useState("fait");
  const [envoiConfirme, setEnvoiConfirme] = useState(false);

  const dateAffichee = new Date(rapport.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const ajouterPlan = () => {
    if (!tachePlan.trim()) return;
    ajouterLignePlanning(employe.id, {
      heure: heurePlan.trim(),
      tache: tachePlan.trim(),
      objectif: objectifPlan.trim(),
      priorite: prioritePlan,
    });
    setHeurePlan("");
    setTachePlan("");
    setObjectifPlan("");
  };

  const ajouterFait = () => {
    if (!actionRealise.trim()) return;
    ajouterLigneRealise(employe.id, {
      heure: heureRealise.trim(),
      action: actionRealise.trim(),
      resultat: resultatRealise.trim(),
      statut: statutRealise,
    });
    setHeureRealise("");
    setActionRealise("");
    setResultatRealise("");
  };

  const onglets = [
    { id: "planning", label: "Planning", icone: <IconPlanning />, count: rapport.planning.length },
    { id: "realise", label: "Réalisé", icone: <IconRealise />, count: rapport.realise.length },
    { id: "bilan", label: "Bilan du jour", icone: <IconBilan />, count: 0 },
  ];

  return (
    <div className="rj-wrap">
      <style>{STYLES_RAPPORT}</style>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, margin: 0, textTransform: "capitalize" }}>
          Rapport du jour — {dateAffichee}
        </h3>
        {rapport.envoye && (
          <Badge tone="success">
            Envoyé à{" "}
            {new Date(rapport.envoyeLe).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Badge>
        )}
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
        Le matin, notez ce que vous prévoyez de faire. Le soir, complétez avec ce que vous avez
        réellement réalisé.
      </p>

      {rapport.evaluation && (
        <div
          style={{
            background: "#E7F0FE",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 13,
            marginBottom: 14,
          }}
        >
          <strong>Évaluation du manager : {rapport.evaluation.note}/5</strong>
          {rapport.evaluation.commentaire && (
            <p style={{ margin: "4px 0 0" }}>{rapport.evaluation.commentaire}</p>
          )}
        </div>
      )}

      <div className="rj-card">
        <div className="rj-tabs">
          {onglets.map((o) => (
            <button
              key={o.id}
              className={`rj-tab ${onglet === o.id ? "active" : ""}`}
              onClick={() => setOnglet(o.id)}
            >
              {o.icone}
              {o.label}
              {o.count > 0 && <span className="count">{o.count}</span>}
            </button>
          ))}
        </div>

        <div className="rj-panel">
          <div className="rj-panel-inner" key={onglet}>
            {onglet === "planning" && (
              <div>
                <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 500 }}>
                  Planning de la journée
                </p>
                <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                  {rapport.planning.length === 0 && (
                    <p className="rj-empty">Aucune tâche planifiée pour l'instant.</p>
                  )}
                  {rapport.planning.map((l) => (
                    <div key={l.id} className="rj-row">
                      <span className="rj-row-time">
                        <IconClock /> {l.heure || "—"}
                      </span>
                      <span style={{ flex: 1 }}>
                        {l.tache}
                        {l.objectif && <span style={{ color: "#5F5E5A" }}> — {l.objectif}</span>}
                      </span>
                      <Badge tone={l.priorite === "Haute" ? "warning" : "neutral"}>{l.priorite}</Badge>
                      {!rapport.envoye && (
                        <button
                          onClick={() => retirerLignePlanning(employe.id, l.id)}
                          style={{ border: "none", background: "none", color: "#993C1D", cursor: "pointer", fontSize: 12 }}
                        >
                          Retirer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {!rapport.envoye && (
                  <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 1fr auto", gap: 6 }}>
                    <input
                      type="time"
                      value={heurePlan}
                      onChange={(e) => setHeurePlan(e.target.value)}
                      style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 12 }}
                    />
                    <input
                      type="text"
                      placeholder="Tâche prévue"
                      value={tachePlan}
                      onChange={(e) => setTachePlan(e.target.value)}
                      style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 13 }}
                    />
                    <input
                      type="text"
                      placeholder="Objectif attendu"
                      value={objectifPlan}
                      onChange={(e) => setObjectifPlan(e.target.value)}
                      style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 13 }}
                    />
                    <select
                      value={prioritePlan}
                      onChange={(e) => setPrioritePlan(e.target.value)}
                      style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 12 }}
                    >
                      <option>Haute</option>
                      <option>Moyenne</option>
                      <option>Basse</option>
                    </select>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <Bouton onClick={ajouterPlan} disabled={!tachePlan.trim()}>
                        + Ajouter au planning
                      </Bouton>
                    </div>
                  </div>
                )}
              </div>
            )}

            {onglet === "realise" && (
              <div>
                <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 500 }}>
                  Ce que j'ai réalisé aujourd'hui
                </p>
                <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                  {rapport.realise.length === 0 && (
                    <p className="rj-empty">Rien de déclaré pour l'instant.</p>
                  )}
                  {rapport.realise.map((l) => (
                    <div key={l.id} className="rj-row">
                      <span className="rj-row-time">
                        <IconClock /> {l.heure || "—"}
                      </span>
                      <span style={{ flex: 1 }}>
                        {l.action}
                        {l.resultat && <span style={{ color: "#5F5E5A" }}> — {l.resultat}</span>}
                      </span>
                      <Badge tone={l.statut === "fait" ? "success" : "warning"}>
                        {l.statut === "fait" ? "Fait" : "À suivre"}
                      </Badge>
                      {!rapport.envoye && (
                        <button
                          onClick={() => retirerLigneRealise(employe.id, l.id)}
                          style={{ border: "none", background: "none", color: "#993C1D", cursor: "pointer", fontSize: 12 }}
                        >
                          Retirer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {!rapport.envoye && (
                  <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 1fr auto", gap: 6 }}>
                    <input
                      type="time"
                      value={heureRealise}
                      onChange={(e) => setHeureRealise(e.target.value)}
                      style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 12 }}
                    />
                    <input
                      type="text"
                      placeholder="Action réalisée"
                      value={actionRealise}
                      onChange={(e) => setActionRealise(e.target.value)}
                      style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 13 }}
                    />
                    <input
                      type="text"
                      placeholder="Résultat obtenu"
                      value={resultatRealise}
                      onChange={(e) => setResultatRealise(e.target.value)}
                      style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 13 }}
                    />
                    <select
                      value={statutRealise}
                      onChange={(e) => setStatutRealise(e.target.value)}
                      style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 12 }}
                    >
                      <option value="fait">Fait</option>
                      <option value="a_suivre">À suivre</option>
                    </select>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <Bouton onClick={ajouterFait} disabled={!actionRealise.trim()}>
                        + Ajouter au réalisé
                      </Bouton>
                    </div>
                  </div>
                )}
              </div>
            )}

            {onglet === "bilan" && (
              <div style={{ display: "grid", gap: 16 }}>
                <label style={{ fontSize: 13 }}>
                  Difficultés rencontrées
                  <textarea
                    disabled={rapport.envoye}
                    value={rapport.difficultes}
                    onChange={(e) => majChampRapport(employe.id, "difficultes", e.target.value)}
                    style={{
                      display: "block",
                      marginTop: 4,
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #E5E3DA",
                      fontSize: 13,
                      height: 70,
                      boxSizing: "border-box",
                    }}
                  />
                </label>

                <label style={{ fontSize: 13 }}>
                  Actions prioritaires prévues pour demain
                  <textarea
                    disabled={rapport.envoye}
                    value={rapport.actionsDemain}
                    onChange={(e) => majChampRapport(employe.id, "actionsDemain", e.target.value)}
                    style={{
                      display: "block",
                      marginTop: 4,
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #E5E3DA",
                      fontSize: 13,
                      height: 70,
                      boxSizing: "border-box",
                    }}
                  />
                </label>

                {!rapport.envoye && (
                  <Bouton
                    variant="primary"
                    onClick={() => {
                      envoyerRapportDuJour(employe.id);
                      setEnvoiConfirme(true);
                      setTimeout(() => setEnvoiConfirme(false), 3000);
                    }}
                  >
                    {envoiConfirme ? "✓ Rapport envoyé" : "Envoyer mon rapport du jour"}
                  </Bouton>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsInitiatives({ initiatives }) {
  const liste = initiatives || [];
  const validees = liste.filter((i) => i.statut === "validee").length;
  const rejetees = liste.filter((i) => i.statut === "rejetee").length;
  const enAttente = liste.filter((i) => i.statut === "en_attente").length;
  const total = liste.length;
  const traitees = validees + rejetees;
  const taux = traitees > 0 ? Math.round((validees / traitees) * 100) : null;

  const STATS = [
    { label: "Proposées", valeur: total },
    { label: "Validées", valeur: validees, couleur: "#16A34A" },
    { label: "Refusées", valeur: rejetees, couleur: "#E11D48" },
    { label: "En attente", valeur: enAttente, couleur: "#D97706" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        gap: 8,
        marginBottom: 14,
      }}
    >
      {STATS.map((s) => (
        <Card key={s.label} style={{ padding: "10px 12px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: s.couleur || "#2C2C2A" }}>
            {s.valeur}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "#5F5E5A" }}>{s.label}</p>
        </Card>
      ))}
      {taux !== null && (
        <Card style={{ padding: "10px 12px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{taux}%</p>
          <p style={{ margin: 0, fontSize: 11, color: "#5F5E5A" }}>Taux d'acceptation</p>
        </Card>
      )}
    </div>
  );
}

function SectionInitiativesEmploye({ employe, soumettreInitiative }) {
  const [titre, setTitre] = useState("");
  const [probleme, setProbleme] = useState("");
  const [solution, setSolution] = useState("");
  const [afficherForm, setAfficherForm] = useState(false);

  const initiatives = [...(employe.initiatives || [])].reverse();

  const soumettre = () => {
    if (!titre.trim() || !solution.trim()) return;
    soumettreInitiative(employe.id, {
      titre: titre.trim(),
      probleme: probleme.trim(),
      solution: solution.trim(),
    });
    setTitre("");
    setProbleme("");
    setSolution("");
    setAfficherForm(false);
  };

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>Mes initiatives</h3>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
        Repéré un problème et une solution ? Proposez-la à votre manager — seules les initiatives
        validées comptent dans votre score de proactivité.
      </p>

      <StatsInitiatives initiatives={employe.initiatives} />

      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        {initiatives.length === 0 && (
          <p style={{ fontSize: 13, color: "#5F5E5A" }}>Aucune initiative proposée pour l'instant.</p>
        )}
        {initiatives.map((i) => (
          <Card key={i.id} style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{i.titre}</p>
              {i.statut === "en_attente" && <Badge tone="warning">En attente</Badge>}
              {i.statut === "validee" && <Badge tone="success">Validée (+10 pts)</Badge>}
              {i.statut === "rejetee" && <Badge tone="neutral">Non retenue</Badge>}
            </div>
            {i.probleme && (
              <p style={{ margin: "0 0 4px", fontSize: 13, color: "#5F5E5A" }}>
                <strong>Problème :</strong> {i.probleme}
              </p>
            )}
            <p style={{ margin: 0, fontSize: 13, color: "#5F5E5A" }}>
              <strong>Solution :</strong> {i.solution}
            </p>
            {i.commentaireManager && (
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#1877F2" }}>
                Commentaire du manager : {i.commentaireManager}
              </p>
            )}
          </Card>
        ))}
      </div>

      {!afficherForm ? (
        <Bouton variant="secondary" onClick={() => setAfficherForm(true)}>
          + Proposer une initiative
        </Bouton>
      ) : (
        <Card style={{ display: "grid", gap: 10 }}>
          <input
            type="text"
            placeholder="Titre court de l'initiative"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14 }}
          />
          <textarea
            placeholder="Problème identifié (facultatif)"
            value={probleme}
            onChange={(e) => setProbleme(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14, height: 60 }}
          />
          <textarea
            placeholder="Solution proposée"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14, height: 60 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <Bouton variant="primary" onClick={soumettre} disabled={!titre.trim() || !solution.trim()}>
              Envoyer au manager
            </Bouton>
            <Bouton variant="secondary" onClick={() => setAfficherForm(false)}>
              Annuler
            </Bouton>
          </div>
        </Card>
      )}
    </div>
  );
}

function SectionAbsencesEmploye({ employe, declarerAbsence }) {
  const [date, setDate] = useState("");
  const [motif, setMotif] = useState(MOTIFS_ABSENCE[0]);
  const [commentaire, setCommentaire] = useState("");
  const [afficherForm, setAfficherForm] = useState(false);

  const absences = [...(employe.absences || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  const soumettre = () => {
    if (!date) return;
    declarerAbsence(employe.id, { date, motif, commentaire: commentaire.trim() });
    setDate("");
    setCommentaire("");
    setAfficherForm(false);
  };

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>Mes absences</h3>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
        Prévenez votre manager d'une absence (passée ou à venir), avec un motif — il pourra la
        valider ou la refuser.
      </p>

      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        {absences.length === 0 && (
          <p style={{ fontSize: 13, color: "#5F5E5A" }}>Aucune absence déclarée pour l'instant.</p>
        )}
        {absences.map((a) => (
          <Card key={a.id} style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
                {new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              {a.statut === "en_attente" && <Badge tone="warning">En attente</Badge>}
              {a.statut === "validee" && <Badge tone="success">Validée</Badge>}
              {a.statut === "refusee" && <Badge tone="neutral">Refusée</Badge>}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#5F5E5A" }}>
              <strong>Motif :</strong> {a.motif}
            </p>
            {a.commentaire && (
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#5F5E5A" }}>{a.commentaire}</p>
            )}
          </Card>
        ))}
      </div>

      {!afficherForm ? (
        <Bouton variant="secondary" onClick={() => setAfficherForm(true)}>
          + Déclarer une absence
        </Bouton>
      ) : (
        <Card style={{ display: "grid", gap: 10 }}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14 }}
          />
          <select
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14 }}
          >
            {MOTIFS_ABSENCE.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Détail (optionnel)"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 14, height: 60 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <Bouton variant="primary" onClick={soumettre} disabled={!date}>
              Envoyer au manager
            </Bouton>
            <Bouton variant="secondary" onClick={() => setAfficherForm(false)}>
              Annuler
            </Bouton>
          </div>
        </Card>
      )}
    </div>
  );
}

function VueEmploye({
  employe,
  pointer,
  pointerDepart,
  pointerEnMission,
  signalerBlocage,
  declarer,
  majBilan,
  validerBilan,
  noterCollegue,
  autres,
  criteres,
  contester,
  ajouterLignePlanning,
  retirerLignePlanning,
  ajouterLigneRealise,
  retirerLigneRealise,
  majChampRapport,
  envoyerRapportDuJour,
  majMonMotDePasse,
  soumettreInitiative,
  heureArrivee,
  justifierRetard,
  declarerAbsence,
  felicitations,
  posterFelicitation,
  aimerFelicitation,
  soumettreAutoEvaluation,
}) {
  const { score, detail } = calculerScore(employe, criteres);
  const [sujetContestation, setSujetContestation] = useState("");
  const [bilanValide, setBilanValide] = useState(false);
  const [motifContestation, setMotifContestation] = useState("");
  const [ongletActif, setOngletActif] = useState("apercu");
  const [pointageEnCours, setPointageEnCours] = useState(false);
  const [erreurPointage, setErreurPointage] = useState("");
  const [afficherFormMission, setAfficherFormMission] = useState(false);
  const [lieuMission, setLieuMission] = useState("");
  const [justificationMission, setJustificationMission] = useState("");
  const [missionEnCours, setMissionEnCours] = useState(false);
  const [positionMission, setPositionMission] = useState(null);
  const [captureEnCours, setCaptureEnCours] = useState(false);
  const [erreurCapture, setErreurCapture] = useState("");

  const pointageAujourdhui = pointageDuJour(employe);
  const enRetardAujourdhui = !!(
    pointageAujourdhui?.arrivee &&
    !pointageAujourdhui?.enMission &&
    heureArrivee &&
    pointageAujourdhui.arrivee > heureArrivee
  );
  const [texteJustificationRetard, setTexteJustificationRetard] = useState("");

  const gererPointage = async () => {
    setErreurPointage("");
    setPointageEnCours(true);
    const resultat = await pointer(employe.id);
    if (resultat && !resultat.ok) {
      setErreurPointage(resultat.message || "Impossible de pointer pour le moment.");
    }
    setPointageEnCours(false);
  };

  const activerPositionMission = async () => {
    setErreurCapture("");
    setCaptureEnCours(true);
    try {
      const position = await obtenirPosition();
      setPositionMission({ lat: position.coords.latitude, lng: position.coords.longitude });
    } catch (err) {
      setErreurCapture(
        err && err.code === 1
          ? "Vous devez autoriser la localisation pour confirmer votre présence."
          : "Impossible d'obtenir votre position. Vérifiez que le GPS est activé et réessayez."
      );
    }
    setCaptureEnCours(false);
  };

  const gererPointageMission = async () => {
    if (!lieuMission.trim() || !justificationMission.trim() || !positionMission) return;
    setMissionEnCours(true);
    await pointerEnMission(employe.id, {
      lieu: lieuMission.trim(),
      justification: justificationMission.trim(),
      coordsMission: positionMission,
    });
    setLieuMission("");
    setJustificationMission("");
    setPositionMission(null);
    setAfficherFormMission(false);
    setMissionEnCours(false);
  };

  const soumettreContestation = () => {
    if (!sujetContestation.trim() || !motifContestation.trim()) return;
    contester(employe.id, sujetContestation.trim(), motifContestation.trim());
    setSujetContestation("");
    setMotifContestation("");
  };

  const tachesAFaire = employe.taches.filter((t) => t.statut === "a_faire").length;

  const statsAnnee = useMemo(() => calculerStatsAnnee([employe, ...autres]), [employe, autres]);
  const palmares = useMemo(() => calculerPalmares(statsAnnee), [statsAnnee]);

  const onglets = [
    { id: "apercu", label: "Aperçu", icone: <IconHome />, count: 0 },
    { id: "rapport", label: "Rapport du jour", icone: <IconCalendar />, count: 0 },
    { id: "taches", label: "Mes tâches", icone: <IconClipboard />, count: tachesAFaire },
    { id: "bilan", label: "Bilan", icone: <IconRealise />, count: 0 },
    { id: "collegues", label: "Collègues", icone: <IconPeople />, count: 0 },
    { id: "reconnaissance", label: "Reconnaissance", icone: <span style={{ fontSize: 16 }}>👏</span>, count: 0 },
    {
      id: "entretien",
      label: "Entretien",
      icone: <span style={{ fontSize: 16 }}>🗣️</span>,
      count: (employe.entretiens || []).filter((ent) => ent.statut === "en_attente_auto_eval").length,
    },
    { id: "contester", label: "Contester", icone: <IconAlertTriangle />, count: 0 },
    { id: "profil", label: "Mon profil", icone: <IconTrendUp />, count: 0 },
  ];

  return (
    <div className="nav-shell">
      <style>{STYLES_NAV}</style>
      <OngletsNav onglets={onglets} actif={ongletActif} onChange={setOngletActif} />

      <div className="nav-content">
      <div className="nav-panel-inner" key={ongletActif} style={{ display: "grid", gap: 20 }}>
        {ongletActif === "apercu" && (
          <>
            {!pointageAujourdhui?.arrivee && (
              <Alerte>Vous n'avez pas encore pointé votre arrivée aujourd'hui.</Alerte>
            )}
            {tachesAFaire > 0 && (
              <Alerte tone="accent">
                {tachesAFaire} tâche{tachesAFaire > 1 ? "s" : ""} en attente de déclaration.
              </Alerte>
            )}

            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 14, color: "#5F5E5A" }}>Mon score actuel</p>
                  <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 500 }}>
                    <NombreAnime cible={score} />
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  {pointageAujourdhui?.arrivee && pointageAujourdhui?.enMission && (
                    <Badge tone="accent">En mission — arrivée à {pointageAujourdhui.arrivee}</Badge>
                  )}
                  {pointageAujourdhui?.arrivee && !pointageAujourdhui?.enMission && (
                    <Badge tone={enRetardAujourdhui ? "warning" : "success"}>
                      Arrivée à {pointageAujourdhui.arrivee}
                      {enRetardAujourdhui ? " (retard)" : ""}
                    </Badge>
                  )}
                  {pointageAujourdhui?.depart && (
                    <Badge tone="neutral">Départ à {pointageAujourdhui.depart}</Badge>
                  )}
                  {!pointageAujourdhui?.arrivee && (
                    <Bouton variant="success" onClick={gererPointage} disabled={pointageEnCours}>
                      {pointageEnCours ? "Localisation..." : "Pointer mon arrivée"}
                    </Bouton>
                  )}
                  {!pointageAujourdhui?.arrivee && (
                    <span
                      onClick={() => setAfficherFormMission(!afficherFormMission)}
                      style={{ fontSize: 13, color: "#1877F2", cursor: "pointer" }}
                    >
                      Je suis en mission
                    </span>
                  )}
                  {pointageAujourdhui?.arrivee && !pointageAujourdhui?.depart && (
                    <Bouton variant="secondary" onClick={() => pointerDepart(employe.id)}>
                      Pointer mon départ
                    </Bouton>
                  )}
                </div>
              </div>
              {erreurPointage && (
                <p style={{ margin: "10px 0 0", fontSize: 13, color: "#993C1D" }}>
                  {erreurPointage}
                </p>
              )}
              {pointageAujourdhui?.enMission && (
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid #E5E3DA",
                    fontSize: 13,
                    color: "#5F5E5A",
                  }}
                >
                  <p style={{ margin: "0 0 4px" }}>
                    <strong>Lieu :</strong> {pointageAujourdhui.lieuMission}
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Justification :</strong> {pointageAujourdhui.justificationMission}
                  </p>
                </div>
              )}
              {enRetardAujourdhui && !pointageAujourdhui?.justificationRetard && (
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid #E5E3DA",
                  }}
                >
                  <p style={{ margin: "0 0 6px", fontSize: 12, color: "#993C1D" }}>
                    🔴 Vous êtes arrivé après l'heure attendue. Voulez-vous expliquer ce retard ?
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Raison du retard"
                      value={texteJustificationRetard}
                      onChange={(e) => setTexteJustificationRetard(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #E5E3DA",
                        fontSize: 13,
                      }}
                    />
                    <Bouton
                      onClick={() => {
                        if (!texteJustificationRetard.trim()) return;
                        justifierRetard(employe.id, texteJustificationRetard.trim());
                        setTexteJustificationRetard("");
                      }}
                      disabled={!texteJustificationRetard.trim()}
                    >
                      Envoyer
                    </Bouton>
                  </div>
                </div>
              )}
              {enRetardAujourdhui && pointageAujourdhui?.justificationRetard && (
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid #E5E3DA",
                    fontSize: 13,
                  }}
                >
                  <p style={{ margin: "0 0 4px", color: "#5F5E5A" }}>
                    <strong>Votre explication :</strong> {pointageAujourdhui.justificationRetard}
                  </p>
                  {pointageAujourdhui.statutRetard === "acceptee" && (
                    <Badge tone="success">Retard justifié</Badge>
                  )}
                  {pointageAujourdhui.statutRetard === "refusee" && (
                    <Badge tone="warning">Retard non justifié</Badge>
                  )}
                  {(!pointageAujourdhui.statutRetard || pointageAujourdhui.statutRetard === "en_attente") && (
                    <Badge tone="neutral">En attente de réponse du manager</Badge>
                  )}
                </div>
              )}
              {afficherFormMission && !pointageAujourdhui?.arrivee && (
                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: "1px solid #E5E3DA",
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 13, color: "#5F5E5A" }}>
                    Vous êtes en déplacement pour le compte de l'entreprise ? Indiquez où vous êtes
                    et pourquoi, puis activez votre position pour confirmer que vous vous trouvez
                    bien à cet endroit.
                  </p>
                  <input
                    type="text"
                    placeholder="Lieu où vous vous trouvez (ex : chez le client X, Yopougon)"
                    value={lieuMission}
                    onChange={(e) => setLieuMission(e.target.value)}
                    style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 13 }}
                  />
                  <textarea
                    placeholder="Justification de votre présence à cet endroit pendant les heures de travail"
                    value={justificationMission}
                    onChange={(e) => setJustificationMission(e.target.value)}
                    style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #E5E3DA", fontSize: 13, height: 60 }}
                  />

                  <div>
                    {positionMission ? (
                      <Badge tone="success">✓ Position activée et confirmée</Badge>
                    ) : (
                      <Bouton variant="secondary" onClick={activerPositionMission} disabled={captureEnCours}>
                        {captureEnCours ? "Localisation..." : "📍 Activer ma position"}
                      </Bouton>
                    )}
                    {erreurCapture && (
                      <p style={{ margin: "8px 0 0", fontSize: 12, color: "#993C1D" }}>{erreurCapture}</p>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <Bouton
                      variant="primary"
                      onClick={gererPointageMission}
                      disabled={
                        missionEnCours || !lieuMission.trim() || !justificationMission.trim() || !positionMission
                      }
                    >
                      {missionEnCours ? "Enregistrement..." : "Confirmer ma présence en mission"}
                    </Bouton>
                    <Bouton
                      variant="secondary"
                      onClick={() => {
                        setAfficherFormMission(false);
                        setPositionMission(null);
                        setErreurCapture("");
                      }}
                    >
                      Annuler
                    </Bouton>
                  </div>
                  {!positionMission && (
                    <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
                      La position doit être activée avant de pouvoir confirmer.
                    </p>
                  )}
                </div>
              )}
            </Card>

            {(employe.objectifs || []).length > 0 && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 12px" }}>Mes objectifs</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {employe.objectifs.map((o) => {
                    const statut = statutObjectif(o, employe.taches);
                    return (
                      <Card key={o.id} style={{ padding: "10px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 14 }}>{o.titre}</p>
                            {o.echeance && (
                              <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
                                Échéance {new Date(o.echeance).toLocaleDateString("fr-FR")}
                              </p>
                            )}
                          </div>
                          {statut === "atteint" && <Badge tone="success">Atteint</Badge>}
                          {statut === "non_atteint" && <Badge tone="warning">Non atteint</Badge>}
                          {statut === "en_cours" && <Badge tone="neutral">En cours</Badge>}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {(employe.journalPoints || []).length > 0 && (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 12px" }}>
                  Journal des points ({(employe.journalPoints || []).reduce((s, p) => s + p.points, 0)}{" "}
                  pts ce mois-ci)
                </h3>
                <div style={{ display: "grid", gap: 6 }}>
                  {[...employe.journalPoints].reverse().map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 14px",
                        background: "#fff",
                        border: "1px solid #E5E3DA",
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    >
                      <span>{p.libelle}</span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: p.points >= 0 ? "#0F6E56" : "#993C1D",
                        }}
                      >
                        {p.points >= 0 ? "+" : ""}
                        {p.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <details>
              <summary style={{ fontSize: 13, color: "#5F5E5A", cursor: "pointer" }}>
                Voir le détail des 14 critères
              </summary>
              <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
                {detail.map((c) => (
                  <div
                    key={c.key}
                    style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}
                  >
                    <span style={{ color: "#5F5E5A" }}>
                      {c.label} ({c.poids}%)
                    </span>
                    <span>{c.valeur}/100</span>
                  </div>
                ))}
              </div>
            </details>
          </>
        )}

        {ongletActif === "rapport" && (
          <RapportJournalierEmploye
            employe={employe}
            ajouterLignePlanning={ajouterLignePlanning}
            retirerLignePlanning={retirerLignePlanning}
            ajouterLigneRealise={ajouterLigneRealise}
            retirerLigneRealise={retirerLigneRealise}
            majChampRapport={majChampRapport}
            envoyerRapportDuJour={envoyerRapportDuJour}
          />
        )}

        {ongletActif === "taches" && (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 12px" }}>Mes tâches</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {employe.taches.map((t) => {
                const enRetard = t.statut !== "validee" && t.echeance && new Date(t.echeance) < new Date();
                return (
                  <Card key={t.id} style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14 }}>{t.titre}</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
                          {t.statut === "a_faire" && "À faire"}
                          {t.statut === "en_attente" && "En attente de validation manager"}
                          {t.statut === "validee" && "Validée"}
                          {t.echeance &&
                            ` · Échéance ${new Date(t.echeance).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })}`}
                        </p>
                        {t.commentaireManager && (
                          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#1877F2" }}>
                            Commentaire du manager : {t.commentaireManager}
                          </p>
                        )}
                      </div>
                      {t.priorite && (
                        <Badge tone={t.priorite === "Urgent" ? "warning" : "neutral"}>
                          {t.priorite}
                        </Badge>
                      )}
                      {t.statut === "a_faire" && (
                        <Bouton onClick={() => declarer(employe.id, t.id)}>Déclarer accomplie</Bouton>
                      )}
                      {t.statut === "en_attente" && <Badge tone="warning">En attente</Badge>}
                      {t.statut === "validee" && <Badge tone="success">Validée</Badge>}
                    </div>
                    {enRetard && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #E5E3DA" }}>
                        <p style={{ margin: "0 0 6px", fontSize: 12, color: "#993C1D" }}>
                          🔴 Cette tâche est en retard. Pourquoi ?
                        </p>
                        <select
                          value={t.blocage || ""}
                          onChange={(e) => signalerBlocage(employe.id, t.id, e.target.value)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "1px solid #E5E3DA",
                            fontSize: 12,
                            width: "100%",
                          }}
                        >
                          <option value="">Sélectionnez une raison...</option>
                          {MOTIFS_BLOCAGE.map((m) => (
                            <option key={m.cle} value={m.cle}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {ongletActif === "bilan" && (
          <div style={{ display: "grid", gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 12px" }}>Bilan hebdomadaire</h3>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
                Vos retards sont désormais calculés automatiquement à partir de votre vrai pointage
                (visible dans Aperçu), plus besoin de les déclarer ici.
              </p>
              <Card style={{ display: "grid", gap: 14 }}>
                <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={employe.equipe}
                    onChange={(e) => majBilan(employe.id, "equipe", e.target.checked)}
                  />
                  J'ai travaillé en équipe cette semaine
                </label>
                <Bouton
                  variant="primary"
                  onClick={() => {
                    validerBilan(employe.id);
                    setBilanValide(true);
                    setTimeout(() => setBilanValide(false), 3000);
                  }}
                >
                  {bilanValide ? "✓ Points enregistrés" : "Valider mon bilan"}
                </Bouton>
              </Card>
            </div>

            <SectionInitiativesEmploye employe={employe} soumettreInitiative={soumettreInitiative} />

            <SectionAbsencesEmploye employe={employe} declarerAbsence={declarerAbsence} />
          </div>
        )}

        {ongletActif === "collegues" && (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 12px" }}>
              Noter un collègue (anonyme)
            </h3>
            <div style={{ display: "grid", gap: 8 }}>
              {autres.map((c) => (
                <Card key={c.id} style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar initiales={c.initiales} />
                    <p style={{ flex: 1, margin: 0, fontSize: 14 }}>{c.nom}</p>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => noterCollegue(c.id, n)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 6,
                          border: "1px solid #E5E3DA",
                          background: "#fff",
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {ongletActif === "reconnaissance" && (
          <MurReconnaissance
            felicitations={felicitations}
            employes={autres}
            auteurId={employe.id}
            auteurNom={employe.nom}
            moiId={employe.id}
            onPoster={posterFelicitation}
            onAimer={aimerFelicitation}
          />
        )}

        {ongletActif === "entretien" && (
          <PanneauEntretiensEmploye
            employe={employe}
            soumettreAutoEvaluation={soumettreAutoEvaluation}
          />
        )}

        {ongletActif === "contester" && (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 12px" }}>
              Contester un résultat
            </h3>
            {(employe.contestations || []).length > 0 && (
              <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
                {employe.contestations.map((c) => (
                  <Card key={c.id} style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <p style={{ margin: 0, fontSize: 14 }}>{c.sujet}</p>
                      {c.statut === "en_attente" ? (
                        <Badge tone="warning">En attente</Badge>
                      ) : (
                        <Badge tone="success">Résolue</Badge>
                      )}
                    </div>
                    <p style={{ margin: "6px 0 0", fontSize: 13, color: "#5F5E5A" }}>{c.motif}</p>
                    {c.reponse && (
                      <p style={{ margin: "6px 0 0", fontSize: 13, color: "#1877F2" }}>
                        Réponse du manager : {c.reponse}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
            <Card style={{ display: "grid", gap: 10 }}>
              <input
                type="text"
                placeholder="Sujet (ex : validation d'une tâche, score de la semaine)"
                value={sujetContestation}
                onChange={(e) => setSujetContestation(e.target.value)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #E5E3DA",
                  fontSize: 14,
                }}
              />
              <textarea
                placeholder="Expliquez votre désaccord"
                value={motifContestation}
                onChange={(e) => setMotifContestation(e.target.value)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #E5E3DA",
                  fontSize: 14,
                  height: 60,
                }}
              />
              <Bouton
                variant="primary"
                onClick={soumettreContestation}
                disabled={!sujetContestation.trim() || !motifContestation.trim()}
              >
                Envoyer la contestation
              </Bouton>
            </Card>
          </div>
        )}

        {ongletActif === "profil" && (
          <div style={{ display: "grid", gap: 24 }}>
            <ProfilEmployeCarte
              employe={employe}
              statsAnnee={statsAnnee}
              palmares={palmares}
              estPrincipal={false}
              majDateEntree={() => {}}
              ajouterEtapeParcours={() => {}}
              retirerEtapeParcours={() => {}}
              ajouterAvertissement={() => {}}
              retirerAvertissement={() => {}}
            />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>Mes archives</h3>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
                Consultez vos propres données mois par mois, trimestre par trimestre ou année par
                année.
              </p>
              <PanneauArchives employes={[employe]} heureArrivee={heureArrivee} seulEmploye />
            </div>
            <ChangerMotDePasseCarte onChanger={majMonMotDePasse} />
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

const SUPABASE_URL = "https://oacjriznecslomgcamkv.supabase.co";
const SUPABASE_KEY = "sb_publishable_80rpe2MRZWELyHmgh1vRTg_q6KsSjPu";

async function verifierEmailEntreprise(email, code) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/verifier_email_entreprise`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mon_email: email, mon_code: code }),
  });
  if (!res.ok) return false;
  return res.json();
}

async function inscrire(email, motDePasse) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: motDePasse }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error_description || "Erreur d'inscription");
  return data;
}

async function renvoyerConfirmation(email) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/resend`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ type: "signup", email }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.msg || data.error_description || "Impossible de renvoyer l'email");
  return data;
}

async function connecter(email, motDePasse) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: motDePasse }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error_description || "Identifiants incorrects");
  return data;
}

async function demanderReinitialisation(email) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      data.msg || data.error_description || "Impossible d'envoyer l'email de réinitialisation."
    );
  }
  return true;
}

async function changerMotDePasse(accessToken, nouveauMotDePasse) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: nouveauMotDePasse }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || data.error_description || "Impossible de modifier le mot de passe.");
  }
  return data;
}

async function obtenirUtilisateur(accessToken) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return res.json();
}

// Charge la fiche entreprise liée à ce compte. Réessaie automatiquement en
// cas d'échec réseau ou de réponse invalide plutôt que de considérer
// silencieusement l'utilisateur comme "nouveau" — c'est précisément cette
// confusion qui a provoqué la création de fiches fantômes par le passé.
// Ici, un échec confirmé (après réessais) lève une erreur explicite au
// lieu de retourner null, pour que l'appelant ne parte jamais créer une
// nouvelle entreprise à la place d'une fiche existante introuvable par
// accident.
async function chargerDepuisSupabase(accessToken, userId, tentative = 1) {
  let res;
  try {
    res = await fetch(
      `${SUPABASE_URL}/rest/v1/etat_app?select=id,donnees,owner_id,code_entreprise`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` } }
    );
  } catch (err) {
    res = null;
  }

  if (!res || !res.ok) {
    if (tentative < 3) {
      await new Promise((r) => setTimeout(r, 600 * tentative));
      return chargerDepuisSupabase(accessToken, userId, tentative + 1);
    }
    throw new Error(
      "Impossible de charger les données de votre entreprise pour le moment. Vérifiez votre connexion et réessayez."
    );
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    if (tentative < 3) {
      await new Promise((r) => setTimeout(r, 600 * tentative));
      return chargerDepuisSupabase(accessToken, userId, tentative + 1);
    }
    throw new Error(
      "Impossible de charger les données de votre entreprise pour le moment. Vérifiez votre connexion et réessayez."
    );
  }
  if (!data.length) return null;
  // Si plusieurs fiches sont visibles pour ce compte (ex: une fiche manager
  // créée par erreur sur son propre compte, en plus de la vraie fiche de
  // son employeur), on privilégie toujours la fiche d'un tiers (celle d'un
  // employeur auquel on est lié) plutôt que de prendre la première ligne
  // au hasard — sinon un employé peut se retrouver bloqué en "Accès
  // refusé" simplement parce que sa fiche fantôme est arrivée en premier.
  const ligneAutrui = data.find((l) => l.owner_id !== userId);
  return ligneAutrui || data[0];
}

function genererCodeEntreprise() {
  const car = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += car[Math.floor(Math.random() * car.length)];
  return code.slice(0, 4) + "-" + code.slice(4);
}

async function lierEmploye(accessToken, email, code) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/lier_employe`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mon_email: email, mon_code: code }),
  });
  if (!res.ok) return false;
  return res.json();
}

async function chargerMonLien(accessToken) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/employe_comptes?select=employe_id`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  return data && data[0] ? data[0].employe_id : null;
}

async function supprimerLienEmploye(accessToken, employeId) {
  await fetch(`${SUPABASE_URL}/rest/v1/employe_comptes?employe_id=eq.${employeId}`, {
    method: "DELETE",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` },
  });
}

async function lierAdministrateur(accessToken, email, code) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/lier_administrateur`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mon_email: email, mon_code: code }),
  });
  if (!res.ok) return false;
  return res.json();
}

// Si cette requête renvoie une ligne, le compte connecté est un
// co-administrateur lié (et non le principal) : ses permissions et son
// identité (nom, prénom, poste) y sont précisées. Absence de ligne = soit
// un employé, soit l'administrateur principal lui-même.
async function chargerMesPermissionsAdmin(accessToken) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/administrateurs_comptes?select=permissions,nom,prenom,poste,email`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  if (!data || !data.length) return null;
  return {
    permissions: data[0].permissions || {},
    nom: data[0].nom || "",
    prenom: data[0].prenom || "",
    poste: data[0].poste || "",
    email: data[0].email || "",
  };
}

async function chargerAdministrateurs(accessToken) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/administrateurs_comptes?select=id,email,nom,prenom,poste,permissions,user_id&order=ajoute_le.asc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return [];
  return res.json();
}

async function ajouterAdministrateurSupabase(accessToken, ownerId, { email, nom, prenom, poste, permissions }) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/administrateurs_comptes`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ owner_id: ownerId, email, nom, prenom, poste, permissions }),
  });
  const data = await res.json();
  if (!res.ok || !data || !data[0]) {
    throw new Error(
      (data && (data.message || data.msg)) || "Impossible d'ajouter cet administrateur."
    );
  }
  return data[0];
}

async function retirerAdministrateurSupabase(accessToken, id) {
  await fetch(`${SUPABASE_URL}/rest/v1/administrateurs_comptes?id=eq.${id}`, {
    method: "DELETE",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` },
  });
}

async function creerLigne(accessToken, donnees, codeEntreprise) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/etat_app`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ donnees, code_entreprise: codeEntreprise }),
  });
  const data = await res.json();
  if (!res.ok || !data || !data[0]) {
    throw new Error(
      (data && (data.message || data.msg)) || "Impossible de créer la fiche entreprise"
    );
  }
  return data[0];
}

async function definirCodeEntreprise(accessToken, rowId, code) {
  await fetch(`${SUPABASE_URL}/rest/v1/etat_app?id=eq.${rowId}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ code_entreprise: code }),
  });
}

async function sauvegarderDansSupabase(accessToken, rowId, employes) {
  await fetch(`${SUPABASE_URL}/rest/v1/etat_app?id=eq.${rowId}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ donnees: employes }),
  });
}

// Habillage commun à tous les emails automatiques, pour rester cohérent
// avec l'identité visuelle du produit (bleu/jaune) sans dupliquer le
// balisage dans chaque déclencheur.
function templateEmail(titre, contenuHtml) {
  return `<!doctype html><html lang="fr"><body style="margin:0;padding:0;background:#F4F1E8;font-family:-apple-system,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;padding:32px 20px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
        <div style="width:28px;height:28px;background:#1877F2;border-radius:8px;"></div>
        <span style="font-size:17px;font-weight:700;color:#20231F;">BossClever</span>
      </div>
      <div style="background:#fff;border:1px solid #E5E3DA;border-radius:14px;padding:28px 24px;">
        <h1 style="font-size:18px;margin:0 0 14px;color:#20231F;">${titre}</h1>
        <div style="font-size:14px;line-height:1.6;color:#3A3936;">${contenuHtml}</div>
      </div>
      <p style="font-size:11px;color:#8A8983;margin-top:20px;text-align:center;">
        BossClever — un produit de Clever Entreprises
      </p>
    </div>
  </body></html>`;
}

// Envoi d'un email automatique — volontairement silencieux en cas
// d'échec : une notification ratée ne doit jamais bloquer ni perturber
// l'action principale de la personne (ajout d'employé, validation d'une
// tâche...). Sans clé RESEND_API_KEY configurée côté Vercel, l'envoi
// échoue simplement sans rien casser dans l'application.
async function envoyerNotification(destinataire, sujet, titre, contenuHtml) {
  if (!destinataire) {
    console.warn("[BossClever] Notification email ignorée : aucun destinataire.");
    return { ok: false, erreur: "Aucun destinataire" };
  }

  try {
    const reponse = await fetch("/api/envoyer-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinataire,
        sujet,
        corpsHtml: templateEmail(titre, contenuHtml),
      }),
    });

    const data = await reponse.json().catch(() => ({}));

    if (!reponse.ok) {
      console.error("[BossClever] Échec notification email :", data);
      return {
        ok: false,
        erreur: data.error || data.message || "Échec de l'envoi de l'email",
      };
    }

    console.log("[BossClever] Email envoyé à", destinataire, data);
    return { ok: true, data };
  } catch (erreur) {
    console.error("[BossClever] Erreur réseau notification email :", erreur);
    return { ok: false, erreur: erreur.message };
  }
}

// Chaque utilisateur dépose son image dans son propre dossier
// (userId/photo.ext), conformément aux règles RLS du bucket "avatars" —
// c'est ce qui garantit qu'il ne peut écraser que sa propre image.
async function uploaderImage(accessToken, userId, fichier) {
  const extension = (fichier.name.split(".").pop() || "jpg").toLowerCase();
  const chemin = `${userId}/photo.${extension}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/avatars/${chemin}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": fichier.type || "image/jpeg",
      "x-upsert": "true",
    },
    body: fichier,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Échec de l'envoi de l'image.");
  }
  // Le paramètre "t" force le navigateur à recharger la nouvelle image
  // plutôt que de réafficher l'ancienne depuis son cache.
  return `${SUPABASE_URL}/storage/v1/object/public/avatars/${chemin}?t=${Date.now()}`;
}

function ChampAvatar({ label, url, onFichier, forme = "cercle", taille = 52 }) {
  const inputRef = useRef(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const gererFichier = async (e) => {
    const fichier = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!fichier) return;
    if (!fichier.type.startsWith("image/")) {
      setErreur("Choisissez un fichier image.");
      return;
    }
    if (fichier.size > 3 * 1024 * 1024) {
      setErreur("Image trop lourde (3 Mo maximum).");
      return;
    }
    setErreur("");
    setEnCours(true);
    try {
      await onFichier(fichier);
    } catch (err) {
      setErreur(err.message || "Échec de l'envoi.");
    }
    setEnCours(false);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: taille,
          height: taille,
          borderRadius: forme === "cercle" ? "50%" : 10,
          background: url ? `#fff url(${url}) center/cover no-repeat` : "#F1EFE8",
          border: "1px solid #E5E3DA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#5F5E5A",
          fontSize: 10,
          flexShrink: 0,
        }}
      >
        {!url && (forme === "cercle" ? "Photo" : "Logo")}
      </div>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={gererFichier}
          style={{ display: "none" }}
        />
        <Bouton onClick={() => inputRef.current && inputRef.current.click()} disabled={enCours}>
          {enCours ? "Envoi..." : label}
        </Bouton>
        {erreur && (
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#993C1D" }}>{erreur}</p>
        )}
      </div>
    </div>
  );
}

function SelecteurSiege({ sites, onChoisir, onComparaison, onDeconnexion }) {
  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        maxWidth: 420,
        margin: "4rem auto",
        padding: "1.5rem",
        color: "#2C2C2A",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "#1877F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 3, background: "#FFD93B" }} />
        </div>
        <span style={{ fontSize: 17, fontWeight: 500 }}>BossClever</span>
      </div>

      <h2 style={{ fontSize: 17, fontWeight: 500, margin: "0 0 4px" }}>Choisissez un siège</h2>
      <p style={{ fontSize: 13, color: "#5F5E5A", margin: "0 0 20px" }}>
        Vous pourrez en changer à tout moment sans vous déconnecter.
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        {sites.map((s) => (
          <button
            key={s}
            onClick={() => onChoisir(s)}
            style={{
              padding: "14px 18px",
              borderRadius: 10,
              border: "1px solid #E5E3DA",
              background: "#fff",
              fontSize: 15,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {s}
          </button>
        ))}
        <button
          onClick={onComparaison}
          style={{
            padding: "14px 18px",
            borderRadius: 10,
            border: "2px solid #1877F2",
            background: "#E7F0FE",
            color: "#0F4FA8",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          📊 Comparaison des bureaux
        </button>
      </div>

      <p style={{ marginTop: 28 }}>
        <span onClick={onDeconnexion} style={{ color: "#993C1D", cursor: "pointer", fontSize: 13 }}>
          Se déconnecter
        </span>
      </p>
    </div>
  );
}

function VueComparaisonSites({ employes, criteres, onRetour }) {
  const parSite = useMemo(() => {
    const groupes = {};
    employes.forEach((e) => {
      if (!e.site || !e.site.trim()) return;
      const site = e.site.trim();
      if (!groupes[site]) groupes[site] = { site, employes: [] };
      const { score } = calculerScore(e, criteres);
      groupes[site].employes.push({ ...e, score });
    });
    return Object.values(groupes)
      .map((g) => ({
        ...g,
        moyenne: Math.round(g.employes.reduce((s, e) => s + e.score, 0) / g.employes.length),
      }))
      .sort((a, b) => b.moyenne - a.moyenne);
  }, [employes, criteres]);

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "40px 20px 60px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#20231F",
      }}
    >
      <button
        onClick={onRetour}
        style={{
          border: "none",
          background: "none",
          color: "#1877F2",
          cursor: "pointer",
          fontSize: 14,
          padding: 0,
          marginBottom: 24,
        }}
      >
        ← Retour au choix du siège
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px" }}>Comparaison des bureaux</h1>
      <p style={{ fontSize: 13, color: "#5F5E5A", margin: "0 0 24px" }}>
        Score moyen en direct de chaque siège, tous départements confondus.
      </p>

      {parSite.length === 0 ? (
        <p style={{ fontSize: 14, color: "#5F5E5A" }}>
          Aucun employé n'est encore rattaché à un siège.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {parSite.map((g) => (
            <div
              key={g.site}
              style={{ padding: "14px 18px", border: "1px solid #E5E3DA", borderRadius: 12, background: "#fff" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>{g.site}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
                    {g.employes.length} employé{g.employes.length > 1 ? "s" : ""}
                  </p>
                </div>
                <span style={{ fontSize: 22, fontWeight: 600, color: couleurScore(g.moyenne) }}>
                  {g.moyenne}%
                </span>
              </div>
              <div style={{ height: 7, borderRadius: 4, background: "#F1EFE8", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.max(0, Math.min(100, g.moyenne))}%`,
                    background: couleurScore(g.moyenne),
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EcranChoixRole({ onChoisir, onRetourAccueil }) {
  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        maxWidth: 380,
        margin: "4rem auto",
        padding: "1.5rem",
        color: "#2C2C2A",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "#1877F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 3, background: "#FFD93B" }} />
        </div>
        <span style={{ fontSize: 17, fontWeight: 500 }}>BossClever</span>
      </div>

      <h2 style={{ fontSize: 17, fontWeight: 500, margin: "0 0 20px" }}>Vous êtes...</h2>

      <div style={{ display: "grid", gap: 12 }}>
        <button
          onClick={() => onChoisir("manager")}
          style={{
            padding: "16px 20px",
            borderRadius: 10,
            border: "1px solid #E5E3DA",
            background: "#fff",
            fontSize: 15,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <strong>Manager</strong>
          <div style={{ fontSize: 12, color: "#5F5E5A", marginTop: 2 }}>
            Je gère une équipe
          </div>
        </button>
        <button
          onClick={() => onChoisir("employe")}
          style={{
            padding: "16px 20px",
            borderRadius: 10,
            border: "1px solid #E5E3DA",
            background: "#fff",
            fontSize: 15,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <strong>Employé</strong>
          <div style={{ fontSize: 12, color: "#5F5E5A", marginTop: 2 }}>
            J'ai été ajouté par mon manager
          </div>
        </button>
      </div>

      {onRetourAccueil && (
        <p style={{ marginTop: 28 }}>
          <span
            onClick={onRetourAccueil}
            style={{ color: "#1877F2", cursor: "pointer", fontSize: 13 }}
          >
            ← Retour à l'accueil
          </span>
        </p>
      )}
    </div>
  );
}

const STYLES_PITCH = `
  .pitch-panel { animation: pitch-fade 0.6s ease; }
  @keyframes pitch-fade {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .pitch-item {
    animation: pitch-pop 0.4s ease backwards;
  }
  @keyframes pitch-pop {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .pitch-glow {
    animation: pitch-glow 4s ease-in-out infinite;
  }
  @keyframes pitch-glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.9; }
  }
  @media (max-width: 760px) {
    .pitch-panel { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .pitch-panel, .pitch-item, .pitch-glow { animation: none; }
  }
`;

function PanneauPitch() {
  return (
    <div
      className="pitch-panel"
      style={{
        flex: "1 1 380px",
        background: "linear-gradient(160deg, #1877F2 0%, #0F4FA8 100%)",
        borderRadius: 20,
        padding: "2.25rem 2rem",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{STYLES_PITCH}</style>
      <div
        className="pitch-glow"
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "#FFD93B",
          opacity: 0.6,
          filter: "blur(40px)",
        }}
      />

      <p
        style={{
          position: "relative",
          fontSize: 15.5,
          lineHeight: 1.6,
          fontStyle: "italic",
          margin: "0 0 6px",
        }}
      >
        « Est-ce que mes employés travaillent ? Qui produit réellement ? Où perd-on du temps ? Qui
        mérite une récompense ? Quels problèmes dois-je anticiper ? »
      </p>
      <p style={{ position: "relative", fontSize: 13.5, color: "#D9E7FD", margin: "0 0 26px" }}>
        Ne vous inquiétez pas — BossClever vous aide à répondre à toutes ces questions, autour de
        6 piliers.
      </p>

      <div style={{ position: "relative", display: "grid", gap: 16 }}>
        {SIX_PILIERS.map((p, i) => (
          <div
            key={p.titre}
            className="pitch-item"
            style={{ display: "flex", alignItems: "flex-start", gap: 12, animationDelay: `${i * 0.08}s` }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(255,255,255,0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "#FFD93B",
              }}
            >
              {p.icone}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{p.titre}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#D9E7FD", lineHeight: 1.45 }}>
                {p.texte}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EcranConnexion({ onConnecte, roleDeclare, onRetour }) {
  const [mode, setMode] = useState("connexion");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmMotDePasse, setConfirmMotDePasse] = useState("");
  const [codeEntreprise, setCodeEntreprise] = useState("");
  const [afficherMdp, setAfficherMdp] = useState(false);
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [renvoiEnCours, setRenvoiEnCours] = useState(false);
  const [messageRenvoi, setMessageRenvoi] = useState("");
  const [reinitEnCours, setReinitEnCours] = useState(false);
  const [messageReinit, setMessageReinit] = useState("");

  const renvoyer = async () => {
    if (!email) {
      setMessageRenvoi("Indiquez d'abord votre email ci-dessus.");
      return;
    }
    setRenvoiEnCours(true);
    setMessageRenvoi("");
    try {
      await renvoyerConfirmation(email);
      setMessageRenvoi("Email de confirmation renvoyé — pensez aussi à vérifier vos spams.");
    } catch (e) {
      setMessageRenvoi(e.message);
    }
    setRenvoiEnCours(false);
  };

  const demanderMdpOublie = async () => {
    if (!email) {
      setMessageReinit("Indiquez d'abord votre email ci-dessus.");
      return;
    }
    setReinitEnCours(true);
    setMessageReinit("");
    try {
      await demanderReinitialisation(email);
      setMessageReinit("Un email avec un lien de réinitialisation vous a été envoyé.");
    } catch (e) {
      setMessageReinit(e.message);
    }
    setReinitEnCours(false);
  };

  const soumettre = async () => {
    setErreur("");
    if (mode === "inscription" && motDePasse !== confirmMotDePasse) {
      setErreur("Les deux mots de passe ne correspondent pas.");
      return;
    }
    if (mode === "inscription" && roleDeclare === "employe" && !codeEntreprise.trim()) {
      setErreur("Le code entreprise est obligatoire pour créer un compte employé.");
      return;
    }
    setEnCours(true);
    try {
      if (mode === "inscription") {
        const codeSaisi = codeEntreprise.trim().toUpperCase();
        if (roleDeclare === "employe") {
          const reconnu = await verifierEmailEntreprise(email, codeSaisi);
          if (!reconnu) {
            setErreur(
              "Cet email n'a pas été ajouté par votre entreprise. Contactez votre manager avant de créer un compte."
            );
            setEnCours(false);
            return;
          }
        }
        await inscrire(email, motDePasse);
        if (roleDeclare === "employe" && codeSaisi) {
          localStorage.setItem(
            "bc_code_attente",
            JSON.stringify({ email, code: codeSaisi, role: "employe" })
          );
        } else if (roleDeclare === "manager" && codeSaisi) {
          localStorage.setItem(
            "bc_code_attente",
            JSON.stringify({ email, code: codeSaisi, role: "manager" })
          );
        }
        setMode("connexion");
        setConfirmMotDePasse("");
        setErreur("Compte créé ! Vérifiez vos emails puis connectez-vous.");
      } else {
        if (roleDeclare === "employe" && !codeEntreprise.trim()) {
          setErreur("Le code entreprise est obligatoire pour vous connecter.");
          setEnCours(false);
          return;
        }
        const session = await connecter(email, motDePasse);
        onConnecte({
          ...session,
          email,
          userId: session.user?.id,
          codeSaisi: codeEntreprise.trim().toUpperCase(),
          roleDeclare,
        });
      }
    } catch (e) {
      setErreur(e.message);
    }
    setEnCours(false);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 48,
        maxWidth: 900,
        margin: "4rem auto",
        padding: "1.5rem",
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        maxWidth: 380,
        flex: "1 1 340px",
        color: "#2C2C2A",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "#1877F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 3, background: "#FFD93B" }} />
        </div>
        <span style={{ fontSize: 17, fontWeight: 500 }}>BossClever</span>
      </div>

      <span
        onClick={onRetour}
        style={{ fontSize: 12, color: "#5F5E5A", cursor: "pointer" }}
      >
        ← Changer de profil
      </span>

      <h2 style={{ fontSize: 18, fontWeight: 500, margin: "10px 0 20px" }}>
        {mode === "connexion" ? "Connexion" : "Créer un compte"}{" "}
        {roleDeclare === "manager" ? "manager" : "employé"}
      </h2>

      <label style={{ fontSize: 13, color: "#5F5E5A", display: "block", marginBottom: 4 }}>
        Email professionnel
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "9px 12px",
          borderRadius: 8,
          border: "1px solid #E5E3DA",
          marginBottom: 14,
          boxSizing: "border-box",
        }}
      />
      {mode === "inscription" && roleDeclare === "employe" && (
        <p style={{ fontSize: 12, color: "#5F5E5A", margin: "-8px 0 14px" }}>
          Utilisez l'adresse email exacte transmise par votre manager.
        </p>
      )}

      <label style={{ fontSize: 13, color: "#5F5E5A", display: "block", marginBottom: 4 }}>
        Mot de passe
      </label>
      <div style={{ position: "relative", marginBottom: mode === "inscription" ? 14 : 18 }}>
        <input
          type={afficherMdp ? "text" : "password"}
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          style={{
            width: "100%",
            padding: "9px 40px 9px 12px",
            borderRadius: 8,
            border: "1px solid #E5E3DA",
            boxSizing: "border-box",
          }}
        />
        <span
          onClick={() => setAfficherMdp(!afficherMdp)}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 12,
            color: "#5F5E5A",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {afficherMdp ? "Masquer" : "Afficher"}
        </span>
      </div>

      {mode === "inscription" && (
        <>
          <label style={{ fontSize: 13, color: "#5F5E5A", display: "block", marginBottom: 4 }}>
            Confirmer le mot de passe
          </label>
          <input
            type={afficherMdp ? "text" : "password"}
            value={confirmMotDePasse}
            onChange={(e) => setConfirmMotDePasse(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid #E5E3DA",
              marginBottom: 14,
              boxSizing: "border-box",
            }}
          />
        </>
      )}

      {roleDeclare === "employe" && (
        <>
          <label style={{ fontSize: 13, color: "#5F5E5A", display: "block", marginBottom: 4 }}>
            Code entreprise
          </label>
          <input
            type="text"
            placeholder="Ex : AB3D-9XYZ"
            value={codeEntreprise}
            onChange={(e) => setCodeEntreprise(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid #E5E3DA",
              marginBottom: 4,
              boxSizing: "border-box",
              textTransform: "uppercase",
            }}
          />
          <p style={{ fontSize: 12, color: "#5F5E5A", margin: "0 0 18px" }}>
            Obligatoire, transmis par votre manager.
          </p>
        </>
      )}

      {roleDeclare === "manager" && (
        <>
          <label style={{ fontSize: 13, color: "#5F5E5A", display: "block", marginBottom: 4 }}>
            Code entreprise (facultatif)
          </label>
          <input
            type="text"
            placeholder="Ex : AB3D-9XYZ"
            value={codeEntreprise}
            onChange={(e) => setCodeEntreprise(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid #E5E3DA",
              marginBottom: 4,
              boxSizing: "border-box",
              textTransform: "uppercase",
            }}
          />
          <p style={{ fontSize: 12, color: "#5F5E5A", margin: "0 0 18px" }}>
            À renseigner uniquement si vous rejoignez une entreprise existante en tant que
            co-administrateur — laissez vide pour créer votre propre entreprise.
          </p>
        </>
      )}

      {erreur && (
        <p style={{ fontSize: 13, color: "#993C1D", marginBottom: 14 }}>{erreur}</p>
      )}

      {mode === "inscription" && (
        <p style={{ fontSize: 12, color: "#5F5E5A", lineHeight: 1.5, marginBottom: 14 }}>
          En vous inscrivant, vous acceptez les{" "}
          <a href="#cgu" style={{ color: "#1877F2", textDecoration: "none" }}>
            Conditions d'utilisation
          </a>{" "}
          de BossClever et reconnaissez avoir pris connaissance de la{" "}
          <a href="#confidentialite" style={{ color: "#1877F2", textDecoration: "none" }}>
            Politique de confidentialité
          </a>
          , y compris la gestion des cookies.
        </p>
      )}

      <button
        onClick={soumettre}
        disabled={
          enCours ||
          !email ||
          !motDePasse ||
          (mode === "inscription" && motDePasse !== confirmMotDePasse)
        }
        style={{
          width: "100%",
          background: "#1877F2",
          color: "#fff",
          border: "none",
          padding: "10px 16px",
          borderRadius: 8,
          fontSize: 14,
          cursor: "pointer",
          opacity: enCours ? 0.6 : 1,
          fontFamily: "inherit",
        }}
      >
        {enCours ? "Veuillez patienter…" : mode === "connexion" ? "Se connecter" : "S'inscrire"}
      </button>

      <p style={{ fontSize: 13, color: "#5F5E5A", marginTop: 16, textAlign: "center" }}>
        {mode === "connexion" ? "Pas encore de compte ? " : "Déjà un compte ? "}
        <span
          onClick={() => {
            setMode(mode === "connexion" ? "inscription" : "connexion");
            setErreur("");
          }}
          style={{ color: "#1877F2", cursor: "pointer" }}
        >
          {mode === "connexion" ? "Créer un compte" : "Se connecter"}
        </span>
      </p>

      <p style={{ fontSize: 13, color: "#5F5E5A", marginTop: 10, textAlign: "center" }}>
        Vous n'avez pas reçu l'email de confirmation ?{" "}
        <span
          onClick={renvoyer}
          style={{
            color: "#1877F2",
            cursor: renvoiEnCours ? "default" : "pointer",
            opacity: renvoiEnCours ? 0.6 : 1,
          }}
        >
          {renvoiEnCours ? "Envoi…" : "Renvoyer"}
        </span>
      </p>
      {messageRenvoi && (
        <p style={{ fontSize: 12, color: "#5F5E5A", textAlign: "center", marginTop: 4 }}>
          {messageRenvoi}
        </p>
      )}

      {mode === "connexion" && (
        <>
          <p style={{ fontSize: 13, color: "#5F5E5A", marginTop: 10, textAlign: "center" }}>
            <span
              onClick={demanderMdpOublie}
              style={{
                color: "#1877F2",
                cursor: reinitEnCours ? "default" : "pointer",
                opacity: reinitEnCours ? 0.6 : 1,
              }}
            >
              {reinitEnCours ? "Envoi…" : "Mot de passe oublié ?"}
            </span>
          </p>
          {messageReinit && (
            <p style={{ fontSize: 12, color: "#5F5E5A", textAlign: "center", marginTop: 4 }}>
              {messageReinit}
            </p>
          )}
        </>
      )}
    </div>

    <PanneauPitch />
    </div>
  );
}

function EcranNouveauMotDePasse({ accessToken, onTermine }) {
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [afficher, setAfficher] = useState(false);
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  const valider = async () => {
    setErreur("");
    if (motDePasse.length < 6) {
      setErreur("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (motDePasse !== confirmation) {
      setErreur("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setEnCours(true);
    try {
      await changerMotDePasse(accessToken, motDePasse);
      onTermine();
    } catch (e) {
      setErreur(e.message);
    }
    setEnCours(false);
  };

  return (
    <div
      style={{
        maxWidth: 380,
        margin: "60px auto",
        padding: "0 20px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 6px" }}>Nouveau mot de passe</h1>
      <p style={{ fontSize: 13, color: "#5F5E5A", margin: "0 0 20px" }}>
        Choisissez un nouveau mot de passe pour votre compte.
      </p>

      <label style={{ fontSize: 13, color: "#5F5E5A", display: "block", marginBottom: 4 }}>
        Nouveau mot de passe
      </label>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input
          type={afficher ? "text" : "password"}
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          style={{
            flex: 1,
            padding: "9px 12px",
            borderRadius: 8,
            border: "1px solid #E5E3DA",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={() => setAfficher(!afficher)}
          style={{ border: "1px solid #E5E3DA", borderRadius: 8, background: "#fff", padding: "0 12px", cursor: "pointer", fontSize: 12 }}
        >
          {afficher ? "Masquer" : "Afficher"}
        </button>
      </div>

      <label style={{ fontSize: 13, color: "#5F5E5A", display: "block", marginBottom: 4 }}>
        Confirmer le mot de passe
      </label>
      <input
        type={afficher ? "text" : "password"}
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        style={{
          width: "100%",
          padding: "9px 12px",
          borderRadius: 8,
          border: "1px solid #E5E3DA",
          marginBottom: 14,
          boxSizing: "border-box",
        }}
      />

      {erreur && (
        <p style={{ fontSize: 13, color: "#993C1D", marginBottom: 12 }}>{erreur}</p>
      )}

      <button
        onClick={valider}
        disabled={enCours || !motDePasse || !confirmation}
        style={{
          width: "100%",
          padding: "10px",
          background: "#1877F2",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 14,
          cursor: "pointer",
          opacity: enCours ? 0.6 : 1,
          fontFamily: "inherit",
        }}
      >
        {enCours ? "Enregistrement…" : "Valider le nouveau mot de passe"}
      </button>
    </div>
  );
}

export default function App() {
  const [pageLegaleActive, setPageLegaleActive] = useState(() => {
    if (typeof window === "undefined") return null;
    if (window.location.hash.startsWith("#cgu")) return "cgu";
    if (window.location.hash.startsWith("#confidentialite")) return "confidentialite";
    if (window.location.hash.startsWith("#contact")) return "contact";
    if (window.location.hash.startsWith("#regles-manager")) return "regles-manager";
    if (window.location.hash.startsWith("#declaration-validation")) return "declaration-validation";
    if (window.location.hash.startsWith("#calcul-score")) return "calcul-score";
    if (window.location.hash.startsWith("#14-criteres")) return "14-criteres";
    if (window.location.hash.startsWith("#six-piliers")) return "six-piliers";
    if (window.location.hash.startsWith("#co-administrateurs")) return "co-administrateurs";
    return null;
  });

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash.startsWith("#cgu")) setPageLegaleActive("cgu");
      else if (window.location.hash.startsWith("#confidentialite")) setPageLegaleActive("confidentialite");
      else if (window.location.hash.startsWith("#contact")) setPageLegaleActive("contact");
      else if (window.location.hash.startsWith("#regles-manager")) setPageLegaleActive("regles-manager");
      else if (window.location.hash.startsWith("#declaration-validation")) setPageLegaleActive("declaration-validation");
      else if (window.location.hash.startsWith("#calcul-score")) setPageLegaleActive("calcul-score");
      else if (window.location.hash.startsWith("#14-criteres")) setPageLegaleActive("14-criteres");
      else if (window.location.hash.startsWith("#six-piliers")) setPageLegaleActive("six-piliers");
      else if (window.location.hash.startsWith("#co-administrateurs")) setPageLegaleActive("co-administrateurs");
      else setPageLegaleActive(null);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const [session, setSession] = useState(null);
  const [rowId, setRowId] = useState(null);
  const [employes, setEmployes] = useState(EMPLOYES_INIT);
  const [vue, setVue] = useState("manager");
  const [employeActifId, setEmployeActifId] = useState(1);
  const [chargement, setChargement] = useState(false);
  const [afficherAbonnementRapide, setAfficherAbonnementRapide] = useState(false);
  const [criteres, setCriteres] = useState(CRITERES);
  const [logoUrl, setLogoUrl] = useState("");
  const [bureau, setBureau] = useState(null);
  const [bureaux, setBureaux] = useState({});
  const [heureArrivee, setHeureArrivee] = useState("08:00");
  const [heureDepart, setHeureDepart] = useState("17:00");
  const [sites, setSites] = useState([]);
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [felicitations, setFelicitations] = useState([]);
  const [adresseEntreprise, setAdresseEntreprise] = useState("");
  const [siteActif, setSiteActif] = useState(null);
  const [plan, setPlan] = useState("decouverte");
  const [abonnement, setAbonnement] = useState(null);
  const [role, setRole] = useState(null);
  const [erreurChargement, setErreurChargement] = useState("");
  const [accesRefuse, setAccesRefuse] = useState(false);
  const [codeEntreprise, setCodeEntrepriseState] = useState(null);
  const [verificationLien, setVerificationLien] = useState(true);
  const [modeRecuperation, setModeRecuperation] = useState(false);
  const [roleDeclare, setRoleDeclare] = useState(null);
  const [landingVu, setLandingVu] = useState(false);
  const [estPrincipal, setEstPrincipal] = useState(true);
  const [permissionsAdmin, setPermissionsAdmin] = useState(null);
  const [monIdentite, setMonIdentite] = useState(null);
  const [journalActivite, setJournalActivite] = useState([]);
  const [administrateurs, setAdministrateurs] = useState([]);
  const [retourPaiement, setRetourPaiement] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("paiement=retour")) {
      setRetourPaiement(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("paiement");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  // Détecte un lien de confirmation d'email ou de réinitialisation de mot
  // de passe (access_token dans l'URL) et connecte automatiquement la
  // personne, sans qu'elle ait à ressaisir son mot de passe. Un lien de
  // réinitialisation (type=recovery) déclenche en plus l'écran de saisie
  // du nouveau mot de passe avant de continuer normalement.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token=")) {
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const estRecuperation = params.get("type") === "recovery";
      if (accessToken) {
        (async () => {
          const utilisateur = await obtenirUtilisateur(accessToken);
          if (utilisateur) {
            let attente = null;
            try {
              attente = JSON.parse(localStorage.getItem("bc_code_attente") || "null");
            } catch (e) {
              attente = null;
            }
            const roleDetecte =
              attente && attente.email === utilisateur.email && attente.role === "employe"
                ? "employe"
                : "manager";
            setRoleDeclare(roleDetecte);
            setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
              email: utilisateur.email,
              userId: utilisateur.id,
              roleDeclare: roleDetecte,
            });
            if (estRecuperation) setModeRecuperation(true);
          }
          window.history.replaceState(null, "", window.location.pathname);
          setVerificationLien(false);
        })();
        return;
      }
    }
    setVerificationLien(false);
  }, []);

  useEffect(() => {
    if (!session) return;
    setChargement(true);
    (async () => {
      try {
        let ligne = await chargerDepuisSupabase(session.access_token, session.userId);
        let codeEtaitFourni = false;
        let codeVerifieViaLien = false;

        if (!ligne) {
          // Aucune fiche accessible : on regarde si un code entreprise
          // a été renseigné à l'inscription, pour lier ce compte au bon
          // employeur (en tant qu'employé) ou à la bonne entreprise (en
          // tant que co-administrateur invité).
          let attente = null;
          try {
            attente = JSON.parse(localStorage.getItem("bc_code_attente") || "null");
          } catch (e) {
            attente = null;
          }
          if (attente && attente.email === session.email && attente.code) {
            codeEtaitFourni = true;
            const lien =
              attente.role === "manager"
                ? await lierAdministrateur(session.access_token, session.email, attente.code)
                : await lierEmploye(session.access_token, session.email, attente.code);
            if (lien) {
              ligne = await chargerDepuisSupabase(session.access_token, session.userId);
              codeVerifieViaLien = true;
            }
          }
          localStorage.removeItem("bc_code_attente");
        }

        if (!ligne && roleDeclare === "manager" && session.codeSaisi) {
          // Cas d'une connexion directe (pas juste après inscription) avec
          // un code renseigné : tentative de liaison en tant que
          // co-administrateur.
          codeEtaitFourni = true;
          const lien = await lierAdministrateur(
            session.access_token,
            session.email,
            session.codeSaisi
          );
          if (lien) {
            ligne = await chargerDepuisSupabase(session.access_token, session.userId);
            codeVerifieViaLien = true;
          }
        }

        if (!ligne && (codeEtaitFourni || roleDeclare === "employe")) {
          // Un rôle "employé" avait été déclaré (ou un code fourni) mais
          // aucune liaison valide n'a été trouvée : on bloque l'accès
          // plutôt que de créer une fiche manager par erreur.
          setAccesRefuse(true);
          setChargement(false);
          return;
        }

        if (!ligne) {
          // Toujours rien : nouveau manager, on crée sa propre fiche
          // avec un code entreprise unique à partager à ses employés.
          const nouveauCode = genererCodeEntreprise();
          ligne = await creerLigne(
            session.access_token,
            { employes: EMPLOYES_INIT, criteres: CRITERES },
            nouveauCode
          );
          setRole("manager");
          setEstPrincipal(true);
          setPermissionsAdmin(null);
          setMonIdentite({ estPrincipal: true, nom: "", prenom: "", poste: "Administrateur principal", email: session.email });
          setCodeEntrepriseState(nouveauCode);
        } else if (ligne.owner_id === session.userId) {
          if (roleDeclare === "employe") {
            // Ce compte est en réalité un manager, mais la personne a
            // déclaré vouloir se connecter en tant qu'employé.
            setAccesRefuse(true);
            setChargement(false);
            return;
          }
          setRole("manager");
          setEstPrincipal(true);
          setPermissionsAdmin(null);
          setMonIdentite({ estPrincipal: true, nom: "", prenom: "", poste: "Administrateur principal", email: session.email });
          if (ligne.code_entreprise) {
            setCodeEntrepriseState(ligne.code_entreprise);
          } else {
            // Fiche manager créée avant l'ajout du code entreprise : on
            // en génère un rétroactivement.
            const nouveauCode = genererCodeEntreprise();
            await definirCodeEntreprise(session.access_token, ligne.id, nouveauCode);
            setCodeEntrepriseState(nouveauCode);
          }
        } else {
          // Le compte est visible via la fiche d'un tiers : soit un
          // employé lié, soit un co-administrateur lié. On détermine
          // lequel via les tables de liaison plutôt que de se fier au
          // rôle déclaré à l'écran précédent.
          const mesPermissions = await chargerMesPermissionsAdmin(session.access_token);

          if (mesPermissions) {
            if (roleDeclare === "employe") {
              setAccesRefuse(true);
              setChargement(false);
              return;
            }
            setRole("manager");
            setEstPrincipal(false);
            setPermissionsAdmin(mesPermissions.permissions);
            setMonIdentite({
              estPrincipal: false,
              nom: mesPermissions.nom,
              prenom: mesPermissions.prenom,
              poste: mesPermissions.poste,
              email: mesPermissions.email || session.email,
            });
            if (ligne.code_entreprise) setCodeEntrepriseState(ligne.code_entreprise);
          } else {
            if (roleDeclare === "manager") {
              // Ce compte est en réalité lié en tant qu'employé, mais la
              // personne a déclaré vouloir se connecter en tant que manager.
              setAccesRefuse(true);
              setChargement(false);
              return;
            }
            // Un employé doit obligatoirement saisir le bon code entreprise
            // à chaque connexion, même si son compte est déjà lié — sauf
            // juste après avoir cliqué sur le lien de confirmation, où le
            // code vient d'être vérifié par la liaison elle-même.
            if (!codeVerifieViaLien) {
              const codeAttendu = (ligne.code_entreprise || "").toUpperCase();
              const codeFourni = (session.codeSaisi || "").toUpperCase();
              if (!codeFourni || codeFourni !== codeAttendu) {
                setAccesRefuse(true);
                setChargement(false);
                return;
              }
            }
            setRole("employe");
            const monId = await chargerMonLien(session.access_token);
            if (monId) {
              setEmployeActifId(monId);
              setVue("employe");
            }
          }
        }

        setRowId(ligne.id);
        const d = ligne.donnees || {};
        setEmployes(d.employes && d.employes.length ? d.employes : EMPLOYES_INIT);
        setCriteres(d.criteres && d.criteres.length ? d.criteres : CRITERES);
        setLogoUrl(d.logoUrl || "");
        setBureau(d.bureau || null);
        setBureaux(d.bureaux || {});
        setHeureArrivee(d.heureArrivee || "08:00");
        setHeureDepart(d.heureDepart || "17:00");
        setJournalActivite(d.journalActivite || []);
        setSites(d.sites || []);
        setNomEntreprise(d.nomEntreprise || "");
        setFelicitations(d.felicitations || []);
        setAdresseEntreprise(d.adresseEntreprise || "");
        setPlan(d.plan || "decouverte");

        // Un abonnement payant dont l'échéance est dépassée repasse
        // automatiquement au plan gratuit, dès la prochaine connexion —
        // il n'y a pas de prélèvement récurrent automatique via CinetPay,
        // donc c'est ce contrôle qui fait office de vérification.
        const abonnementCharge = d.abonnement || null;
        if (
          abonnementCharge &&
          abonnementCharge.statut === "actif" &&
          abonnementCharge.expireLe &&
          new Date() > new Date(abonnementCharge.expireLe)
        ) {
          setPlan("decouverte");
          setAbonnement({ ...abonnementCharge, statut: "expire" });
        } else {
          setAbonnement(abonnementCharge);
        }

        setErreurChargement("");
      } catch (e) {
        setErreurChargement(
          "Impossible de charger ou créer vos données (" +
            (e.message || "erreur inconnue") +
            "). Vos modifications ne seront pas sauvegardées tant que ce problème persiste."
        );
      }
      setChargement(false);
    })();
  }, [session]);

  useEffect(() => {
    if (chargement || !session || !rowId) return;
    sauvegarderDansSupabase(session.access_token, rowId, { employes, criteres, logoUrl, bureau, bureaux, plan, abonnement, heureArrivee, heureDepart, journalActivite, sites, nomEntreprise, adresseEntreprise, felicitations }).catch(() => {});
  }, [employes, criteres, logoUrl, bureau, bureaux, plan, abonnement, heureArrivee, heureDepart, journalActivite, sites, nomEntreprise, adresseEntreprise, felicitations, chargement, session, rowId]);

  // Seul le principal gère la liste des co-administrateurs : inutile
  // (et non autorisé par les règles de sécurité) pour un co-administrateur
  // de la charger lui-même.
  useEffect(() => {
    if (!session || role !== "manager" || !estPrincipal || !rowId) return;
    chargerAdministrateurs(session.access_token).then(setAdministrateurs).catch(() => {});
  }, [session, role, estPrincipal, rowId]);

  const peutFaire = (cle) => !!(permissionsAdmin && permissionsAdmin[cle]);

  const ajouterAdministrateur = async ({ email, prenom, nom, poste, permissions }) => {
    if (!session) return;
    const nouveau = await ajouterAdministrateurSupabase(session.access_token, session.userId, {
      email,
      prenom,
      nom,
      poste,
      permissions,
    });
    enregistrerActivite("Ajout de co-administrateur", `${prenom} ${nom}${poste ? ` (${poste})` : ""}`);
    setAdministrateurs((prev) => [...prev, nouveau]);
  };

  const retirerAdministrateur = async (id) => {
    if (!session) return;
    const cible = administrateurs.find((a) => a.id === id);
    await retirerAdministrateurSupabase(session.access_token, id);
    enregistrerActivite(
      "Retrait de co-administrateur",
      cible ? `${cible.prenom || ""} ${cible.nom || ""}`.trim() || cible.email : ""
    );
    setAdministrateurs((prev) => prev.filter((a) => a.id !== id));
  };

  const majEmploye = (id, fn) =>
    setEmployes((prev) => prev.map((e) => (e.id === id ? fn(e) : e)));

  // Journal d'activité : trace qui (principal ou tel co-administrateur, par
  // son identité propre) a fait quoi et quand, pour les actions clés. Ne
  // conserve que les 200 entrées les plus récentes pour ne pas alourdir
  // indéfiniment la fiche entreprise.
  const enregistrerActivite = (action, details) => {
    const auteur = monIdentite
      ? monIdentite.estPrincipal
        ? "Administrateur principal"
        : `${monIdentite.prenom} ${monIdentite.nom}`.trim() || monIdentite.email
      : "Inconnu";
    const posteAuteur = monIdentite && !monIdentite.estPrincipal ? monIdentite.poste : "";
    setJournalActivite((prev) =>
      [
        {
          id: Date.now() + Math.random(),
          date: new Date().toISOString(),
          auteur,
          posteAuteur,
          action,
          details,
        },
        ...prev,
      ].slice(0, 200)
    );
  };

  const majDateEntree = (empId, date) =>
    majEmploye(empId, (e) => ({ ...e, dateEntree: date }));

  const majSite = (empId, site) => majEmploye(empId, (e) => ({ ...e, site }));

  const ajouterSiteEntreprise = (nom) => {
    const propre = nom.trim();
    if (!propre || sites.includes(propre)) return;
    enregistrerActivite("Ajout d'un siège", propre);
    setSites((prev) => [...prev, propre]);
  };

  const renommerSiteEntreprise = (ancien, nouveau) => {
    const propre = nouveau.trim();
    if (!propre || propre === ancien || sites.includes(propre)) return;
    enregistrerActivite("Renommage d'un siège", `${ancien} → ${propre}`);
    setSites((prev) => prev.map((s) => (s === ancien ? propre : s)));
    setEmployes((prev) => prev.map((e) => (e.site === ancien ? { ...e, site: propre } : e)));
    if (siteActif === ancien) setSiteActif(propre);
  };

  const supprimerSiteEntreprise = (nom) => {
    enregistrerActivite("Suppression d'un siège", nom);
    setSites((prev) => prev.filter((s) => s !== nom));
    setEmployes((prev) => prev.map((e) => (e.site === nom ? { ...e, site: "" } : e)));
    if (siteActif === nom) setSiteActif(null);
  };

  const soumettreInitiative = (empId, { titre, probleme, solution }) =>
    majEmploye(empId, (e) => ({
      ...e,
      initiatives: [
        ...(e.initiatives || []),
        {
          id: Date.now(),
          titre,
          probleme,
          solution,
          statut: "en_attente",
          dateProposee: new Date().toISOString(),
          commentaireManager: "",
        },
      ],
    }));

  // Les points de proactivité ne sont attribués qu'à la validation par le
  // manager — pas à la simple soumission — pour que le score reflète des
  // initiatives réellement jugées utiles, pas une simple déclaration.
  const validerInitiative = (empId, initiativeId, commentaire) => {
    if (gestionGelee) return;
    majEmploye(empId, (e) => {
      const initiative = (e.initiatives || []).find((i) => i.id === initiativeId);
      enregistrerActivite("Validation d'initiative", `« ${initiative?.titre || ""} » de ${e.nom}`);
      return {
        ...e,
        initiatives: (e.initiatives || []).map((i) =>
          i.id === initiativeId
            ? { ...i, statut: "validee", commentaireManager: commentaire, dateTraitee: new Date().toISOString() }
            : i
        ),
        journalPoints: [
          ...(e.journalPoints || []),
          {
            id: Date.now(),
            libelle: `Initiative validée : « ${initiative ? initiative.titre : ""} »`,
            points: 10,
          },
        ],
      };
    });
  };

  const rejeterInitiative = (empId, initiativeId, commentaire) => {
    if (gestionGelee) return;
    majEmploye(empId, (e) => {
      const initiative = (e.initiatives || []).find((i) => i.id === initiativeId);
      enregistrerActivite("Rejet d'initiative", `« ${initiative?.titre || ""} » de ${e.nom}`);
      return {
        ...e,
        initiatives: (e.initiatives || []).map((i) =>
          i.id === initiativeId
            ? { ...i, statut: "rejetee", commentaireManager: commentaire, dateTraitee: new Date().toISOString() }
            : i
        ),
      };
    });
  };

  const ajouterEtapeParcours = (empId, { date, titre }) =>
    majEmploye(empId, (e) => ({
      ...e,
      parcours: [...(e.parcours || []), { id: Date.now(), date, titre }],
    }));

  const retirerEtapeParcours = (empId, etapeId) =>
    majEmploye(empId, (e) => ({
      ...e,
      parcours: (e.parcours || []).filter((p) => p.id !== etapeId),
    }));

  const ajouterAvertissement = (empId, { date, motif }) =>
    majEmploye(empId, (e) => ({
      ...e,
      avertissements: [...(e.avertissements || []), { id: Date.now(), date, motif }],
    }));

  const retirerAvertissement = (empId, avertId) =>
    majEmploye(empId, (e) => ({
      ...e,
      avertissements: (e.avertissements || []).filter((a) => a.id !== avertId),
    }));

  const majAvatarEmploye = async (empId, fichier) => {
    if (!session) return;
    const url = await uploaderImage(session.access_token, session.userId, fichier);
    majEmploye(empId, (e) => ({ ...e, avatarUrl: url }));
  };

  const majLogoEntreprise = async (fichier) => {
    if (!session) return;
    const url = await uploaderImage(session.access_token, session.userId, fichier);
    setLogoUrl(url);
  };

  const definirBureauSurPositionActuelle = async (rayon) => {
    const position = await obtenirPosition();
    setBureau({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      rayon: rayon || 150,
    });
  };

  const majRayonBureau = (rayon) =>
    setBureau((prev) => (prev ? { ...prev, rayon } : prev));

  const retirerBureau = () => setBureau(null);

  const definirBureauSiteSurPositionActuelle = async (site, rayon) => {
    const position = await obtenirPosition();
    setBureaux((prev) => ({
      ...prev,
      [site]: { lat: position.coords.latitude, lng: position.coords.longitude, rayon: rayon || 150 },
    }));
  };

  const majRayonBureauSite = (site, rayon) =>
    setBureaux((prev) => (prev[site] ? { ...prev, [site]: { ...prev[site], rayon } } : prev));

  const retirerBureauSite = (site) =>
    setBureaux((prev) => {
      const suite = { ...prev };
      delete suite[site];
      return suite;
    });

  const payerPlan = async (planId) => {
    if (!session || !rowId) return;
    const res = await fetch("/api/initier-paiement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rowId, planId, email: session.email, nom: session.email }),
    });
    const data = await res.json();
    if (!res.ok || !data.payment_url) {
      throw new Error(data.error || "Impossible de démarrer le paiement pour le moment.");
    }
    window.location.href = data.payment_url;
  };

  // Le rapport journalier est identifié par la date du jour. On crée la
  // ligne à la volée dès la première modification de la journée, pour ne
  // pas obliger l'employé à "démarrer" un rapport avant de le remplir.
  const majRapportDuJour = (empId, fn) =>
    majEmploye(empId, (e) => {
      const liste = e.rapportsJournaliers || [];
      const d = dateJourISO();
      const idx = liste.findIndex((r) => r.date === d);
      const base = idx >= 0 ? liste[idx] : rapportVide(d);
      const misAJour = fn(base);
      const nouvelleListe =
        idx >= 0
          ? liste.map((r, i) => (i === idx ? misAJour : r))
          : [...liste, misAJour];
      return { ...e, rapportsJournaliers: nouvelleListe };
    });

  const ajouterLignePlanning = (empId, ligne) =>
    majRapportDuJour(empId, (r) => ({
      ...r,
      planning: [...r.planning, { id: Date.now(), ...ligne }],
    }));

  const retirerLignePlanning = (empId, ligneId) =>
    majRapportDuJour(empId, (r) => ({
      ...r,
      planning: r.planning.filter((l) => l.id !== ligneId),
    }));

  const ajouterLigneRealise = (empId, ligne) =>
    majRapportDuJour(empId, (r) => ({
      ...r,
      realise: [...r.realise, { id: Date.now(), ...ligne }],
    }));

  const retirerLigneRealise = (empId, ligneId) =>
    majRapportDuJour(empId, (r) => ({
      ...r,
      realise: r.realise.filter((l) => l.id !== ligneId),
    }));

  const majChampRapport = (empId, champ, valeur) =>
    majRapportDuJour(empId, (r) => ({ ...r, [champ]: valeur }));

  const envoyerRapportDuJour = (empId) =>
    majRapportDuJour(empId, (r) => ({
      ...r,
      envoye: true,
      envoyeLe: new Date().toISOString(),
    }));

  // Contrairement au rapport du jour (toujours celui d'aujourd'hui), le
  // manager peut évaluer un rapport passé : on retrouve la bonne ligne par
  // sa date plutôt que de supposer que c'est celle du jour.
  const evaluerRapport = (empId, dateRapport, { commentaire, note }) => {
    if (gestionGelee) return;
    majEmploye(empId, (e) => {
      enregistrerActivite("Évaluation de rapport journalier", `${e.nom} — ${dateRapport} (${note}/5)`);
      return {
        ...e,
        rapportsJournaliers: (e.rapportsJournaliers || []).map((r) =>
          r.date === dateRapport
            ? { ...r, evaluation: { commentaire, note, evalueLe: new Date().toISOString() } }
            : r
        ),
      };
    });
  };

  // Un seul enregistrement de pointage par jour (arrivée + départ), plutôt
  // qu'un champ unique qui restait affiché indéfiniment une fois pointé.
  // Accepte un ou plusieurs champs à la fois (ex: arrivée + infos mission).
  const enregistrerPointage = (id, champs) =>
    majEmploye(id, (e) => {
      const liste = e.historiquePointage || [];
      const d = dateJourISO();
      const idx = liste.findIndex((p) => p.date === d);
      if (idx >= 0) {
        const maj = { ...liste[idx], ...champs };
        return { ...e, historiquePointage: liste.map((p, i) => (i === idx ? maj : p)) };
      }
      return { ...e, historiquePointage: [...liste, { date: d, ...champs }] };
    });

  // Un retard déjà enregistré (calculé automatiquement à partir du
  // pointage réel) peut être expliqué par l'employé, puis accepté ou
  // refusé par le manager — la donnée factuelle (l'heure d'arrivée) ne
  // change jamais, seul son statut « justifié » ou non est ajouté.
  const justifierRetard = (id, justification) =>
    enregistrerPointage(id, { justificationRetard: justification, statutRetard: "en_attente" });

  const traiterJustificationRetard = (empId, statut) => {
    enregistrerActivite(
      statut === "acceptee" ? "Retard justifié accepté" : "Retard justifié refusé",
      employes.find((e) => e.id === empId)?.nom || ""
    );
    enregistrerPointage(empId, { statutRetard: statut });
  };

  // Absence justifiée : distincte du pointage en mission (qui suppose que
  // l'employé travaille, juste ailleurs). Ici l'employé signale qu'il ne
  // sera pas présent du tout, avec un motif, que le manager valide.
  const declarerAbsence = (empId, { date, motif, commentaire }) =>
    majEmploye(empId, (e) => ({
      ...e,
      absences: [
        ...(e.absences || []),
        { id: Date.now(), date, motif, commentaire, statut: "en_attente", declareeLe: new Date().toISOString() },
      ],
    }));

  const traiterAbsence = (empId, absenceId, statut) =>
    majEmploye(empId, (e) => {
      const absence = (e.absences || []).find((a) => a.id === absenceId);
      enregistrerActivite(
        statut === "validee" ? "Absence validée" : "Absence refusée",
        `${e.nom} — ${absence ? absence.motif : ""} (${absence ? absence.date : ""})`
      );
      return {
        ...e,
        absences: (e.absences || []).map((a) => (a.id === absenceId ? { ...a, statut } : a)),
      };
    });

  // Si le manager a configuré la localisation du bureau, le pointage
  // n'est validé que si la position GPS de l'employé est dans le rayon
  // autorisé. Sans configuration, on garde l'ancien comportement (simple
  // clic) pour ne rien casser tant que le manager n'a pas activé l'option.
  // Si l'entreprise a plusieurs sièges et que cet employé est rattaché à
  // l'un d'eux avec un géorepérage configuré, on l'utilise en priorité.
  // Sinon on retombe sur le réglage global de l'entreprise, pour ne rien
  // casser pour les entreprises à siège unique.
  const pointer = async (id) => {
    const h = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const emp = employes.find((e) => e.id === id);
    const bureauSite = sites.length > 1 && emp && emp.site ? bureaux[emp.site] : null;
    const bureauApplicable = bureauSite || bureau;
    const bureauConfigure =
      bureauApplicable && typeof bureauApplicable.lat === "number" && typeof bureauApplicable.lng === "number";
    // Le retard est déterminé et figé au moment même du pointage — avec
    // l'heure attendue en vigueur ce jour-là, pas celle d'aujourd'hui,
    // pour que les archives restent honnêtes même si ce réglage change.
    const enRetard = !!(heureArrivee && h > heureArrivee);

    if (!bureauConfigure) {
      enregistrerPointage(id, { arrivee: h, enRetard });
      return { ok: true };
    }

    try {
      const position = await obtenirPosition();
      const distance = distanceMetres(
        position.coords.latitude,
        position.coords.longitude,
        bureauApplicable.lat,
        bureauApplicable.lng
      );
      const rayon = bureauApplicable.rayon || 150;
      if (distance > rayon) {
        return {
          ok: false,
          message: `Vous semblez être à ${Math.round(distance)} m du bureau (rayon autorisé : ${rayon} m). Rapprochez-vous pour pointer.`,
        };
      }
      enregistrerPointage(id, { arrivee: h, enRetard });
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message:
          err && err.code === 1
            ? "Vous devez autoriser la localisation dans votre navigateur pour pointer votre arrivée."
            : "Impossible d'obtenir votre position. Vérifiez que le GPS est activé et réessayez.",
      };
    }
  };

  const pointerDepart = (id) => {
    const h = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    enregistrerPointage(id, { depart: h });
    return { ok: true };
  };

  // Pointage en mission : pas de vérification de rayon par rapport au
  // bureau (par définition, l'employé n'est pas censé y être), mais lieu,
  // justification ET position GPS activée par l'employé lui-même sont
  // obligatoires — sinon rien ne garantit qu'il est vraiment où il le dit.
  const pointerEnMission = (id, { lieu, justification, coordsMission }) => {
    const h = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    enregistrerPointage(id, {
      arrivee: h,
      enMission: true,
      lieuMission: lieu,
      justificationMission: justification,
      coordsMission,
    });
    return { ok: true };
  };

  const majHeureArrivee = (heure) => setHeureArrivee(heure);
  const majHeureDepart = (heure) => setHeureDepart(heure);

  const majMonMotDePasse = async (nouveauMdp) => {
    if (!session) return;
    await changerMotDePasse(session.access_token, nouveauMdp);
  };

  const declarer = (empId, tacheId) =>
    majEmploye(empId, (e) => ({
      ...e,
      taches: e.taches.map((t) =>
        t.id === tacheId ? { ...t, statut: "en_attente", declareLe: new Date().toISOString() } : t
      ),
    }));

  const valider = (empId, tacheId, commentaireManager) => {
    if (gestionGelee) return;
    majEmploye(empId, (e) => {
      const tache = e.taches.find((t) => t.id === tacheId);
      const dansLesDelais = tache?.echeance && new Date() <= new Date(tache.echeance);
      const nouveauxPoints = [
        { id: Date.now(), libelle: `Tâche « ${tache?.titre} » validée`, points: 10 },
      ];
      if (dansLesDelais) {
        nouveauxPoints.push({
          id: Date.now() + 1,
          libelle: "Terminée avant délai",
          points: 5,
        });
      }
      enregistrerActivite("Validation de tâche", `« ${tache?.titre} » pour ${e.nom}`);
      envoyerNotification(
        e.email,
        `Tâche validée : ${tache?.titre || ""}`,
        "Votre tâche a été validée ✅",
        `<p>Bonjour ${e.nom.split(" ")[0]},</p>
        <p>Votre manager a validé <strong>${tache?.titre || "votre tâche"}</strong>.</p>
        ${commentaireManager ? `<p>Commentaire : « ${commentaireManager} »</p>` : ""}`
      );
      return {
        ...e,
        taches: e.taches.map((t) =>
          t.id === tacheId
            ? { ...t, statut: "validee", commentaireManager, valideeLe: new Date().toISOString() }
            : t
        ),
        journalPoints: [...(e.journalPoints || []), ...nouveauxPoints],
      };
    });
  };

  const rejeter = (empId, tacheId, commentaireManager) => {
    if (gestionGelee) return;
    majEmploye(empId, (e) => {
      const tache = e.taches.find((t) => t.id === tacheId);
      enregistrerActivite("Rejet de tâche", `« ${tache?.titre} » pour ${e.nom}`);
      envoyerNotification(
        e.email,
        `Tâche à revoir : ${tache?.titre || ""}`,
        "Votre tâche a été renvoyée",
        `<p>Bonjour ${e.nom.split(" ")[0]},</p>
        <p>Votre manager a renvoyé <strong>${tache?.titre || "votre tâche"}</strong> — elle repasse « à faire ».</p>
        ${commentaireManager ? `<p>Commentaire : « ${commentaireManager} »</p>` : ""}`
      );
      return {
        ...e,
        taches: e.taches.map((t) =>
          t.id === tacheId ? { ...t, statut: "a_faire", commentaireManager } : t
        ),
      };
    });
  };

  // Motif de blocage : l'employé indique pourquoi une tâche en retard
  // n'avance pas. Sert uniquement au diagnostic (pas de conséquence sur le
  // score) — c'est l'entreprise qu'on cherche à comprendre, pas à évaluer
  // davantage l'employé.
  const signalerBlocage = (empId, tacheId, motif) =>
    majEmploye(empId, (e) => ({
      ...e,
      taches: e.taches.map((t) => (t.id === tacheId ? { ...t, blocage: motif } : t)),
    }));

  const majBilan = (id, champ, valeur) => majEmploye(id, (e) => ({ ...e, [champ]: valeur }));

  const validerBilan = (empId) =>
    majEmploye(empId, (e) => {
      const nouveauxPoints = [];
      const aujourdHui = new Date();

      if (e.equipe) {
        nouveauxPoints.push({
          id: Date.now() + Math.random(),
          libelle: "Collaboration sur une tâche collective",
          points: 5,
        });
      }
      const tachesEnRetard = e.taches.filter(
        (t) => t.statut !== "validee" && t.echeance && new Date(t.echeance) < aujourdHui
      );
      tachesEnRetard.forEach((t) => {
        nouveauxPoints.push({
          id: Date.now() + Math.random(),
          libelle: `Tâche « ${t.titre} » en retard`,
          points: -5,
        });
      });
      if (e.taches.length > 0 && e.taches.every((t) => t.statut === "validee")) {
        nouveauxPoints.push({
          id: Date.now() + Math.random(),
          libelle: "Tous les objectifs atteints ce mois-ci",
          points: 15,
        });
      }

      return {
        ...e,
        journalPoints: [...(e.journalPoints || []), ...nouveauxPoints],
      };
    });

  const ajouterEmploye = (nom, dept, email) => {
    const initiales = nom
      .split(" ")
      .map((m) => m[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const nouvel = {
      id: Date.now(),
      nom,
      dept,
      email,
      initiales,
      historiquePointage: [],
      taches: [],
      retards: 0,
      equipe: false,
      notesPairs: [],
      contestations: [],
      journalPoints: [],
      rapportsJournaliers: [],
      avatarUrl: "",
      site: siteActif && siteActif !== "__comparaison__" ? siteActif : "",
      retardsTotalVie: 0,
    initiatives: [],
      avertissements: [],
      absences: [],
      objectifs: [],
      entretiens: [],
      parcours: [],
      dateEntree: null,
    };
    enregistrerActivite("Ajout d'employé", `${nom} (${dept})`);
    setEmployes((prev) => [...prev, nouvel]);
    if (email) {
      envoyerNotification(
        email,
        `${nomEntreprise || "Votre entreprise"} vous a ajouté sur BossClever`,
        "Bienvenue sur BossClever",
        `<p>Bonjour ${nom.split(" ")[0]},</p>
        <p>${nomEntreprise || "Votre entreprise"} vous a ajouté comme employé sur BossClever.</p>
        <p>Pour créer votre compte, rendez-vous sur <a href="https://bossclever.vercel.app" style="color:#1877F2;">bossclever.vercel.app</a>, choisissez « Employé », et utilisez ce code entreprise :</p>
        <p style="font-size:20px;font-weight:700;color:#0F4FA8;letter-spacing:1px;background:#E7F0FE;border-radius:8px;padding:10px 16px;display:inline-block;">${codeEntreprise}</p>`
      );
    }
  };

  const supprimerEmploye = (empId) => {
    const cible = employes.find((e) => e.id === empId);
    enregistrerActivite("Retrait d'employé", cible ? cible.nom : "");
    setEmployes((prev) => prev.filter((e) => e.id !== empId));
    if (session) supprimerLienEmploye(session.access_token, empId).catch(() => {});
  };

  const assigner = (empId, titre, echeance, priorite, objectifId) =>
    majEmploye(empId, (e) => {
      envoyerNotification(
        e.email,
        `Nouvelle tâche : ${titre}`,
        "Une nouvelle tâche vous a été assignée",
        `<p>Bonjour ${e.nom.split(" ")[0]},</p>
        <p><strong>${titre}</strong> vous a été assignée${
          echeance ? ` avec une échéance au ${new Date(echeance).toLocaleDateString("fr-FR")}` : ""
        }.</p>
        <p>Connectez-vous sur BossClever pour voir le détail dans « Mes tâches ».</p>`
      );
      return {
        ...e,
        taches: [
          ...e.taches,
          {
            id: Date.now(),
            titre,
            statut: "a_faire",
            commentaire: "",
            echeance,
            priorite,
            objectifId: objectifId || null,
          },
        ],
      };
    });

  // Supprimer une tâche assignée depuis l'espace manager.
  // La suppression passe par majEmploye afin de conserver le même mécanisme
  // de sauvegarde que les autres modifications d'un employé.
  const supprimerTache = (empId, tacheId) => {
    const emp = employes.find((e) => e.id === empId);
    const tache = emp?.taches?.find((t) => t.id === tacheId);
    if (!emp || !tache) return;

    const confirme = window.confirm(
      `Supprimer définitivement la tâche « ${tache.titre} » assignée à ${emp.nom} ?`
    );
    if (!confirme) return;

    enregistrerActivite("Suppression de tâche", `« ${tache.titre} » pour ${emp.nom}`);

    majEmploye(empId, (e) => ({
      ...e,
      taches: (e.taches || []).filter((t) => t.id !== tacheId),
    }));
  };

  // Un objectif fixé par le manager pour un employé — distinct des
  // tâches. S'il n'a aucune tâche rattachée, son statut se règle à la
  // main (objectif qualitatif) ; sinon il est atteint automatiquement
  // dès que toutes les tâches qui lui sont liées sont validées.
  const ajouterObjectif = (empId, { titre, echeance }) =>
    majEmploye(empId, (e) => ({
      ...e,
      objectifs: [
        ...(e.objectifs || []),
        { id: Date.now(), titre, echeance, statutManuel: null },
      ],
    }));

  const retirerObjectif = (empId, objectifId) =>
    majEmploye(empId, (e) => ({
      ...e,
      objectifs: (e.objectifs || []).filter((o) => o.id !== objectifId),
      taches: e.taches.map((t) => (t.objectifId === objectifId ? { ...t, objectifId: null } : t)),
    }));

  const marquerObjectifManuel = (empId, objectifId, statutManuel) =>
    majEmploye(empId, (e) => ({
      ...e,
      objectifs: (e.objectifs || []).map((o) =>
        o.id === objectifId ? { ...o, statutManuel } : o
      ),
    }));

  // Le mur de reconnaissance est volontairement séparé de la notation
  // entre pairs (qui reste anonyme et alimente le score) : ici, chacun
  // signe de son nom, c'est public, et ça ne compte jamais dans aucun
  // calcul — juste un espace pour dire merci.
  const posterFelicitation = ({ deId, deNom, aId, aNom, message }) =>
    setFelicitations((prev) => [
      { id: Date.now(), deId: deId || null, deNom, aId, aNom, message, date: new Date().toISOString(), likes: [] },
      ...prev,
    ]);

  const aimerFelicitation = (felicitationId, parId) =>
    setFelicitations((prev) =>
      prev.map((f) => {
        if (f.id !== felicitationId) return f;
        const dejaAime = (f.likes || []).includes(parId);
        return {
          ...f,
          likes: dejaAime ? f.likes.filter((id) => id !== parId) : [...(f.likes || []), parId],
        };
      })
    );

  // Un entretien passe par 3 étapes, dans cet ordre strict : le manager le
  // lance pour une période donnée, l'employé remplit sa propre
  // auto-évaluation, puis le manager remplit la sienne et clôture — à
  // partir de là, l'entretien est figé et rejoint l'historique.
  const lancerEntretien = (empId, periode) =>
    majEmploye(empId, (e) => ({
      ...e,
      entretiens: [
        ...(e.entretiens || []),
        {
          id: Date.now(),
          periode,
          statut: "en_attente_auto_eval",
          dateCreation: new Date().toISOString(),
          autoEvaluation: null,
          evaluationManager: null,
        },
      ],
    }));

  const soumettreAutoEvaluation = (empId, entretienId, autoEvaluation) =>
    majEmploye(empId, (e) => ({
      ...e,
      entretiens: (e.entretiens || []).map((ent) =>
        ent.id === entretienId
          ? { ...ent, autoEvaluation, statut: "en_attente_manager" }
          : ent
      ),
    }));

  const soumettreEvaluationManager = (empId, entretienId, evaluationManager) =>
    majEmploye(empId, (e) => {
      const entretien = (e.entretiens || []).find((ent) => ent.id === entretienId);
      enregistrerActivite(
        "Entretien de performance clôturé",
        `${e.nom} — ${entretien ? entretien.periode : ""}`
      );
      return {
        ...e,
        entretiens: (e.entretiens || []).map((ent) =>
          ent.id === entretienId
            ? { ...ent, evaluationManager, statut: "termine", dateCloture: new Date().toISOString() }
            : ent
        ),
      };
    });

  const noterCollegue = (id, note) =>
    majEmploye(id, (e) => ({ ...e, notesPairs: [...e.notesPairs, note] }));

  const contester = (empId, sujet, motif) =>
    majEmploye(empId, (e) => ({
      ...e,
      contestations: [
        ...(e.contestations || []),
        { id: Date.now(), sujet, motif, statut: "en_attente" },
      ],
    }));

  const resoudreContestation = (empId, contestId, reponse) => {
    if (gestionGelee) return;
    majEmploye(empId, (e) => {
      const contestation = e.contestations.find((c) => c.id === contestId);
      enregistrerActivite("Résolution de contestation", `« ${contestation?.sujet || ""} » de ${e.nom}`);
      return {
        ...e,
        contestations: e.contestations.map((c) =>
          c.id === contestId ? { ...c, statut: "resolue", reponse } : c
        ),
      };
    });
  };

  // Recherche robuste de l’employé connecté : Supabase peut renvoyer l’ID
  // sous forme de chaîne alors que l’ID stocké dans les données est numérique.
  // En secours, on retrouve aussi la fiche via l’email du compte connecté.
  const employeActif =
    employes.find((e) => String(e.id) === String(employeActifId)) ||
    employes.find(
      (e) =>
        e.email &&
        session?.email &&
        e.email.toLowerCase().trim() === session.email.toLowerCase().trim()
    ) ||
    null;

  const autres = employes.filter(
    (e) => !employeActif || String(e.id) !== String(employeActif.id)
  );

  const { gele: gestionGelee, exces: excesPlan, planActuel: infoPlanActuel } = calculerDepassementPlan(
    plan,
    employes,
    administrateurs
  );

  if (pageLegaleActive === "contact") {
    return (
      <PageContact
        onRetour={() => {
          window.location.hash = "";
          setPageLegaleActive(null);
        }}
      />
    );
  }

  if (
    pageLegaleActive === "regles-manager" ||
    pageLegaleActive === "declaration-validation" ||
    pageLegaleActive === "calcul-score" ||
    pageLegaleActive === "14-criteres" ||
    pageLegaleActive === "six-piliers" ||
    pageLegaleActive === "co-administrateurs"
  ) {
    return (
      <PageEtape
        etape={pageLegaleActive}
        onRetour={() => {
          window.location.hash = "";
          setPageLegaleActive(null);
        }}
      />
    );
  }

  if (pageLegaleActive) {
    return (
      <PageLegale
        page={pageLegaleActive}
        onRetour={() => {
          window.location.hash = "";
          setPageLegaleActive(null);
        }}
      />
    );
  }

  if (verificationLien) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#5F5E5A", fontSize: 14 }}>
        Connexion en cours…
      </div>
    );
  }

  if (modeRecuperation && session) {
    return (
      <EcranNouveauMotDePasse
        accessToken={session.access_token}
        onTermine={() => setModeRecuperation(false)}
      />
    );
  }

  if (!session) {
    if (!landingVu) {
      return <LandingPage onEntrer={() => setLandingVu(true)} />;
    }
    if (!roleDeclare) {
      return <EcranChoixRole onChoisir={setRoleDeclare} onRetourAccueil={() => setLandingVu(false)} />;
    }
    return (
      <EcranConnexion
        onConnecte={setSession}
        roleDeclare={roleDeclare}
        onRetour={() => setRoleDeclare(null)}
      />
    );
  }

  if (accesRefuse) {
    return (
      <div
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          maxWidth: 380,
          margin: "4rem auto",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 28, margin: "0 0 12px" }}>🚫</p>
        <h2 style={{ fontSize: 17, fontWeight: 500, margin: "0 0 10px" }}>Accès refusé</h2>
        <p style={{ fontSize: 14, color: "#5F5E5A", margin: "0 0 20px" }}>
          Accès refusé : soit votre email n'a pas été ajouté par cette entreprise, soit le code
          entreprise saisi est incorrect ou manquant. Vérifiez ces informations auprès de votre
          manager avant de réessayer.
        </p>
        <button
          onClick={() => {
            setAccesRefuse(false);
            setSession(null);
            setRoleDeclare(null);
          }}
          style={{
            background: "#1877F2",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  if (chargement) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#5F5E5A", fontSize: 14 }}>
        Chargement des données…
      </div>
    );
  }

  // Sécurité anti-page-blanche : si le compte est bien authentifié comme
  // employé mais que sa fiche n’est pas retrouvée, on affiche une erreur
  // explicite au lieu de laisser VueEmploye planter avec une valeur undefined.
  if (role === "employe" && !employeActif) {
    return (
      <div
        style={{
          maxWidth: 520,
          margin: "80px auto",
          padding: 30,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 10 }}>Compte employé introuvable</h2>
        <p style={{ color: "#5F5E5A", lineHeight: 1.6 }}>
          Votre compte est bien connecté, mais BossClever ne retrouve pas votre fiche employé
          dans cette entreprise. Vérifiez auprès de votre manager que votre email est correctement
          associé à votre fiche.
        </p>
        <button
          onClick={() => {
            setSession(null);
            setRoleDeclare(null);
          }}
          style={{
            marginTop: 20,
            background: "#1877F2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          Retour à la connexion
        </button>
      </div>
    );
  }

  if (role === "manager" && sites.length > 1 && !siteActif) {
    return (
      <SelecteurSiege
        sites={sites}
        onChoisir={setSiteActif}
        onComparaison={() => setSiteActif("__comparaison__")}
        onDeconnexion={() => {
          setSession(null);
          setRoleDeclare(null);
        }}
      />
    );
  }

  if (siteActif === "__comparaison__") {
    return (
      <VueComparaisonSites
        employes={employes}
        criteres={criteres}
        onRetour={() => setSiteActif(null)}
      />
    );
  }

  return (
    <div style={{ background: "#F4F1E8", minHeight: "100vh" }}>
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        maxWidth: 1400,
        margin: "0 auto",
        padding: "1.5rem",
        color: "#2C2C2A",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "#1877F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 3, background: "#FFD93B" }} />
        </div>
        <span style={{ fontSize: 17, fontWeight: 500 }}>BossClever</span>
        {role === "manager" && (
          <span
            onClick={() => setAfficherAbonnementRapide((v) => !v)}
            style={{
              marginLeft: "auto",
              fontSize: 13,
              color: "#1877F2",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Mon abonnement
          </span>
        )}
        <span
          onClick={() => {
            setSession(null);
            setRoleDeclare(null);
          }}
          style={{
            marginLeft: role === "manager" ? 16 : "auto",
            fontSize: 13,
            color: "#5F5E5A",
            cursor: "pointer",
          }}
        >
          Se déconnecter
        </span>
      </div>

      {role === "manager" &&
        abonnement &&
        (() => {
          const joursRestants = abonnement.expireLe
            ? Math.ceil((new Date(abonnement.expireLe) - new Date()) / (1000 * 60 * 60 * 24))
            : null;
          if (abonnement.statut === "expire") {
            return (
              <Alerte tone="warning">
                Votre abonnement a expiré le {new Date(abonnement.expireLe).toLocaleDateString("fr-FR")} —
                l'entreprise est repassée automatiquement au plan Découverte.{" "}
                <span
                  onClick={() => setAfficherAbonnementRapide(true)}
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  Renouveler
                </span>
              </Alerte>
            );
          }
          if (abonnement.statut === "actif" && joursRestants !== null && joursRestants <= 5) {
            return (
              <Alerte tone="accent">
                Votre abonnement expire {joursRestants > 0 ? `dans ${joursRestants} jour${joursRestants > 1 ? "s" : ""}` : "aujourd'hui"}.{" "}
                <span
                  onClick={() => setAfficherAbonnementRapide(true)}
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  Renouveler
                </span>
              </Alerte>
            );
          }
          return null;
        })()}

      {role === "manager" && gestionGelee && (
        <Alerte tone="warning">
          Votre équipe ({employes.length} employé{employes.length > 1 ? "s" : ""}
          {administrateurs.length > 0 ? `, ${administrateurs.length} co-administrateur${administrateurs.length > 1 ? "s" : ""}` : ""}
          ) dépasse les limites du plan {infoPlanActuel.nom}. La validation des tâches, initiatives,
          rapports et contestations est suspendue jusqu'au renouvellement — les employés continuent
          de pointer et déclarer leurs tâches normalement.{" "}
          <span
            onClick={() => setAfficherAbonnementRapide(true)}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Voir les plans
          </span>
        </Alerte>
      )}

      {role === "manager" && afficherAbonnementRapide && (
        <div
          style={{
            border: "1px solid #E5E3DA",
            borderRadius: 10,
            padding: "14px 16px",
            marginBottom: 20,
            background: "#FAF9F5",
          }}
        >
          <GestionAbonnement planActuel={plan} abonnement={abonnement} onChoisir={setPlan} onPayer={payerPlan} />
        </div>
      )}

      {erreurChargement && (
        <div
          style={{
            background: "#FCE4E1",
            color: "#993C1D",
            border: "1px solid #F3B8AE",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          ⚠️ {erreurChargement}
        </div>
      )}

      {retourPaiement && (
        <div
          style={{
            background: "#E7F0FE",
            color: "#0F4FA8",
            border: "1px solid #C7DBFB",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          Merci ! Votre paiement est en cours de confirmation — votre abonnement sera activé
          automatiquement dans la minute qui suit. Rafraîchissez la page si besoin.
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        {role === "employe" && employeActif && (
          <>
            <ChampAvatar
              label={employeActif.avatarUrl ? "Changer ma photo" : "Ajouter ma photo"}
              url={employeActif.avatarUrl}
              forme="cercle"
              onFichier={(f) => majAvatarEmploye(employeActif.id, f)}
            />
            <p style={{ margin: 0, fontSize: 14, color: "#5F5E5A" }}>
              Espace employé — {employeActif.nom}
            </p>
          </>
        )}
        {role === "manager" && (
          <>
            <ChampAvatar
              label={logoUrl ? "Changer le logo" : "Ajouter le logo de l'entreprise"}
              url={logoUrl}
              forme="carre"
              onFichier={(f) => majLogoEntreprise(f)}
            />
            <p style={{ margin: 0, fontSize: 14, color: "#5F5E5A" }}>Espace manager</p>
          </>
        )}
      </div>

      {role === "manager" ? (
        <VueManager
          employes={
            siteActif && siteActif !== "__comparaison__"
              ? employes.filter((e) => e.site === siteActif)
              : employes
          }
          valider={valider}
          rejeter={rejeter}
          assigner={assigner}
          criteres={criteres}
          setCriteres={setCriteres}
          resoudreContestation={resoudreContestation}
          ajouterEmploye={ajouterEmploye}
          supprimerEmploye={supprimerEmploye}
          codeEntreprise={codeEntreprise}
          evaluerRapport={evaluerRapport}
          estPrincipal={estPrincipal}
          peutFaire={peutFaire}
          administrateurs={administrateurs}
          ajouterAdministrateur={ajouterAdministrateur}
          retirerAdministrateur={retirerAdministrateur}
          bureau={bureau}
          definirBureauSurPositionActuelle={definirBureauSurPositionActuelle}
          majRayonBureau={majRayonBureau}
          retirerBureau={retirerBureau}
          majDateEntree={majDateEntree}
          ajouterEtapeParcours={ajouterEtapeParcours}
          retirerEtapeParcours={retirerEtapeParcours}
          ajouterAvertissement={ajouterAvertissement}
          retirerAvertissement={retirerAvertissement}
          heureArrivee={heureArrivee}
          majHeureArrivee={majHeureArrivee}
          heureDepart={heureDepart}
          majHeureDepart={majHeureDepart}
          majMonMotDePasse={majMonMotDePasse}
          validerInitiative={validerInitiative}
          rejeterInitiative={rejeterInitiative}
          journalActivite={journalActivite}
          majSite={majSite}
          sites={sites}
          siteActif={siteActif}
          onChangerSiege={() => setSiteActif(null)}
          ajouterSiteEntreprise={ajouterSiteEntreprise}
          renommerSiteEntreprise={renommerSiteEntreprise}
          supprimerSiteEntreprise={supprimerSiteEntreprise}
          bureaux={bureaux}
          definirBureauSiteSurPositionActuelle={definirBureauSiteSurPositionActuelle}
          majRayonBureauSite={majRayonBureauSite}
          retirerBureauSite={retirerBureauSite}
          gestionGelee={gestionGelee}
          traiterJustificationRetard={traiterJustificationRetard}
          traiterAbsence={traiterAbsence}
          ajouterObjectif={ajouterObjectif}
          retirerObjectif={retirerObjectif}
          marquerObjectifManuel={marquerObjectifManuel}
          session={session}
          monIdentite={monIdentite}
          nomEntreprise={nomEntreprise}
          setNomEntreprise={setNomEntreprise}
          adresseEntreprise={adresseEntreprise}
          setAdresseEntreprise={setAdresseEntreprise}
          felicitations={felicitations}
          posterFelicitation={posterFelicitation}
          aimerFelicitation={aimerFelicitation}
          lancerEntretien={lancerEntretien}
          soumettreEvaluationManager={soumettreEvaluationManager}
        />
      ) : (
        <VueEmploye
          employe={employeActif}
          pointer={pointer}
          pointerDepart={pointerDepart}
          pointerEnMission={pointerEnMission}
          signalerBlocage={signalerBlocage}
          declarer={declarer}
          majBilan={majBilan}
          validerBilan={validerBilan}
          noterCollegue={noterCollegue}
          autres={autres}
          criteres={criteres}
          contester={contester}
          ajouterLignePlanning={ajouterLignePlanning}
          retirerLignePlanning={retirerLignePlanning}
          ajouterLigneRealise={ajouterLigneRealise}
          retirerLigneRealise={retirerLigneRealise}
          majChampRapport={majChampRapport}
          envoyerRapportDuJour={envoyerRapportDuJour}
          majMonMotDePasse={majMonMotDePasse}
          soumettreInitiative={soumettreInitiative}
          heureArrivee={heureArrivee}
          justifierRetard={justifierRetard}
          declarerAbsence={declarerAbsence}
          felicitations={felicitations}
          posterFelicitation={posterFelicitation}
          aimerFelicitation={aimerFelicitation}
          soumettreAutoEvaluation={soumettreAutoEvaluation}
        />
      )}

      <footer
        style={{
          marginTop: 48,
          paddingTop: 32,
          borderTop: "1px solid #E5E3DA",
          fontSize: 13,
          color: "#5F5E5A",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.9fr 0.9fr 0.9fr",
            gap: 28,
            paddingBottom: 24,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: "#1877F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: 3, background: "#FFD93B" }} />
              </div>
              <strong style={{ fontSize: 14, color: "#2C2C2A" }}>BossClever</strong>
            </div>
            <p style={{ margin: 0, lineHeight: 1.6, maxWidth: 280 }}>
              Un score de performance objectif, transparent et contestable — pour que le mérite
              l'emporte sur le favoritisme.
            </p>
          </div>

          <div>
            <p style={{ margin: "0 0 10px", fontSize: 11.5, fontWeight: 600, color: "#5F5E5A", textTransform: "uppercase", letterSpacing: 0.4 }}>
              Produit
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              <a href="https://bossclever.vercel.app/#fonctionnalites" style={{ color: "#5F5E5A", textDecoration: "none" }}>
                Fonctionnalités
              </a>
              <a href="https://bossclever.vercel.app/#tarifs" style={{ color: "#5F5E5A", textDecoration: "none" }}>
                Tarifs
              </a>
              <a href="https://bossclever.vercel.app/#comment-ca-marche" style={{ color: "#5F5E5A", textDecoration: "none" }}>
                Comment ça marche
              </a>
            </div>
          </div>

          <div>
            <p style={{ margin: "0 0 10px", fontSize: 11.5, fontWeight: 600, color: "#5F5E5A", textTransform: "uppercase", letterSpacing: 0.4 }}>
              Contact
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              <a href="mailto:contact@cleverentreprises.com" style={{ color: "#5F5E5A", textDecoration: "none" }}>
                contact@cleverentreprises.com
              </a>
              <a href="tel:+2250702354211" style={{ color: "#5F5E5A", textDecoration: "none" }}>
                +225 07 02 35 42 11
              </a>
              <span>Cocody Riviera Faya, Abidjan</span>
            </div>
          </div>

          <div>
            <p style={{ margin: "0 0 10px", fontSize: 11.5, fontWeight: 600, color: "#5F5E5A", textTransform: "uppercase", letterSpacing: 0.4 }}>
              Légal
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              <a href="https://bossclever.vercel.app/#cgu" style={{ color: "#5F5E5A", textDecoration: "none" }}>
                Conditions d'utilisation
              </a>
              <a href="https://bossclever.vercel.app/#confidentialite" style={{ color: "#5F5E5A", textDecoration: "none" }}>
                Politique de confidentialité
              </a>
              <a href="mailto:contact@cleverentreprises.com" style={{ color: "#5F5E5A", textDecoration: "none" }}>
                Centre d'aide
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #E5E3DA",
            paddingTop: 16,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            fontSize: 12.5,
          }}
        >
          <span>© {new Date().getFullYear()} Clever Entreprises — tous droits réservés</span>
          <span>
            BossClever est un produit de{" "}
            <a
              href="https://cleverentreprises.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0F4FA8", textDecoration: "none" }}
            >
              Clever Entreprises
            </a>
          </span>
        </div>
      </footer>
    </div>
    </div>
  );
}

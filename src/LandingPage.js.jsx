import { useEffect, useRef } from "react";

// Événements types du "journal des points" réel de l'application — utilisés
// ici pour la maquette animée du hero, afin que la landing montre le vrai
// mécanisme du produit plutôt qu'une illustration abstraite.
const EVENEMENTS_DEMO = [
  { libelle: "Tâche « Rapport mensuel » validée", points: 10 },
  { libelle: "Objectif du trimestre atteint", points: 15 },
  { libelle: "Avis d'un collègue enregistré", points: 5 },
  { libelle: "Initiative proposée validée", points: 8 },
  { libelle: "Retard signalé", points: -4 },
  { libelle: "Tâche terminée avant l'échéance", points: 5 },
  { libelle: "Tous les objectifs du mois atteints", points: 15 },
  { libelle: "Tâche en retard", points: -5 },
];

const CRITERES_GROUPES = [
  {
    titre: "Résultats",
    poids: "47%",
    items: ["Objectifs atteints", "Tâches dans les délais", "Productivité (KPI)", "Deadlines critiques"],
  },
  {
    titre: "Comportement",
    poids: "28%",
    items: ["Ponctualité", "Fiabilité / autonomie", "Adaptabilité", "Communication", "Gestion des erreurs"],
  },
  {
    titre: "Collaboration",
    poids: "25%",
    items: ["Proactivité", "Collaboration", "Feedback des pairs (360°)", "Progression", "Innovation"],
  },
];

const FONCTIONNALITES = [
  {
    titre: "Comptes séparés et cloisonnés",
    texte:
      "Chaque manager et chaque employé a son propre compte. Un manager ne peut ni consulter ni agir depuis le compte d'un employé — pointer, déclarer une tâche ou noter un collègue à sa place.",
  },
  {
    titre: "Droit de contestation",
    texte:
      "Un employé qui juge un résultat injuste peut le contester directement dans l'application. Le manager voit la contestation et doit y répondre.",
  },
  {
    titre: "Avis entre collègues, en toute discrétion",
    texte:
      "La collaboration ne repose pas que sur la parole du manager : les collègues notent aussi, de façon anonyme, l'esprit d'équipe et la communication.",
  },
  {
    titre: "Rapports exportables",
    texte:
      "Classement et détail des critères par employé, exportables en PDF en un clic — utile pour les entretiens annuels et les décisions de promotion.",
  },
  {
    titre: "Rappels automatiques",
    texte:
      "L'application relance : pointage manquant côté employé, tâches ou contestations en attente de validation côté manager.",
  },
  {
    titre: "Code entreprise unique",
    texte:
      "Un code propre à chaque entreprise, à transmettre aux employés. Aucun risque de mélange entre plusieurs équipes ou plusieurs sociétés.",
  },
];

function Ledger() {
  const items = [...EVENEMENTS_DEMO, ...EVENEMENTS_DEMO];
  return (
    <div className="bc-ledger-frame">
      <div className="bc-ledger-head">
        <span>Journal des points</span>
        <span className="bc-ledger-live">● en direct</span>
      </div>
      <div className="bc-ledger-track">
        <div className="bc-ledger-scroll">
          {items.map((ev, i) => (
            <div className="bc-ledger-row" key={i}>
              <span className="bc-ledger-libelle">{ev.libelle}</span>
              <span className={`bc-ledger-pts ${ev.points > 0 ? "pos" : "neg"}`}>
                {ev.points > 0 ? `+${ev.points}` : ev.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({ onEntrer }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (rootRef.current) rootRef.current.scrollTo?.(0, 0);
  }, []);

  return (
    <div ref={rootRef} className="bc-landing">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,560;9..144,680&display=swap');

        .bc-landing {
          --ink: #20231F;
          --muted: #5F5E5A;
          --paper: #FBFAF6;
          --line: #E5E3DA;
          --blue: #1877F2;
          --blue-deep: #0F4FA8;
          --yellow: #FFD93B;
          --green: #0F6E56;
          --red: #993C1D;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: var(--ink);
          background: var(--paper);
        }
        .bc-landing .display {
          font-family: 'Fraunces', Georgia, serif;
        }
        .bc-wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .bc-nav {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 1.25rem 0;
        }
        .bc-logo-mark {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--blue);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .bc-logo-mark span {
          width: 10px;
          height: 10px;
          border-radius: 3px;
          background: var(--yellow);
        }
        .bc-nav-links {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .bc-nav-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
        }
        .bc-nav-links a:hover { color: var(--ink); }
        .bc-btn {
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid var(--line);
          background: #fff;
          color: var(--ink);
          cursor: pointer;
          font-family: inherit;
        }
        .bc-btn:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
        .bc-btn-primary {
          background: var(--blue);
          border-color: var(--blue);
          color: #fff;
        }
        .bc-btn-primary:hover { background: var(--blue-deep); }

        .bc-hero {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 48px;
          align-items: center;
          padding: 3.5rem 0 4.5rem;
        }
        .bc-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--blue-deep);
          background: #E7F0FE;
          border-radius: 20px;
          padding: 5px 12px;
          margin-bottom: 18px;
          font-weight: 500;
        }
        .bc-hero h1 {
          font-size: 44px;
          line-height: 1.08;
          font-weight: 560;
          margin: 0 0 20px;
          letter-spacing: -0.01em;
        }
        .bc-hero h1 em {
          font-style: normal;
          color: var(--blue);
        }
        .bc-hero p.lead {
          font-size: 17px;
          line-height: 1.55;
          color: var(--muted);
          margin: 0 0 28px;
          max-width: 46ch;
        }
        .bc-cta-row { display: flex; gap: 12px; margin-bottom: 14px; }
        .bc-cta-row .bc-btn { padding: 12px 22px; font-size: 15px; }
        .bc-fine-print { font-size: 12.5px; color: var(--muted); }

        .bc-ledger-frame {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 24px 60px -30px rgba(24, 119, 242, 0.35);
        }
        .bc-ledger-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--line);
          font-size: 12.5px;
          color: var(--muted);
        }
        .bc-ledger-live { color: var(--green); font-weight: 500; }
        .bc-ledger-track { height: 300px; overflow: hidden; position: relative; }
        .bc-ledger-track::after {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 78%, #fff 100%);
          pointer-events: none;
        }
        .bc-ledger-scroll {
          animation: bc-scroll 14s linear infinite;
        }
        @keyframes bc-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        .bc-ledger-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 13px 16px;
          border-bottom: 1px solid #F1EFE8;
          font-size: 13.5px;
        }
        .bc-ledger-pts { font-weight: 600; white-space: nowrap; }
        .bc-ledger-pts.pos { color: var(--green); }
        .bc-ledger-pts.neg { color: var(--red); }
        @media (prefers-reduced-motion: reduce) {
          .bc-ledger-scroll { animation: none; }
        }

        .bc-section { padding: 3.5rem 0; border-top: 1px solid var(--line); }
        .bc-section-head { max-width: 56ch; margin-bottom: 2.25rem; }
        .bc-section-head .display {
          font-size: 28px;
          font-weight: 560;
          margin: 0 0 10px;
        }
        .bc-section-head p { color: var(--muted); font-size: 15px; line-height: 1.55; margin: 0; }

        .bc-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .bc-step-num {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 30px;
          color: var(--blue);
          margin-bottom: 10px;
        }
        .bc-step h3 { font-size: 16px; margin: 0 0 8px; }
        .bc-step p { font-size: 14px; color: var(--muted); line-height: 1.5; margin: 0; }

        .bc-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .bc-feature-card {
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 1.25rem;
          background: #fff;
        }
        .bc-feature-card h3 { font-size: 15px; margin: 0 0 8px; }
        .bc-feature-card p { font-size: 13.5px; color: var(--muted); line-height: 1.5; margin: 0; }

        .bc-criteres { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .bc-critere-col {
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 1.25rem;
        }
        .bc-critere-col .top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
        .bc-critere-col .top h3 { font-size: 15px; margin: 0; }
        .bc-critere-col .top span { font-size: 13px; color: var(--blue-deep); font-weight: 600; }
        .bc-critere-col ul { margin: 0; padding: 0; list-style: none; }
        .bc-critere-col li {
          font-size: 13.5px;
          color: var(--muted);
          padding: 7px 0;
          border-top: 1px solid #F1EFE8;
        }
        .bc-critere-col li:first-child { border-top: none; }

        .bc-final {
          background: var(--ink);
          color: #fff;
          border-radius: 18px;
          padding: 3rem 2.5rem;
          text-align: center;
          margin: 1rem 0 3rem;
        }
        .bc-final h2 { font-size: 26px; font-weight: 560; margin: 0 0 12px; }
        .bc-final p { color: #C7C6C0; font-size: 15px; margin: 0 0 24px; }
        .bc-final .bc-btn-primary { padding: 12px 26px; font-size: 15px; }

        .bc-footer {
          border-top: 1px solid var(--line);
          padding: 2.5rem 0 2rem;
          font-size: 13.5px;
          color: var(--muted);
        }
        .bc-footer-top {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 32px;
          padding-bottom: 1.75rem;
        }
        .bc-footer-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .bc-footer-brand strong { font-size: 15px; color: var(--ink); }
        .bc-footer p { margin: 0 0 4px; line-height: 1.6; }
        .bc-footer-signature {
          font-size: 13px;
          color: var(--muted);
        }
        .bc-footer-signature a {
          color: var(--blue-deep);
          text-decoration: none;
          font-weight: 500;
        }
        .bc-footer-signature a:hover { text-decoration: underline; }
        .bc-footer-contact h4 {
          font-size: 11.5px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--muted);
          margin: 0 0 10px;
          font-weight: 600;
        }
        .bc-footer-bottom {
          border-top: 1px solid var(--line);
          padding-top: 1.25rem;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 12.5px;
        }

        @media (max-width: 860px) {
          .bc-hero { grid-template-columns: 1fr; padding-top: 2rem; }
          .bc-hero h1 { font-size: 32px; }
          .bc-nav-links { display: none; }
          .bc-steps, .bc-features, .bc-criteres { grid-template-columns: 1fr; }
          .bc-final { padding: 2.25rem 1.5rem; }
          .bc-footer-top { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="bc-wrap">
        <nav className="bc-nav">
          <div className="bc-logo-mark"><span /></div>
          <strong style={{ fontSize: 16 }}>BossClever</strong>
          <div className="bc-nav-links">
            <a href="#comment-ca-marche">Comment ça marche</a>
            <a href="#fonctionnalites">Fonctionnalités</a>
            <a href="#criteres">Critères</a>
            <button className="bc-btn" onClick={onEntrer}>Se connecter</button>
          </div>
        </nav>

        <header className="bc-hero">
          <div>
            <span className="bc-eyebrow">🏆 Fini le favoritisme au bureau</span>
            <h1 className="display">
              Le <em>mérite</em>, pas le ressenti du manager.
            </h1>
            <p className="lead">
              BossClever évalue la performance de vos employés sur des faits, pas
              sur des impressions : objectifs atteints, ponctualité, avis des
              collègues. Un score transparent, calculé automatiquement, que
              chacun peut consulter et contester.
            </p>
            <div className="bc-cta-row">
              <button className="bc-btn bc-btn-primary" onClick={onEntrer}>
                Créer un compte manager
              </button>
              <button className="bc-btn" onClick={onEntrer}>
                J'ai déjà un compte
              </button>
            </div>
            <p className="bc-fine-print">Gratuit pour démarrer · aucune carte bancaire requise</p>
          </div>
          <Ledger />
        </header>
      </div>

      <div className="bc-wrap">
        <section className="bc-section" id="comment-ca-marche">
          <div className="bc-section-head">
            <h2 className="display">Comment ça marche</h2>
            <p>
              Trois étapes, chaque semaine — sans feuille Excel, sans réunion
              pour trancher qui a été le meilleur.
            </p>
          </div>
          <div className="bc-steps">
            <div className="bc-step">
              <div className="bc-step-num">01</div>
              <h3>Le manager fixe les règles</h3>
              <p>
                Objectifs et tâches de la semaine pour chaque employé, poids des
                critères de notation — tout est configuré et visible par
                l'équipe.
              </p>
            </div>
            <div className="bc-step">
              <div className="bc-step-num">02</div>
              <h3>L'employé déclare, le manager valide</h3>
              <p>
                Pointage vérifié par géolocalisation, tâches déclarées
                accomplies, bilan hebdomadaire. Le manager valide chaque
                élément avant qu'il ne compte dans le score.
              </p>
            </div>
            <div className="bc-step">
              <div className="bc-step-num">03</div>
              <h3>Le score se calcule tout seul</h3>
              <p>
                Un score sur 100, un journal de points transparent, un
                classement mensuel avec médailles pour le trio de tête.
              </p>
            </div>
          </div>
        </section>

        <section className="bc-section" id="fonctionnalites">
          <div className="bc-section-head">
            <h2 className="display">Construit pour la confiance</h2>
            <p>
              Un outil de notation n'a de valeur que si personne, y compris le
              manager, ne peut le manipuler.
            </p>
          </div>
          <div className="bc-features">
            {FONCTIONNALITES.map((f) => (
              <div className="bc-feature-card" key={f.titre}>
                <h3>{f.titre}</h3>
                <p>{f.texte}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bc-section" id="criteres">
          <div className="bc-section-head">
            <h2 className="display">14 critères, un score sur 100</h2>
            <p>
              Chaque entreprise peut ajuster les poids, mais la structure reste
              la même pour tout le monde : résultats, comportement,
              collaboration.
            </p>
          </div>
          <div className="bc-criteres">
            {CRITERES_GROUPES.map((g) => (
              <div className="bc-critere-col" key={g.titre}>
                <div className="top">
                  <h3>{g.titre}</h3>
                  <span>{g.poids}</span>
                </div>
                <ul>
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="bc-final">
          <h2 className="display">Prêt à objectiver vos décisions ?</h2>
          <p>Créez le compte de votre entreprise en moins de deux minutes.</p>
          <button className="bc-btn bc-btn-primary" onClick={onEntrer}>
            Créer mon compte
          </button>
        </div>

        <footer className="bc-footer">
          <div className="bc-footer-top">
            <div>
              <div className="bc-footer-brand">
                <div className="bc-logo-mark"><span /></div>
                <strong>BossClever</strong>
              </div>
              <p>
                Un score de performance objectif, transparent et contestable —
                pour que le mérite l'emporte sur le favoritisme.
              </p>
              <p className="bc-footer-signature">
                Développé par{" "}
                <a href="https://cleverentreprises.com/" target="_blank" rel="noopener noreferrer">
                  Clever Entreprises
                </a>
              </p>
            </div>
            <div className="bc-footer-contact">
              <h4>Nous contacter</h4>
              <p>Cocody Riviera Faya, Abidjan, Côte d'Ivoire</p>
              <p>
                <a href="tel:+2250702354211" style={{ color: "inherit", textDecoration: "none" }}>
                  +225 07 02 35 42 11
                </a>{" "}
                (mobile) ·{" "}
                <a href="tel:+225272240702" style={{ color: "inherit", textDecoration: "none" }}>
                  +225 27 22 40 07 02
                </a>{" "}
                (fixe)
              </p>
              <p>
                <a href="mailto:contact@cleverentreprises.com" style={{ color: "inherit", textDecoration: "none" }}>
                  contact@cleverentreprises.com
                </a>
              </p>
            </div>
          </div>
          <div className="bc-footer-bottom">
            <span>© {new Date().getFullYear()} Clever Entreprises — tous droits réservés</span>
            <span>BossClever est un produit de Clever Entreprises</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

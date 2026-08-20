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

function IPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function IClipboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ITrend() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 17 9.5 10.5 13.5 14.5 21 6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3.5 19 6.5v5c0 5-3 8.3-7 9.9-4-1.6-7-4.9-7-9.9v-5L12 3.5Z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IPeople() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.7-3 2.9-5 5.5-5s4.8 2 5.5 5" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.3 12.2c2.2.2 4 1.9 4.6 4.3" strokeLinecap="round" />
    </svg>
  );
}
function IBulb() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 18h6M10 21h4" strokeLinecap="round" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.45 1 1.15 1 1.9V16h5v-.2c0-.75.4-1.45 1-1.9A6 6 0 0 0 12 3Z" strokeLinejoin="round" />
    </svg>
  );
}

const SIX_PILIERS = [
  { titre: "Présence", texte: "Pointage géolocalisé — vous savez qui est là, à quelle heure.", icone: <IPin /> },
  { titre: "Travail", texte: "Planning du matin, réalisé du soir, tâches suivies jusqu'au bout.", icone: <IClipboard /> },
  { titre: "Performance", texte: "Un score objectif sur 100, transparent et contestable.", icone: <ITrend /> },
  { titre: "Discipline", texte: "Retards, avertissements et respect des délais, sans subjectivité.", icone: <IShield /> },
  { titre: "Management", texte: "Jusqu'à 3 co-administrateurs, chacun avec ses propres droits.", icone: <IPeople /> },
  { titre: "Intelligence", texte: "Statistiques, tendances et archives pour anticiper, pas subir.", icone: <IBulb /> },
];

const PLANS_LANDING = [
  {
    id: "decouverte",
    nom: "Découverte",
    prix: "Gratuit",
    suffixe: "",
    limites: "Jusqu'à 3 employés · 1 administrateur",
    fonctionnalites: ["Pointage et tâches", "Score sur 100", "Rapport journalier basique"],
  },
  {
    id: "essentiel",
    nom: "Essentiel",
    prix: "15 000",
    suffixe: "FCFA/mois",
    limites: "Jusqu'à 10 employés · 1 co-administrateur inclus",
    fonctionnalites: ["Pointage géolocalisé", "Rapports journaliers complets", "Export PDF"],
  },
  {
    id: "croissance",
    nom: "Croissance",
    prix: "35 000",
    suffixe: "FCFA/mois",
    populaire: true,
    limites: "Jusqu'à 30 employés · 3 co-administrateurs",
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
    fonctionnalites: ["Accompagnement dédié", "Besoins spécifiques"],
  },
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

        .bc-piliers-band {
          background: linear-gradient(160deg, var(--blue) 0%, var(--blue-deep) 100%);
          border-radius: 22px;
          padding: 2.75rem 2.5rem;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .bc-piliers-glow {
          position: absolute; top: -70px; right: -70px;
          width: 220px; height: 220px; border-radius: 50%;
          background: var(--yellow); opacity: 0.55; filter: blur(50px);
          animation: bc-glow 4s ease-in-out infinite;
        }
        @keyframes bc-glow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .bc-piliers-quote {
          position: relative;
          font-size: 19px;
          font-style: italic;
          line-height: 1.6;
          max-width: 62ch;
          margin: 0 0 8px;
        }
        .bc-piliers-sub {
          position: relative;
          font-size: 14.5px;
          color: #D9E7FD;
          margin: 0 0 2.25rem;
        }
        .bc-piliers-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .bc-pilier-item {
          display: flex; gap: 12px; align-items: flex-start;
          animation: bc-pilier-in 0.5s ease backwards;
        }
        @keyframes bc-pilier-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bc-pilier-icon {
          width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          color: var(--yellow);
        }
        .bc-pilier-item h4 { margin: 0; font-size: 14.5px; font-weight: 600; }
        .bc-pilier-item p { margin: 3px 0 0; font-size: 12.5px; color: #D9E7FD; line-height: 1.5; }
        @media (max-width: 760px) {
          .bc-piliers-grid { grid-template-columns: 1fr; }
          .bc-piliers-band { padding: 2rem 1.5rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bc-piliers-glow, .bc-pilier-item { animation: none; }
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

        .bc-plans { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .bc-plan-card {
          position: relative;
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 1.25rem;
          background: #fff;
          display: flex;
          flex-direction: column;
        }
        .bc-plan-card.populaire { border: 2px solid var(--blue); }
        .bc-plan-badge {
          position: absolute;
          top: -11px;
          left: 16px;
          background: var(--blue);
          color: #fff;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 500;
        }
        .bc-plan-card h3 { font-size: 15px; margin: 0 0 6px; }
        .bc-plan-price { margin: 0 0 4px; }
        .bc-plan-price .amount { font-size: 24px; font-weight: 600; }
        .bc-plan-price .suffix { font-size: 12px; color: var(--muted); }
        .bc-plan-limites { font-size: 12px; color: var(--muted); margin: 0 0 12px; }
        .bc-plan-card ul { list-style: none; margin: 0 0 16px; padding: 0; flex: 1; }
        .bc-plan-card li {
          font-size: 12.5px;
          color: #444441;
          padding: 5px 0;
          border-top: 1px solid #F1EFE8;
        }
        .bc-plan-card li:first-child { border-top: none; }

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
          grid-template-columns: 1.3fr 1fr 1fr;
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
          .bc-steps, .bc-features, .bc-criteres, .bc-plans { grid-template-columns: 1fr; }
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
            <a href="#tarifs">Tarifs</a>
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
        <section className="bc-section" style={{ borderTop: "none" }} id="piliers">
          <div className="bc-piliers-band">
            <div className="bc-piliers-glow" />
            <p className="bc-piliers-quote">
              « Est-ce que mes employés travaillent ? Qui produit réellement ? Où perd-on du
              temps ? Qui mérite une récompense ? Quels problèmes dois-je anticiper ? »
            </p>
            <p className="bc-piliers-sub">
              Ne vous inquiétez pas — BossClever vous aide à répondre à toutes ces questions,
              autour de 6 piliers.
            </p>
            <div className="bc-piliers-grid">
              {SIX_PILIERS.map((p, i) => (
                <div key={p.titre} className="bc-pilier-item" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="bc-pilier-icon">{p.icone}</div>
                  <div>
                    <h4>{p.titre}</h4>
                    <p>{p.texte}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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

        <section className="bc-section" id="tarifs">
          <div className="bc-section-head">
            <h2 className="display">Des tarifs pensés pour les PME ivoiriennes</h2>
            <p>
              Commencez gratuitement, passez à un palier supérieur quand votre équipe grandit.
              Aucune carte bancaire requise pour démarrer.
            </p>
          </div>
          <div className="bc-plans">
            {PLANS_LANDING.map((p) => (
              <div key={p.id} className={`bc-plan-card ${p.populaire ? "populaire" : ""}`}>
                {p.populaire && <span className="bc-plan-badge">Populaire</span>}
                <h3>{p.nom}</h3>
                <p className="bc-plan-price">
                  <span className="amount">{p.prix}</span>{" "}
                  <span className="suffix">{p.suffixe}</span>
                </p>
                <p className="bc-plan-limites">{p.limites}</p>
                <ul>
                  {p.fonctionnalites.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                {p.id === "entreprise" ? (
                  <a
                    href="#contact"
                    className="bc-btn"
                    style={{ textDecoration: "none", textAlign: "center" }}
                  >
                    Nous contacter
                  </a>
                ) : (
                  <button
                    className={`bc-btn ${p.populaire ? "bc-btn-primary" : ""}`}
                    onClick={onEntrer}
                  >
                    Commencer
                  </button>
                )}
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
            <div className="bc-footer-contact">
              <h4>Légal</h4>
              <p>
                <a href="#cgu" style={{ color: "inherit", textDecoration: "none" }}>
                  Conditions d'utilisation
                </a>
              </p>
              <p>
                <a href="#confidentialite" style={{ color: "inherit", textDecoration: "none" }}>
                  Politique de confidentialité
                </a>
              </p>
              <p>
                <a href="mailto:contact@cleverentreprises.com" style={{ color: "inherit", textDecoration: "none" }}>
                  Centre d'aide
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

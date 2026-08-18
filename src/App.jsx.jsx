import { useState, useMemo, useEffect, useRef } from "react";
import LandingPage from "./LandingPage";

const CRITERES = [
  { key: "objectifs", label: "Objectifs atteints", poids: 18 },
  { key: "taches", label: "Tâches dans les délais", poids: 14 },
  { key: "productivite", label: "Productivité (KPI poste)", poids: 12, fixe: 80 },
  { key: "proactivite", label: "Proactivité", poids: 9 },
  { key: "feedback", label: "Feedback des pairs", poids: 8 },
  { key: "fiabilite", label: "Fiabilité / autonomie", poids: 7, fixe: 80 },
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
    pointage: null,
    taches: [
      { id: 1, titre: "Rapport mensuel clients", statut: "en_attente", commentaire: "" },
      { id: 2, titre: "Campagne réseaux sociaux", statut: "a_faire", commentaire: "" },
    ],
    retards: 0,
    initiative: false,
    equipe: true,
    notesPairs: [4, 5, 4],
    contestations: [],
    journalPoints: [],
    rapportsJournaliers: [],
    avatarUrl: "",
  },
  {
    id: 2,
    nom: "Koffi Diarra",
    dept: "Comptabilité",
    initiales: "KD",
    pointage: null,
    taches: [
      { id: 3, titre: "Clôture comptable juillet", statut: "en_attente", commentaire: "" },
      { id: 4, titre: "Rapprochement bancaire", statut: "a_faire", commentaire: "" },
    ],
    retards: 1,
    initiative: true,
    equipe: true,
    notesPairs: [4, 3],
    contestations: [],
    journalPoints: [],
    rapportsJournaliers: [],
    avatarUrl: "",
  },
  {
    id: 3,
    nom: "Sara Bamba",
    dept: "RH",
    initiales: "SB",
    pointage: null,
    taches: [{ id: 5, titre: "Entretiens candidats", statut: "a_faire", commentaire: "" }],
    retards: 0,
    initiative: false,
    equipe: false,
    notesPairs: [3, 4],
    contestations: [],
    journalPoints: [],
    rapportsJournaliers: [],
    avatarUrl: "",
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

function calculerScore(emp, criteres = CRITERES) {
  const tachesValidees = emp.taches.filter((t) => t.statut === "validee").length;
  const tachesTotal = emp.taches.length || 1;
  const valeurs = {
    objectifs: emp.taches.every((t) => t.statut !== "a_faire") ? 90 : 60,
    taches: Math.round((tachesValidees / tachesTotal) * 100),
    ponctualite: Math.max(0, 100 - emp.retards * 25),
    proactivite: emp.initiative ? 90 : 55,
    collaboration: emp.equipe ? 90 : 55,
    feedback: Math.round((moyenne(emp.notesPairs) / 5) * 100),
  };
  let total = 0;
  const detail = criteres.map((c) => {
    const v = c.fixe !== undefined ? c.fixe : valeurs[c.key];
    total += (v * c.poids) / 100;
    return { ...c, valeur: v };
  });
  return { score: Math.round(total), detail };
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

function TacheAValiderCard({ tache, valider, rejeter }) {
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
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Bouton variant="danger" onClick={() => rejeter(tache.empId, tache.id, commentaire)}>
          Rejeter
        </Bouton>
        <Bouton variant="success" onClick={() => valider(tache.empId, tache.id, commentaire)}>
          Valider
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
    fonctionnalites: ["Pointage et tâches", "Score sur 100", "Rapport journalier basique"],
  },
  {
    id: "essentiel",
    nom: "Essentiel",
    prix: "15 000",
    suffixe: "FCFA/mois",
    payant: true,
    limites: "Jusqu'à 10 employés · 1 co-administrateur inclus",
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

function GestionAbonnement({ planActuel, onChoisir, onPayer }) {
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

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>Abonnement</h3>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#5F5E5A" }}>
        Paiement sécurisé par CinetPay (Orange Money, MTN Money, Moov, Wave, carte bancaire).
      </p>
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
                <Bouton
                  variant="secondary"
                  onClick={() =>
                    window.open("mailto:contact@cleverentreprises.com?subject=Plan Entreprise BossClever", "_blank")
                  }
                >
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
  const [nom, setNom] = useState("");
  const [permissions, setPermissions] = useState(permissionsVides());
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [afficherForm, setAfficherForm] = useState(false);

  const plafondAtteint = administrateurs.length >= 3;

  const inviter = async () => {
    if (!email.trim()) return;
    setEnCours(true);
    setErreur("");
    try {
      await onAjouter({ email: email.trim(), nom: nom.trim(), permissions });
      setEmail("");
      setNom("");
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
              <p style={{ margin: 0, fontSize: 14 }}>{a.nom || a.email}</p>
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
          <input
            type="email"
            placeholder="Email professionnel"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={champStyle}
          />
          <input
            type="text"
            placeholder="Nom / rôle (ex : RH, DG, Gérant)"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
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
              disabled={enCours || !email.trim()}
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
function IconPeople() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.7-3 2.9-5 5.5-5s4.8 2 5.5 5" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.3 12.2c2.2.2 4 1.9 4.6 4.3" strokeLinecap="round" />
    </svg>
  );
}
function IconClipboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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

function IconTrendUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 17 9.5 10.5 13.5 14.5 21 6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
`;

function OngletsNav({ onglets, actif, onChange }) {
  return (
    <div className="nav-tabs">
      {onglets.map((o) => (
        <button
          key={o.id}
          className={`nav-tab ${actif === o.id ? "active" : ""}`}
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
  plan,
  changerPlan,
  onPayer,
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
  const statsAnnee = useMemo(() => {
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
  }, [employes]);

  const enAttente = employes.flatMap((e) =>
    e.taches
      .filter((t) => t.statut === "en_attente")
      .map((t) => ({ ...t, empId: e.id, empNom: e.nom }))
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

  const soumettreTache = () => {
    if (!titreTache.trim() || !empChoisi) return;
    assigner(empChoisi, titreTache.trim(), echeanceTache, prioriteTache);
    setTitreTache("");
    setEcheanceTache("");
    setPrioriteTache("Normal");
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
    { id: "statistiques", label: "Statistiques", icone: <IconTrendUp />, count: 0 },
    { id: "compte", label: "Compte", icone: <IconGear />, count: 0 },
  ];

  return (
    <div>
      <style>{STYLES_NAV}</style>
      <OngletsNav onglets={onglets} actif={ongletActif} onChange={setOngletActif} />

      <div className="nav-panel-inner" key={ongletActif} style={{ display: "grid", gap: 24 }}>
        {ongletActif === "apercu" && (
          <>
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

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
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
                  <Bouton variant="primary" onClick={soumettreTache} disabled={!titreTache.trim()}>
                    + Ajouter la tâche
                  </Bouton>
                </Card>
              </div>
            )}

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
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {(estPrincipal || peutFaire("validerTaches")) && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>
                  Tâches à valider ({enAttente.length})
                </h3>
                {enAttente.length === 0 && (
                  <p style={{ fontSize: 14, color: "#5F5E5A" }}>Rien en attente pour le moment.</p>
                )}
                <div style={{ display: "grid", gap: 8 }}>
                  {enAttente.map((t) => (
                    <TacheAValiderCard key={t.id} tache={t} valider={valider} rejeter={rejeter} />
                  ))}
                </div>
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
            <div style={{ display: "grid", gap: 8 }}>
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

        {ongletActif === "compte" && (
          <>
            {codeEntreprise && (
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
            )}

            {(estPrincipal || peutFaire("configurerCriteres")) && (
              <div>
                <Bouton variant="secondary" onClick={() => setAfficherCriteres(true)}>
                  ⚙ Configurer les critères de notation
                </Bouton>
              </div>
            )}

            {estPrincipal && (
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
              <GestionAbonnement planActuel={plan} onChoisir={changerPlan} onPayer={onPayer} />
            )}
          </>
        )}
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

function VueEmploye({
  employe,
  pointer,
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
}) {
  const { score, detail } = calculerScore(employe, criteres);
  const [sujetContestation, setSujetContestation] = useState("");
  const [bilanValide, setBilanValide] = useState(false);
  const [motifContestation, setMotifContestation] = useState("");
  const [ongletActif, setOngletActif] = useState("apercu");
  const [pointageEnCours, setPointageEnCours] = useState(false);
  const [erreurPointage, setErreurPointage] = useState("");

  const gererPointage = async () => {
    setErreurPointage("");
    setPointageEnCours(true);
    const resultat = await pointer(employe.id);
    if (resultat && !resultat.ok) {
      setErreurPointage(resultat.message || "Impossible de pointer pour le moment.");
    }
    setPointageEnCours(false);
  };

  const soumettreContestation = () => {
    if (!sujetContestation.trim() || !motifContestation.trim()) return;
    contester(employe.id, sujetContestation.trim(), motifContestation.trim());
    setSujetContestation("");
    setMotifContestation("");
  };

  const tachesAFaire = employe.taches.filter((t) => t.statut === "a_faire").length;

  const onglets = [
    { id: "apercu", label: "Aperçu", icone: <IconHome />, count: 0 },
    { id: "rapport", label: "Rapport du jour", icone: <IconCalendar />, count: 0 },
    { id: "taches", label: "Mes tâches", icone: <IconClipboard />, count: tachesAFaire },
    { id: "bilan", label: "Bilan", icone: <IconRealise />, count: 0 },
    { id: "collegues", label: "Collègues", icone: <IconPeople />, count: 0 },
    { id: "contester", label: "Contester", icone: <IconAlertTriangle />, count: 0 },
  ];

  return (
    <div>
      <style>{STYLES_NAV}</style>
      <OngletsNav onglets={onglets} actif={ongletActif} onChange={setOngletActif} />

      <div className="nav-panel-inner" key={ongletActif} style={{ display: "grid", gap: 20 }}>
        {ongletActif === "apercu" && (
          <>
            {!employe.pointage && <Alerte>Vous n'avez pas encore pointé votre arrivée aujourd'hui.</Alerte>}
            {tachesAFaire > 0 && (
              <Alerte tone="accent">
                {tachesAFaire} tâche{tachesAFaire > 1 ? "s" : ""} en attente de déclaration.
              </Alerte>
            )}

            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 14, color: "#5F5E5A" }}>Mon score actuel</p>
                  <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 500 }}>{score}</p>
                </div>
                {employe.pointage ? (
                  <Badge tone="success">Pointé à {employe.pointage}</Badge>
                ) : (
                  <Bouton variant="success" onClick={gererPointage} disabled={pointageEnCours}>
                    {pointageEnCours ? "Localisation..." : "Pointer mon arrivée"}
                  </Bouton>
                )}
              </div>
              {erreurPointage && (
                <p style={{ margin: "10px 0 0", fontSize: 13, color: "#993C1D" }}>
                  {erreurPointage}
                </p>
              )}
            </Card>

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
              {employe.taches.map((t) => (
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
                </Card>
              ))}
            </div>
          </div>
        )}

        {ongletActif === "bilan" && (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 12px" }}>Bilan hebdomadaire</h3>
            <Card style={{ display: "grid", gap: 14 }}>
              <label style={{ fontSize: 13 }}>
                Retards cette semaine
                <input
                  type="number"
                  min="0"
                  value={employe.retards}
                  onChange={(e) => majBilan(employe.id, "retards", Number(e.target.value))}
                  style={{
                    display: "block",
                    marginTop: 4,
                    width: 80,
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid #E5E3DA",
                  }}
                />
              </label>
              <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={employe.initiative}
                  onChange={(e) => majBilan(employe.id, "initiative", e.target.checked)}
                />
                J'ai pris une initiative cette semaine
              </label>
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

async function obtenirUtilisateur(accessToken) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return res.json();
}

async function chargerDepuisSupabase(accessToken, userId) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/etat_app?select=id,donnees,owner_id,code_entreprise`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  if (!data || !data.length) return null;
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
// co-administrateur lié (et non le principal) : ses permissions y sont
// précisées. Absence de ligne = soit un employé, soit l'administrateur
// principal lui-même (dont la fiche etat_app.owner_id lui appartient).
async function chargerMesPermissionsAdmin(accessToken) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/administrateurs_comptes?select=permissions`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  if (!data || !data.length) return null;
  return data[0].permissions || {};
}

async function chargerAdministrateurs(accessToken) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/administrateurs_comptes?select=id,email,nom,permissions,user_id&order=ajoute_le.asc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return [];
  return res.json();
}

async function ajouterAdministrateurSupabase(accessToken, ownerId, { email, nom, permissions }) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/administrateurs_comptes`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ owner_id: ownerId, email, nom, permissions }),
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

function EcranChoixRole({ onChoisir }) {
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
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        maxWidth: 380,
        margin: "4rem auto",
        padding: "1.5rem",
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
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [rowId, setRowId] = useState(null);
  const [employes, setEmployes] = useState(EMPLOYES_INIT);
  const [vue, setVue] = useState("manager");
  const [employeActifId, setEmployeActifId] = useState(1);
  const [chargement, setChargement] = useState(false);
  const [criteres, setCriteres] = useState(CRITERES);
  const [logoUrl, setLogoUrl] = useState("");
  const [bureau, setBureau] = useState(null);
  const [plan, setPlan] = useState("decouverte");
  const [role, setRole] = useState(null);
  const [erreurChargement, setErreurChargement] = useState("");
  const [accesRefuse, setAccesRefuse] = useState(false);
  const [codeEntreprise, setCodeEntrepriseState] = useState(null);
  const [verificationLien, setVerificationLien] = useState(true);
  const [roleDeclare, setRoleDeclare] = useState(null);
  const [landingVu, setLandingVu] = useState(false);
  const [estPrincipal, setEstPrincipal] = useState(true);
  const [permissionsAdmin, setPermissionsAdmin] = useState(null);
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

  // Détecte un lien de confirmation d'email (access_token dans l'URL)
  // et connecte automatiquement la personne, sans qu'elle ait à ressaisir
  // son mot de passe.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token=")) {
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
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
            setPermissionsAdmin(mesPermissions);
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
        setPlan(d.plan || "decouverte");
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
    sauvegarderDansSupabase(session.access_token, rowId, { employes, criteres, logoUrl, bureau, plan }).catch(() => {});
  }, [employes, criteres, logoUrl, bureau, plan, chargement, session, rowId]);

  // Seul le principal gère la liste des co-administrateurs : inutile
  // (et non autorisé par les règles de sécurité) pour un co-administrateur
  // de la charger lui-même.
  useEffect(() => {
    if (!session || role !== "manager" || !estPrincipal || !rowId) return;
    chargerAdministrateurs(session.access_token).then(setAdministrateurs).catch(() => {});
  }, [session, role, estPrincipal, rowId]);

  const peutFaire = (cle) => !!(permissionsAdmin && permissionsAdmin[cle]);

  const ajouterAdministrateur = async ({ email, nom, permissions }) => {
    if (!session) return;
    const nouveau = await ajouterAdministrateurSupabase(session.access_token, session.userId, {
      email,
      nom,
      permissions,
    });
    setAdministrateurs((prev) => [...prev, nouveau]);
  };

  const retirerAdministrateur = async (id) => {
    if (!session) return;
    await retirerAdministrateurSupabase(session.access_token, id);
    setAdministrateurs((prev) => prev.filter((a) => a.id !== id));
  };

  const majEmploye = (id, fn) =>
    setEmployes((prev) => prev.map((e) => (e.id === id ? fn(e) : e)));

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
  const evaluerRapport = (empId, dateRapport, { commentaire, note }) =>
    majEmploye(empId, (e) => ({
      ...e,
      rapportsJournaliers: (e.rapportsJournaliers || []).map((r) =>
        r.date === dateRapport
          ? { ...r, evaluation: { commentaire, note, evalueLe: new Date().toISOString() } }
          : r
      ),
    }));

  // Si le manager a configuré la localisation du bureau, le pointage
  // n'est validé que si la position GPS de l'employé est dans le rayon
  // autorisé. Sans configuration, on garde l'ancien comportement (simple
  // clic) pour ne rien casser tant que le manager n'a pas activé l'option.
  const pointer = async (id) => {
    const h = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const bureauConfigure = bureau && typeof bureau.lat === "number" && typeof bureau.lng === "number";

    if (!bureauConfigure) {
      majEmploye(id, (e) => ({ ...e, pointage: h }));
      return { ok: true };
    }

    try {
      const position = await obtenirPosition();
      const distance = distanceMetres(
        position.coords.latitude,
        position.coords.longitude,
        bureau.lat,
        bureau.lng
      );
      const rayon = bureau.rayon || 150;
      if (distance > rayon) {
        return {
          ok: false,
          message: `Vous semblez être à ${Math.round(distance)} m du bureau (rayon autorisé : ${rayon} m). Rapprochez-vous pour pointer.`,
        };
      }
      majEmploye(id, (e) => ({ ...e, pointage: h }));
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

  const declarer = (empId, tacheId) =>
    majEmploye(empId, (e) => ({
      ...e,
      taches: e.taches.map((t) => (t.id === tacheId ? { ...t, statut: "en_attente" } : t)),
    }));

  const valider = (empId, tacheId, commentaireManager) =>
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
      return {
        ...e,
        taches: e.taches.map((t) =>
          t.id === tacheId ? { ...t, statut: "validee", commentaireManager } : t
        ),
        journalPoints: [...(e.journalPoints || []), ...nouveauxPoints],
      };
    });

  const rejeter = (empId, tacheId, commentaireManager) =>
    majEmploye(empId, (e) => ({
      ...e,
      taches: e.taches.map((t) =>
        t.id === tacheId ? { ...t, statut: "a_faire", commentaireManager } : t
      ),
    }));

  const majBilan = (id, champ, valeur) => majEmploye(id, (e) => ({ ...e, [champ]: valeur }));

  const validerBilan = (empId) =>
    majEmploye(empId, (e) => {
      const nouveauxPoints = [];
      const aujourdHui = new Date();

      if (e.retards > 0) {
        nouveauxPoints.push({
          id: Date.now() + Math.random(),
          libelle: `${e.retards} retard${e.retards > 1 ? "s" : ""} signalé${
            e.retards > 1 ? "s" : ""
          } cette semaine`,
          points: -4 * e.retards,
        });
      }
      if (e.initiative) {
        nouveauxPoints.push({
          id: Date.now() + Math.random(),
          libelle: "Initiative proposée cette semaine",
          points: 8,
        });
      }
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

      return { ...e, journalPoints: [...(e.journalPoints || []), ...nouveauxPoints] };
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
      pointage: null,
      taches: [],
      retards: 0,
      initiative: false,
      equipe: false,
      notesPairs: [],
      contestations: [],
      journalPoints: [],
      rapportsJournaliers: [],
      avatarUrl: "",
    };
    setEmployes((prev) => [...prev, nouvel]);
  };

  const supprimerEmploye = (empId) => {
    setEmployes((prev) => prev.filter((e) => e.id !== empId));
    if (session) supprimerLienEmploye(session.access_token, empId).catch(() => {});
  };

  const assigner = (empId, titre, echeance, priorite) =>
    majEmploye(empId, (e) => ({
      ...e,
      taches: [
        ...e.taches,
        { id: Date.now(), titre, statut: "a_faire", commentaire: "", echeance, priorite },
      ],
    }));

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

  const resoudreContestation = (empId, contestId, reponse) =>
    majEmploye(empId, (e) => ({
      ...e,
      contestations: e.contestations.map((c) =>
        c.id === contestId ? { ...c, statut: "resolue", reponse } : c
      ),
    }));

  const employeActif = employes.find((e) => e.id === employeActifId);
  const autres = employes.filter((e) => e.id !== employeActifId);

  if (verificationLien) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#5F5E5A", fontSize: 14 }}>
        Connexion en cours…
      </div>
    );
  }

  if (!session) {
    if (!landingVu) {
      return <LandingPage onEntrer={() => setLandingVu(true)} />;
    }
    if (!roleDeclare) {
      return <EcranChoixRole onChoisir={setRoleDeclare} />;
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

  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        maxWidth: 620,
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
        <span
          onClick={() => {
            setSession(null);
            setRoleDeclare(null);
          }}
          style={{ marginLeft: "auto", fontSize: 13, color: "#5F5E5A", cursor: "pointer" }}
        >
          Se déconnecter
        </span>
      </div>

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
          employes={employes}
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
          plan={plan}
          changerPlan={setPlan}
          onPayer={payerPlan}
        />
      ) : (
        <VueEmploye
          employe={employeActif}
          pointer={pointer}
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
        />
      )}
    </div>
  );
}

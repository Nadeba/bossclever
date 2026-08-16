import { useState, useMemo, useEffect } from "react";

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
  },
];

function moyenne(arr) {
  if (!arr.length) return 75;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
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

function VueManager({
  employes,
  valider,
  rejeter,
  assigner,
  criteres,
  setCriteres,
  resoudreContestation,
}) {
  const [empChoisi, setEmpChoisi] = useState(employes[0]?.id);
  const [titreTache, setTitreTache] = useState("");
  const [afficherCriteres, setAfficherCriteres] = useState(false);

  const classement = useMemo(
    () =>
      employes
        .map((e) => ({ ...e, ...calculerScore(e, criteres) }))
        .sort((a, b) => b.score - a.score),
    [employes, criteres]
  );

  const enAttente = employes.flatMap((e) =>
    e.taches
      .filter((t) => t.statut === "en_attente")
      .map((t) => ({ ...t, empId: e.id, empNom: e.nom }))
  );

  const contestationsOuvertes = employes.flatMap((e) =>
    (e.contestations || [])
      .filter((c) => c.statut === "en_attente")
      .map((c) => ({ ...c, empId: e.id, empNom: e.nom }))
  );

  const soumettreTache = () => {
    if (!titreTache.trim() || !empChoisi) return;
    assigner(empChoisi, titreTache.trim());
    setTitreTache("");
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

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {enAttente.length > 0 && (
        <Alerte>
          {enAttente.length} tâche{enAttente.length > 1 ? "s" : ""} en attente de votre
          validation.
        </Alerte>
      )}
      {contestationsOuvertes.length > 0 && (
        <Alerte tone="accent">
          {contestationsOuvertes.length} contestation{contestationsOuvertes.length > 1 ? "s" : ""}{" "}
          en attente de réponse.
        </Alerte>
      )}

      <Bouton variant="secondary" onClick={() => setAfficherCriteres(true)}>
        ⚙ Configurer les critères
      </Bouton>

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
          <Bouton variant="primary" onClick={soumettreTache} disabled={!titreTache.trim()}>
            + Ajouter la tâche
          </Bouton>
        </Card>
      </div>

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
                <span style={{ width: 18, fontWeight: 500, fontSize: 14 }}>{i + 1}</span>
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

      <div>
        <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>
          Tâches à valider ({enAttente.length})
        </h3>
        {enAttente.length === 0 && (
          <p style={{ fontSize: 14, color: "#5F5E5A" }}>Rien en attente pour le moment.</p>
        )}
        <div style={{ display: "grid", gap: 8 }}>
          {enAttente.map((t) => (
            <Card key={t.id} style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14 }}>{t.titre}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#5F5E5A" }}>
                    Déclaré par {t.empNom}
                  </p>
                </div>
                <Bouton variant="danger" onClick={() => rejeter(t.empId, t.id)}>
                  Rejeter
                </Bouton>
                <Bouton variant="success" onClick={() => valider(t.empId, t.id)}>
                  Valider
                </Bouton>
              </div>
            </Card>
          ))}
        </div>
      </div>

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

function VueEmploye({
  employe,
  pointer,
  declarer,
  majBilan,
  noterCollegue,
  autres,
  criteres,
  contester,
}) {
  const { score, detail } = calculerScore(employe, criteres);
  const [sujetContestation, setSujetContestation] = useState("");
  const [motifContestation, setMotifContestation] = useState("");

  const soumettreContestation = () => {
    if (!sujetContestation.trim() || !motifContestation.trim()) return;
    contester(employe.id, sujetContestation.trim(), motifContestation.trim());
    setSujetContestation("");
    setMotifContestation("");
  };

  const tachesAFaire = employe.taches.filter((t) => t.statut === "a_faire").length;

  return (
    <div style={{ display: "grid", gap: 20 }}>
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
            <Bouton variant="success" onClick={() => pointer(employe.id)}>
              Pointer mon arrivée
            </Bouton>
          )}
        </div>
      </Card>

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
                  </p>
                </div>
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
        </Card>
      </div>

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
    </div>
  );
}

const SUPABASE_URL = "https://oacjriznecslomgcamkv.supabase.co";
const SUPABASE_KEY = "sb_publishable_80rpe2MRZWELyHmgh1vRTg_q6KsSjPu";

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

async function chargerDepuisSupabase(accessToken) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/etat_app?select=id,donnees`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  return data && data[0] ? data[0] : null;
}

async function creerLigne(accessToken, donnees) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/etat_app`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ donnees }),
  });
  const data = await res.json();
  return data[0];
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

function EcranConnexion({ onConnecte }) {
  const [mode, setMode] = useState("connexion");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  const soumettre = async () => {
    setErreur("");
    setEnCours(true);
    try {
      if (mode === "inscription") {
        await inscrire(email, motDePasse);
        setMode("connexion");
        setErreur("Compte créé ! Vérifiez vos emails puis connectez-vous.");
      } else {
        const session = await connecter(email, motDePasse);
        onConnecte(session);
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

      <h2 style={{ fontSize: 18, fontWeight: 500, margin: "0 0 20px" }}>
        {mode === "connexion" ? "Connexion manager" : "Créer un compte manager"}
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

      <label style={{ fontSize: 13, color: "#5F5E5A", display: "block", marginBottom: 4 }}>
        Mot de passe
      </label>
      <input
        type="password"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
        style={{
          width: "100%",
          padding: "9px 12px",
          borderRadius: 8,
          border: "1px solid #E5E3DA",
          marginBottom: 18,
          boxSizing: "border-box",
        }}
      />

      {erreur && (
        <p style={{ fontSize: 13, color: "#993C1D", marginBottom: 14 }}>{erreur}</p>
      )}

      <button
        onClick={soumettre}
        disabled={enCours || !email || !motDePasse}
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

  useEffect(() => {
    if (!session) return;
    setChargement(true);
    (async () => {
      try {
        let ligne = await chargerDepuisSupabase(session.access_token);
        if (!ligne)
          ligne = await creerLigne(session.access_token, {
            employes: EMPLOYES_INIT,
            criteres: CRITERES,
          });
        setRowId(ligne.id);
        const d = ligne.donnees || {};
        setEmployes(d.employes && d.employes.length ? d.employes : EMPLOYES_INIT);
        setCriteres(d.criteres && d.criteres.length ? d.criteres : CRITERES);
      } catch (e) {
        // en cas d'erreur réseau, on garde les données de démo affichées localement
      }
      setChargement(false);
    })();
  }, [session]);

  useEffect(() => {
    if (chargement || !session || !rowId) return;
    sauvegarderDansSupabase(session.access_token, rowId, { employes, criteres }).catch(() => {});
  }, [employes, criteres, chargement, session, rowId]);

  const majEmploye = (id, fn) =>
    setEmployes((prev) => prev.map((e) => (e.id === id ? fn(e) : e)));

  const pointer = (id) => {
    const h = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    majEmploye(id, (e) => ({ ...e, pointage: h }));
  };

  const declarer = (empId, tacheId) =>
    majEmploye(empId, (e) => ({
      ...e,
      taches: e.taches.map((t) => (t.id === tacheId ? { ...t, statut: "en_attente" } : t)),
    }));

  const valider = (empId, tacheId) =>
    majEmploye(empId, (e) => ({
      ...e,
      taches: e.taches.map((t) => (t.id === tacheId ? { ...t, statut: "validee" } : t)),
    }));

  const rejeter = (empId, tacheId) =>
    majEmploye(empId, (e) => ({
      ...e,
      taches: e.taches.map((t) => (t.id === tacheId ? { ...t, statut: "a_faire" } : t)),
    }));

  const majBilan = (id, champ, valeur) => majEmploye(id, (e) => ({ ...e, [champ]: valeur }));

  const assigner = (empId, titre) =>
    majEmploye(empId, (e) => ({
      ...e,
      taches: [...e.taches, { id: Date.now(), titre, statut: "a_faire", commentaire: "" }],
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

  if (!session) {
    return <EcranConnexion onConnecte={setSession} />;
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
          onClick={() => setSession(null)}
          style={{ marginLeft: "auto", fontSize: 13, color: "#5F5E5A", cursor: "pointer" }}
        >
          Se déconnecter
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <Bouton
          variant={vue === "manager" ? "primary" : "secondary"}
          onClick={() => setVue("manager")}
        >
          Espace manager
        </Bouton>
        <Bouton
          variant={vue === "employe" ? "primary" : "secondary"}
          onClick={() => setVue("employe")}
        >
          Espace employé
        </Bouton>
        {vue === "employe" && (
          <select
            value={employeActifId}
            onChange={(e) => setEmployeActifId(Number(e.target.value))}
            style={{
              marginLeft: "auto",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #E5E3DA",
              fontSize: 13,
            }}
          >
            {employes.map((e) => (
              <option key={e.id} value={e.id}>
                Se connecter en tant que {e.nom}
              </option>
            ))}
          </select>
        )}
      </div>

      {vue === "manager" ? (
        <VueManager
          employes={employes}
          valider={valider}
          rejeter={rejeter}
          assigner={assigner}
          criteres={criteres}
          setCriteres={setCriteres}
          resoudreContestation={resoudreContestation}
        />
      ) : (
        <VueEmploye
          employe={employeActif}
          pointer={pointer}
          declarer={declarer}
          majBilan={majBilan}
          noterCollegue={noterCollegue}
          autres={autres}
          criteres={criteres}
          contester={contester}
        />
      )}
    </div>
  );
}

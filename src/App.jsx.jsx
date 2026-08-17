import { useState, useMemo, useEffect } from "react";
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

  return (
    <div style={{ display: "grid", gap: 24 }}>
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

      <div style={{ display: "flex", gap: 8 }}>
        <Bouton variant="secondary" onClick={() => setAfficherCriteres(true)}>
          ⚙ Configurer les critères
        </Bouton>
        <Bouton
          variant="secondary"
          onClick={() => setAfficherAjoutEmploye(!afficherAjoutEmploye)}
        >
          + Ajouter un employé
        </Bouton>
      </div>

      {afficherAjoutEmploye && (
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
              </div>
            </Card>
          ))}
        </div>
      </div>

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
  validerBilan,
  noterCollegue,
  autres,
  criteres,
  contester,
}) {
  const { score, detail } = calculerScore(employe, criteres);
  const [sujetContestation, setSujetContestation] = useState("");
  const [bilanValide, setBilanValide] = useState(false);
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
  const [role, setRole] = useState(null);
  const [erreurChargement, setErreurChargement] = useState("");
  const [accesRefuse, setAccesRefuse] = useState(false);
  const [codeEntreprise, setCodeEntrepriseState] = useState(null);
  const [verificationLien, setVerificationLien] = useState(true);
  const [roleDeclare, setRoleDeclare] = useState(null);
  const [landingVu, setLandingVu] = useState(false);

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
          // employeur.
          let attente = null;
          try {
            attente = JSON.parse(localStorage.getItem("bc_code_attente") || "null");
          } catch (e) {
            attente = null;
          }
          if (attente && attente.email === session.email && attente.code) {
            codeEtaitFourni = true;
            const lien = await lierEmploye(session.access_token, session.email, attente.code);
            if (lien) {
              ligne = await chargerDepuisSupabase(session.access_token, session.userId);
              codeVerifieViaLien = true;
            }
          }
          localStorage.removeItem("bc_code_attente");
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

        setRowId(ligne.id);
        const d = ligne.donnees || {};
        setEmployes(d.employes && d.employes.length ? d.employes : EMPLOYES_INIT);
        setCriteres(d.criteres && d.criteres.length ? d.criteres : CRITERES);
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

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {role === "employe" && (
          <p style={{ margin: 0, fontSize: 14, color: "#5F5E5A" }}>
            Espace employé — {employeActif?.nom}
          </p>
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
        />
      )}
    </div>
  );
}

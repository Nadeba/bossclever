import { useEffect, useState } from "react";
import { supabase } from "./supabase";

/* =========================================================
   BossClever — Portail Super Admin
   Fichier : src/AdminDashboard.jsx
   ========================================================= */

const COLORS = {
  blue: "#1877F2", // Bleu Facebook
  blueDark: "#0D5FD3",
  blueSoft: "#EAF3FF",
  yellow: "#FFD83D",
  navy: "#071A33",
  text: "#10233F",
  muted: "#6B7A90",
  border: "#E5ECF5",
  bg: "#F7F9FC",
  white: "#FFFFFF",
  green: "#20A35A",
  red: "#E53935",
  orange: "#FF8A00",
  purple: "#7B61E8",
  cyan: "#26AFC7",
};

const Icon = ({ name, size = 20 }) => {
  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    building: (
      <>
        <path d="M4 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
        <path d="M16 8h3a1 1 0 0 1 1 1v12" />
        <path d="M8 7h3M8 11h3M8 15h3M8 19h3M3 21h18" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2.5 21a6.5 6.5 0 0 1 13 0" />
        <circle cx="18" cy="9" r="3" />
        <path d="M16 15.5a5 5 0 0 1 5.5 4.5" />
      </>
    ),
    subscription: (
      <>
        <rect x="3" y="5" width="18" height="15" rx="3" />
        <path d="M7 3v4M17 3v4M7 11h10M8 15h3" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 6.5h14a2 2 0 0 1 2 2V19H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12" />
        <path d="M16 11h5v5h-5a2.5 2.5 0 0 1 0-5Z" />
      </>
    ),
    support: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12a4 4 0 0 1 8 0M8 12v4M16 12v4M8 16h2M14 16h2" />
      </>
    ),
    activity: (
      <>
        <path d="M4 19V10M10 19V5M16 19v-7M22 19V3" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    plus: <path d="M12 5v14M5 12h14" />,
    chart: (
      <>
        <path d="M3 20h18" />
        <path d="m5 16 4-4 3 2 6-7" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.dashboard}
    </svg>
  );
};

// Infos tarifaires des plans payants, utilisées pour calculer le MRR réel.
// Doit rester synchronisé avec le tableau PLANS de App.jsx.
const PLANS_INFO = {
  decouverte: { label: "Plan Découverte", prix: 0, payant: false },
  essentiel: { label: "Plan Essentiel", prix: 15000, payant: true },
  croissance: { label: "Plan Croissance", prix: 35000, payant: true },
  entreprise: { label: "Plan Entreprise", prix: null, payant: true }, // sur devis, exclu du MRR
};

function libellePlan(planId) {
  return (PLANS_INFO[planId] || PLANS_INFO.decouverte).label;
}

// Calcule toutes les statistiques réelles de la plateforme à partir des
// lignes etat_app (une ligne = une entreprise cliente). Rien n'est inventé :
// ce qui ne peut pas encore être calculé honnêtement (historique de revenus,
// flux d'activité global) reste signalé comme "à venir" plutôt que simulé.
// Rassemble en une seule liste les 3 catégories de personnes qui accèdent
// à une entreprise : le manager principal (via etat_app), les
// co-administrateurs qu'il a invités (via administrateurs_comptes), et
// ses employés (déjà présents dans etat_app.donnees.employes). Le manager
// et les co-administrateurs partagent le même owner_id, ce qui permet de
// les rattacher à la bonne entreprise.
function construireUtilisateurs(lignesEtatApp, lignesAdmins) {
  const nomParOwnerId = {};
  lignesEtatApp.forEach((ligne) => {
    nomParOwnerId[ligne.owner_id] =
      ligne.donnees?.nomEntreprise?.trim() || ligne.code_entreprise || "Entreprise sans nom";
  });

  const managers = lignesEtatApp.map((ligne) => ({
    id: `manager-${ligne.id}`,
    type: "manager",
    nom: "Administrateur principal",
    email: null,
    poste: "",
    entreprise: nomParOwnerId[ligne.owner_id] || ligne.code_entreprise || "Entreprise sans nom",
  }));

  const employes = lignesEtatApp.flatMap((ligne) => {
    const nomEntreprise = nomParOwnerId[ligne.owner_id] || ligne.code_entreprise || "Entreprise sans nom";
    return (ligne.donnees?.employes || []).map((emp) => ({
      id: `employe-${ligne.id}-${emp.id}`,
      type: "employe",
      nom: emp.nom || "Employé",
      email: emp.email || null,
      poste: emp.dept || "",
      entreprise: nomEntreprise,
    }));
  });

  const coAdmins = lignesAdmins.map((admin) => ({
    id: `coadmin-${admin.id}`,
    type: "coadmin",
    nom: `${admin.prenom || ""} ${admin.nom || ""}`.trim() || admin.email || "Co-administrateur",
    email: admin.email || null,
    poste: admin.poste || "",
    entreprise: nomParOwnerId[admin.owner_id] || "Entreprise inconnue",
  }));

  return [...managers, ...coAdmins, ...employes];
}

function calculerStatsPlateforme(lignes, tarifsOverride = {}) {
  const entreprises = lignes.map((ligne) => {
    const d = ligne.donnees || {};
    const plan = d.plan || "decouverte";
    const abonnement = d.abonnement || null;
    const abonnementActif = plan !== "decouverte" && abonnement?.statut === "actif";
    return {
      id: ligne.id,
      nom: d.nomEntreprise?.trim() || ligne.code_entreprise || "Entreprise sans nom",
      adresse: d.adresseEntreprise?.trim() || "",
      codeEntreprise: ligne.code_entreprise || "",
      createdAt: ligne.updated_at || null,
      nombreEmployes: Array.isArray(d.employes) ? d.employes.length : 0,
      employes: Array.isArray(d.employes) ? d.employes : [],
      journalActivite: Array.isArray(d.journalActivite) ? d.journalActivite : [],
      plan,
      abonnement,
      abonnementActif,
    };
  });

  const nombreEntreprises = entreprises.length;

  // Utilisateurs = 1 manager principal par entreprise + ses employés.
  // (Les co-administrateurs, stockés dans une table à part, ne sont pas
  // encore comptés ici — à ajouter si besoin plus tard.)
  const nombreUtilisateurs = entreprises.reduce(
    (somme, e) => somme + 1 + e.nombreEmployes,
    0
  );

  const abonnementsActifs = entreprises.filter((e) => e.abonnementActif).length;
  const comptesGratuits = entreprises.filter((e) => e.plan === "decouverte").length;

  const mrr = entreprises.reduce((somme, e) => {
    if (!e.abonnementActif) return somme;
    const infosPlan = PLANS_INFO[e.plan];
    const prixEffectif = tarifsOverride[e.plan]?.prix_mensuel ?? infosPlan?.prix;
    return somme + (infosPlan?.payant && prixEffectif ? prixEffectif : 0);
  }, 0);

  const tauxConversion =
    nombreEntreprises > 0
      ? Math.round((abonnementsActifs / nombreEntreprises) * 1000) / 10
      : 0;

  const entreprisesRecentes = [...entreprises]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Liste complète, triée par mise à jour la plus récente — utilisée par
  // la page "Entreprises" (pas seulement les 5 dernières de l'Aperçu).
  const toutesLesEntreprises = [...entreprises].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  const abonnementsRecents = entreprises
    .filter((e) => e.abonnementActif)
    .sort(
      (a, b) =>
        new Date(b.abonnement?.expireLe || 0) - new Date(a.abonnement?.expireLe || 0)
    )
    .slice(0, 5);

  return {
    nombreEntreprises,
    nombreUtilisateurs,
    abonnementsActifs,
    comptesGratuits,
    mrr,
    tauxConversion,
    entreprisesRecentes,
    toutesLesEntreprises,
    abonnementsRecents,
  };
}

const menuItems = [
  { id: "overview", label: "Aperçu", icon: "dashboard" },
  { id: "companies", label: "Entreprises", icon: "building" },
  { id: "users", label: "Utilisateurs", icon: "users" },
  { id: "subscriptions", label: "Abonnements", icon: "subscription" },
  { id: "payments", label: "Paiements", icon: "wallet" },
  { id: "support", label: "Support", icon: "support" },
  { id: "activity", label: "Activité", icon: "activity" },
  { id: "security", label: "Sécurité", icon: "shield" },
  { id: "settings", label: "Paramètres", icon: "settings" },
];

// Construit la liste des KPI affichés à partir des vraies statistiques
// calculées (voir calculerStatsPlateforme). Aucune tendance ("+X% ce mois")
// n'est encore affichée : la calculer honnêtement demanderait un historique
// quotidien qui n'existe pas encore côté base de données.
function construireKpis(stats) {
  const fmt = (n) => n.toLocaleString("fr-FR");
  return [
    {
      title: "Entreprises",
      value: fmt(stats.nombreEntreprises),
      icon: "building",
      accent: COLORS.blue,
    },
    {
      title: "Utilisateurs",
      value: fmt(stats.nombreUtilisateurs),
      icon: "users",
      accent: COLORS.purple,
    },
    {
      title: "Abonnements actifs",
      value: fmt(stats.abonnementsActifs),
      icon: "subscription",
      accent: COLORS.green,
    },
    {
      title: "MRR",
      value: `${fmt(stats.mrr)} FCFA`,
      icon: "wallet",
      accent: COLORS.orange,
    },
    {
      title: "Comptes gratuits",
      value: fmt(stats.comptesGratuits),
      icon: "subscription",
      accent: COLORS.cyan,
    },
    {
      title: "Taux de conversion",
      value: `${stats.tauxConversion.toString().replace(".", ",")}%`,
      icon: "chart",
      accent: "#EC4D7A",
    },
  ];
}

// Formate un horodatage en "il y a X min/h/j", en français, sans dépendance
// externe.
function ilYA(dateValue) {
  if (!dateValue) return "";
  const diffMs = Date.now() - new Date(dateValue).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `Il y a ${heures} h`;
  const jours = Math.floor(heures / 24);
  return `Il y a ${jours} j`;
}

// Associe chaque type d'action du journal d'activité (déjà tracé par
// entreprise dans App.jsx) à une icône/couleur pour l'affichage global.
function styleAction(action = "") {
  if (action.includes("Ajout d'employé") || action.includes("Retrait d'employé"))
    return { icon: "users", color: COLORS.purple };
  if (action.includes("Validation") || action.includes("Rejet"))
    return { icon: "subscription", color: COLORS.green };
  if (action.includes("administrateur"))
    return { icon: "shield", color: COLORS.blue };
  return { icon: "activity", color: COLORS.muted };
}

function Sidebar({ active, setActive, open, setOpen }) {
  return (
    <>
      {open && (
        <button
          className="bc-overlay"
          onClick={() => setOpen(false)}
          aria-label="Fermer le menu"
        />
      )}

      <aside className={`bc-sidebar ${open ? "open" : ""}`}>
        <div className="bc-brand">
          <div className="bc-brand-icon">🧠</div>
          <div className="bc-brand-name">
            Boss<span>Clever</span>
          </div>
        </div>

        <div className="bc-super-badge">♛ SUPER ADMIN</div>

        <nav className="bc-side-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`bc-nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => {
                setActive(item.id);
                setOpen(false);
              }}
            >
              <Icon name={item.icon} size={21} />
              <span>{item.label}</span>
              {item.id === "security" && <span className="bc-security-dot" />}
            </button>
          ))}
        </nav>

        <div className="bc-quick-title">ACCÈS RAPIDES</div>

        <div className="bc-quick-box">
          <button>
            <Icon name="building" size={19} />
            Ajouter une entreprise
          </button>
          <button>
            <Icon name="users" size={19} />
            Ajouter un utilisateur
          </button>
          <button>
            <Icon name="wallet" size={19} />
            Voir les paiements
          </button>
          <button>
            <Icon name="activity" size={19} />
            Rapport d'activité
          </button>
        </div>

        <div className="bc-profile">
          <div className="bc-avatar">SG</div>
          <div>
            <strong>SERI GUY CLAVER</strong>
            <span>Super Admin</span>
          </div>
          <span className="bc-online" />
        </div>

        <div className="bc-version">BossClever v1.0.0</div>
      </aside>
    </>
  );
}

function Topbar({ title, openSidebar, adminEmail, onDeconnexion }) {
  return (
    <header className="bc-topbar">
      <button className="bc-mobile-menu" onClick={openSidebar}>
        <Icon name="menu" size={24} />
      </button>

      <h1>{title}</h1>

      <div className="bc-search">
        <Icon name="search" size={19} />
        <input placeholder="Rechercher (entreprises, utilisateurs...)" />
        <span>⌘ K</span>
      </div>

      <div className="bc-top-actions">
        <button className="bc-icon-btn">
          <Icon name="bell" size={21} />
          <span className="bc-notification">5</span>
        </button>

        <button className="bc-icon-btn">
          <Icon name="shield" size={21} />
        </button>

        <div className="bc-admin">
          <div className="bc-avatar small">SG</div>
          <div>
            <strong>{adminEmail || "Super Admin"}</strong>
            <button className="bc-logout-link" onClick={onDeconnexion}>
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function KPIGrid({ stats }) {
  const kpis = construireKpis(stats);
  return (
    <div className="bc-kpi-grid">
      {kpis.map((item) => (
        <div className="bc-kpi" key={item.title}>
          <div
            className="bc-kpi-icon"
            style={{ background: item.accent }}
          >
            <Icon name={item.icon} size={24} />
          </div>

          <div className="bc-kpi-main">
            <span>{item.title}</span>
            <strong>{item.value}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}

// L'historique jour par jour du chiffre d'affaires n'existe pas encore côté
// base de données (il faudrait un journal des paiements, lié au chantier
// CinetPay/Paiements). En attendant, on affiche le vrai MRR actuel sans
// inventer de courbe de tendance.
function RevenueChart({ mrr, abonnementsActifs }) {
  const fmt = (n) => n.toLocaleString("fr-FR");
  return (
    <section className="bc-panel bc-revenue">
      <div className="bc-panel-head">
        <div>
          <h3>Revenu mensuel récurrent (MRR)</h3>
          <div className="bc-revenue-number">
            {fmt(mrr)} <span>FCFA</span>
          </div>
          <p>
            {abonnementsActifs} abonnement{abonnementsActifs > 1 ? "s" : ""} payant
            {abonnementsActifs > 1 ? "s" : ""} actif{abonnementsActifs > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="bc-chart-placeholder">
        <Icon name="chart" size={30} />
        <p>
          L'historique et la courbe d'évolution seront disponibles une fois le
          suivi des paiements CinetPay branché.
        </p>
      </div>
    </section>
  );
}

function RealTimeActivity({ evenements }) {
  return (
    <section className="bc-panel">
      <div className="bc-panel-head simple">
        <h3>Activité récente</h3>
      </div>

      {evenements.length === 0 ? (
        <p className="bc-empty">Aucune activité enregistrée pour le moment.</p>
      ) : (
        <div className="bc-activity-list">
          {evenements.map((item) => {
            const style = styleAction(item.action);
            return (
              <div className="bc-activity-row" key={item.id}>
                <div className="bc-mini-icon" style={{ background: style.color }}>
                  <Icon name={style.icon} size={18} />
                </div>

                <div className="bc-activity-copy">
                  <strong>
                    {item.action} — {item.entreprise}
                  </strong>
                  <span>
                    {item.auteur}
                    {item.details ? ` · ${item.details}` : ""}
                  </span>
                </div>

                <small>{ilYA(item.date)}</small>
                <i style={{ background: style.color }} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

const AVATAR_COLORS = ["#EDF3FF", "#EEE9FF", "#FFF3D0", "#E5F0FF", "#E0F7F4"];

function initialesDe(nom = "") {
  return nom
    .split(" ")
    .filter(Boolean)
    .map((mot) => mot[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function CompaniesPanel({ entreprises }) {
  return (
    <section className="bc-panel">
      <div className="bc-panel-head simple">
        <h3>Entreprises récentes</h3>
      </div>

      {entreprises.length === 0 ? (
        <p className="bc-empty">Aucune entreprise inscrite pour le moment.</p>
      ) : (
        <div className="bc-company-list">
          {entreprises.map((entreprise, index) => (
            <div className="bc-company-row" key={entreprise.id}>
              <div
                className="bc-company-avatar"
                style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
              >
                {initialesDe(entreprise.nom)}
              </div>

              <div>
                <strong>{entreprise.nom}</strong>
                <span>{libellePlan(entreprise.plan)}</span>
              </div>

              <small>{ilYA(entreprise.createdAt) || "—"}</small>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function SubscriptionsPanel({ entreprises }) {
  return (
    <section className="bc-panel">
      <div className="bc-panel-head simple">
        <h3>Abonnements payants actifs</h3>
      </div>

      {entreprises.length === 0 ? (
        <p className="bc-empty">Aucun abonnement payant actif pour le moment.</p>
      ) : (
        <div className="bc-subscription-list">
          {entreprises.map((entreprise, index) => (
            <div className="bc-subscription-row" key={entreprise.id}>
              <div
                className="bc-company-avatar"
                style={{
                  background: index % 2 === 0 ? COLORS.blueSoft : "#E9F8F5",
                  color: index % 2 === 0 ? COLORS.blue : "#17937A",
                }}
              >
                {initialesDe(entreprise.nom)}
              </div>

              <strong>{entreprise.nom}</strong>
              <span>{libellePlan(entreprise.plan)}</span>
              <b>Actif</b>
              <small>
                {entreprise.abonnement?.expireLe
                  ? `Expire le ${new Date(entreprise.abonnement.expireLe).toLocaleDateString("fr-FR")}`
                  : "—"}
              </small>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function OverviewPage({ stats, evenements }) {
  return (
    <>
      <KPIGrid stats={stats} />

      <div className="bc-main-grid">
        <RevenueChart mrr={stats.mrr} abonnementsActifs={stats.abonnementsActifs} />
        <RealTimeActivity evenements={evenements} />
      </div>

      <div className="bc-bottom-grid">
        <CompaniesPanel entreprises={stats.entreprisesRecentes} />
        <SubscriptionsPanel entreprises={stats.abonnementsRecents} />
      </div>
    </>
  );
}

function EntreprisesPage({ entreprises }) {
  const [recherche, setRecherche] = useState("");
  const [entrepriseOuverte, setEntrepriseOuverte] = useState(null);

  if (entrepriseOuverte) {
    return (
      <FicheEntreprise
        entreprise={entrepriseOuverte}
        onRetour={() => setEntrepriseOuverte(null)}
      />
    );
  }

  const rechercheNormalisee = recherche.trim().toLowerCase();
  const filtrees = rechercheNormalisee
    ? entreprises.filter(
        (e) =>
          e.nom.toLowerCase().includes(rechercheNormalisee) ||
          e.codeEntreprise.toLowerCase().includes(rechercheNormalisee)
      )
    : entreprises;

  return (
    <section className="bc-panel">
      <div className="bc-panel-head simple">
        <h3>Entreprises ({entreprises.length})</h3>
      </div>

      <input
        type="text"
        className="bc-entreprises-search"
        placeholder="Rechercher par nom ou code entreprise..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
      />

      {filtrees.length === 0 ? (
        <p className="bc-empty">
          {entreprises.length === 0
            ? "Aucune entreprise inscrite pour le moment."
            : "Aucune entreprise ne correspond à cette recherche."}
        </p>
      ) : (
        <div className="bc-company-list">
          {filtrees.map((entreprise, index) => (
            <button
              key={entreprise.id}
              className="bc-company-row bc-company-row-clickable"
              onClick={() => setEntrepriseOuverte(entreprise)}
            >
              <div
                className="bc-company-avatar"
                style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
              >
                {initialesDe(entreprise.nom)}
              </div>

              <div>
                <strong>{entreprise.nom}</strong>
                <span>
                  {libellePlan(entreprise.plan)} · {entreprise.nombreEmployes} employé
                  {entreprise.nombreEmployes > 1 ? "s" : ""}
                  {entreprise.abonnementActif ? (
                    <> · <span className="bc-badge-actif">Actif</span></>
                  ) : (
                    <> · <span className="bc-badge-gratuit">Gratuit</span></>
                  )}
                </span>
              </div>

              <small>{ilYA(entreprise.createdAt) || "—"}</small>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function FicheEntreprise({ entreprise, onRetour }) {
  const evenements = [...entreprise.journalActivite]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <div>
      <button className="bc-retour-link" onClick={onRetour}>
        ← Retour aux entreprises
      </button>

      <div className="bc-fiche-head">
        <div className="bc-company-avatar" style={{ background: COLORS.blueSoft }}>
          {initialesDe(entreprise.nom)}
        </div>
        <div>
          <h2>{entreprise.nom}</h2>
          <p>
            Code entreprise : {entreprise.codeEntreprise || "—"}
            {entreprise.adresse ? ` · ${entreprise.adresse}` : ""}
          </p>
        </div>
      </div>

      <div className="bc-fiche-kpis">
        <div className="bc-fiche-kpi">
          <span>Plan</span>
          <strong>{libellePlan(entreprise.plan)}</strong>
        </div>
        <div className="bc-fiche-kpi">
          <span>Statut abonnement</span>
          <strong>{entreprise.abonnementActif ? "Actif" : "Gratuit"}</strong>
        </div>
        <div className="bc-fiche-kpi">
          <span>Employés</span>
          <strong>{entreprise.nombreEmployes}</strong>
        </div>
        <div className="bc-fiche-kpi">
          <span>Dernière mise à jour</span>
          <strong>{ilYA(entreprise.createdAt) || "—"}</strong>
        </div>
        {entreprise.abonnement?.expireLe && (
          <div className="bc-fiche-kpi">
            <span>Expire le</span>
            <strong>
              {new Date(entreprise.abonnement.expireLe).toLocaleDateString("fr-FR")}
            </strong>
          </div>
        )}
      </div>

      <section className="bc-panel" style={{ marginBottom: 20 }}>
        <div className="bc-panel-head simple">
          <h3>Employés ({entreprise.employes.length})</h3>
        </div>

        {entreprise.employes.length === 0 ? (
          <p className="bc-empty">Aucun employé pour le moment.</p>
        ) : (
          <div className="bc-company-list">
            {entreprise.employes.map((emp) => (
              <div className="bc-company-row" key={emp.id}>
                <div className="bc-company-avatar">
                  {emp.initiales || initialesDe(emp.nom || "")}
                </div>
                <div>
                  <strong>{emp.nom}</strong>
                  <span>{emp.dept || "Sans département"}</span>
                </div>
                <small>{(emp.taches || []).length} tâche(s)</small>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bc-panel">
        <div className="bc-panel-head simple">
          <h3>Activité récente</h3>
        </div>

        {evenements.length === 0 ? (
          <p className="bc-empty">Aucune activité enregistrée pour cette entreprise.</p>
        ) : (
          <div className="bc-activity-list">
            {evenements.map((item) => {
              const style = styleAction(item.action);
              return (
                <div className="bc-activity-row" key={item.id}>
                  <div className="bc-mini-icon" style={{ background: style.color }}>
                    <Icon name={style.icon} size={18} />
                  </div>

                  <div className="bc-activity-copy">
                    <strong>{item.action}</strong>
                    <span>
                      {item.auteur}
                      {item.details ? ` · ${item.details}` : ""}
                    </span>
                  </div>

                  <small>{ilYA(item.date)}</small>
                  <i style={{ background: style.color }} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

const LIBELLES_TYPE_UTILISATEUR = {
  manager: "Administrateur principal",
  coadmin: "Co-administrateur",
  employe: "Employé",
};

const COULEURS_TYPE_UTILISATEUR = {
  manager: COLORS.blue,
  coadmin: COLORS.purple,
  employe: COLORS.green,
};

function UtilisateursPage({ utilisateurs }) {
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState("tous");

  const rechercheNormalisee = recherche.trim().toLowerCase();
  const filtres = utilisateurs.filter((u) => {
    if (filtreType !== "tous" && u.type !== filtreType) return false;
    if (!rechercheNormalisee) return true;
    return (
      u.nom.toLowerCase().includes(rechercheNormalisee) ||
      (u.email || "").toLowerCase().includes(rechercheNormalisee) ||
      u.entreprise.toLowerCase().includes(rechercheNormalisee)
    );
  });

  return (
    <section className="bc-panel">
      <div className="bc-panel-head simple">
        <h3>Utilisateurs ({utilisateurs.length})</h3>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="text"
          className="bc-entreprises-search"
          placeholder="Rechercher par nom, email ou entreprise..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />

        <select
          className="bc-entreprises-search"
          style={{ maxWidth: 220 }}
          value={filtreType}
          onChange={(e) => setFiltreType(e.target.value)}
        >
          <option value="tous">Tous les rôles</option>
          <option value="manager">Administrateurs principaux</option>
          <option value="coadmin">Co-administrateurs</option>
          <option value="employe">Employés</option>
        </select>
      </div>

      {filtres.length === 0 ? (
        <p className="bc-empty">
          {utilisateurs.length === 0
            ? "Aucun utilisateur trouvé."
            : "Aucun utilisateur ne correspond à cette recherche."}
        </p>
      ) : (
        <div className="bc-company-list">
          {filtres.map((u) => (
            <div className="bc-company-row" key={u.id}>
              <div className="bc-company-avatar">{initialesDe(u.nom)}</div>
              <div>
                <strong>{u.nom}</strong>
                <span>
                  {u.entreprise}
                  {u.poste ? ` · ${u.poste}` : ""}
                  {u.email ? ` · ${u.email}` : ""}
                </span>
              </div>
              <small style={{ color: COULEURS_TYPE_UTILISATEUR[u.type], fontWeight: 700 }}>
                {LIBELLES_TYPE_UTILISATEUR[u.type]}
              </small>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function statutAbonnement(entreprise) {
  if (entreprise.plan === "decouverte") return "gratuit";
  return entreprise.abonnementActif ? "actif" : "expire";
}

function AbonnementsPage({ entreprises }) {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");

  const avecStatut = entreprises.map((e) => ({ ...e, statut: statutAbonnement(e) }));

  const compteurs = {
    actif: avecStatut.filter((e) => e.statut === "actif").length,
    expire: avecStatut.filter((e) => e.statut === "expire").length,
    gratuit: avecStatut.filter((e) => e.statut === "gratuit").length,
  };

  const rechercheNormalisee = recherche.trim().toLowerCase();
  const filtrees = avecStatut.filter((e) => {
    if (filtreStatut !== "tous" && e.statut !== filtreStatut) return false;
    if (!rechercheNormalisee) return true;
    return (
      e.nom.toLowerCase().includes(rechercheNormalisee) ||
      e.codeEntreprise.toLowerCase().includes(rechercheNormalisee)
    );
  });

  const BADGE = {
    actif: { classe: "bc-badge-actif", texte: "Actif" },
    expire: { classe: "bc-badge-expire", texte: "Expiré" },
    gratuit: { classe: "bc-badge-gratuit", texte: "Gratuit" },
  };

  return (
    <section className="bc-panel">
      <div className="bc-panel-head simple">
        <h3>Abonnements ({entreprises.length})</h3>
      </div>

      <p style={{ fontSize: 12, color: COLORS.muted, margin: "0 0 14px" }}>
        {compteurs.actif} actif{compteurs.actif > 1 ? "s" : ""} · {compteurs.expire} expiré
        {compteurs.expire > 1 ? "s" : ""} · {compteurs.gratuit} gratuit
        {compteurs.gratuit > 1 ? "s" : ""}
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="text"
          className="bc-entreprises-search"
          placeholder="Rechercher par nom ou code entreprise..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />

        <select
          className="bc-entreprises-search"
          style={{ maxWidth: 200 }}
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
        >
          <option value="tous">Tous les statuts</option>
          <option value="actif">Actifs</option>
          <option value="expire">Expirés</option>
          <option value="gratuit">Gratuits</option>
        </select>
      </div>

      {filtrees.length === 0 ? (
        <p className="bc-empty">Aucune entreprise ne correspond à cette recherche.</p>
      ) : (
        <div className="bc-company-list">
          {filtrees.map((e, index) => (
            <div className="bc-company-row" key={e.id}>
              <div
                className="bc-company-avatar"
                style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
              >
                {initialesDe(e.nom)}
              </div>

              <div>
                <strong>{e.nom}</strong>
                <span>
                  {libellePlan(e.plan)}
                  {e.abonnement?.expireLe && (
                    <>
                      {" "}
                      · {e.statut === "expire" ? "Expiré le " : "Expire le "}
                      {new Date(e.abonnement.expireLe).toLocaleDateString("fr-FR")}
                    </>
                  )}
                </span>
              </div>

              <span className={BADGE[e.statut].classe}>{BADGE[e.statut].texte}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Vocabulaire de statut pas encore figé côté Jèko/BossClever (table
// encore vide) — on reconnaît les valeurs les plus probables et on
// retombe sur un badge neutre pour toute valeur imprévue, plutôt que de
// planter ou d'inventer un libellé.
function styleStatutPaiement(statut = "") {
  const s = statut.toLowerCase();
  if (["success", "succes", "réussi", "reussi", "actif", "paye", "payé"].includes(s))
    return { classe: "bc-badge-actif", texte: statut || "Réussi" };
  if (["pending", "en_attente", "attente"].includes(s))
    return { classe: "bc-badge-gratuit", texte: statut || "En attente" };
  if (["failed", "echoue", "échoué", "error", "erreur"].includes(s))
    return { classe: "bc-badge-expire", texte: statut || "Échoué" };
  return { classe: "bc-badge-gratuit", texte: statut || "—" };
}

function PaiementsPage({ paiements }) {
  const [recherche, setRecherche] = useState("");

  const rechercheNormalisee = recherche.trim().toLowerCase();
  const filtres = paiements.filter((p) => {
    if (!rechercheNormalisee) return true;
    return (
      (p.nom_entreprise || "").toLowerCase().includes(rechercheNormalisee) ||
      (p.email || "").toLowerCase().includes(rechercheNormalisee) ||
      (p.transaction_id || "").toLowerCase().includes(rechercheNormalisee)
    );
  });

  const totalParDevise = paiements
    .filter((p) => styleStatutPaiement(p.statut).classe === "bc-badge-actif")
    .reduce((acc, p) => {
      const devise = p.devise || "XOF";
      acc[devise] = (acc[devise] || 0) + (Number(p.montant) || 0);
      return acc;
    }, {});

  return (
    <section className="bc-panel">
      <div className="bc-panel-head simple">
        <h3>Paiements ({paiements.length})</h3>
      </div>

      {paiements.length === 0 ? (
        <p className="bc-empty">
          Aucun paiement enregistré pour le moment. Cette page s'alimentera
          automatiquement dès que les paiements confirmés seront enregistrés
          dans la table <code>paiements</code>.
        </p>
      ) : (
        <>
          {Object.keys(totalParDevise).length > 0 && (
            <p style={{ fontSize: 12, color: COLORS.muted, margin: "0 0 14px" }}>
              Total encaissé :{" "}
              {Object.entries(totalParDevise)
                .map(([devise, total]) => `${total.toLocaleString("fr-FR")} ${devise}`)
                .join(" · ")}
            </p>
          )}

          <input
            type="text"
            className="bc-entreprises-search"
            placeholder="Rechercher par entreprise, email ou transaction..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />

          {filtres.length === 0 ? (
            <p className="bc-empty">Aucun paiement ne correspond à cette recherche.</p>
          ) : (
            <div className="bc-company-list">
              {filtres.map((p, index) => {
                const badge = styleStatutPaiement(p.statut);
                return (
                  <div className="bc-company-row" key={p.id}>
                    <div
                      className="bc-company-avatar"
                      style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
                    >
                      {initialesDe(p.nom_entreprise || "")}
                    </div>

                    <div>
                      <strong>{p.nom_entreprise || "Entreprise inconnue"}</strong>
                      <span>
                        {libellePlan(p.plan)}
                        {p.periode ? ` · ${p.periode}` : ""}
                        {p.montant ? ` · ${Number(p.montant).toLocaleString("fr-FR")} ${p.devise || "XOF"}` : ""}
                        {p.moyen_paiement ? ` · ${p.moyen_paiement}` : ""}
                      </span>
                    </div>

                    <span style={{ display: "flex", alignItems: "center", gap: 8, justifySelf: "end" }}>
                      <span className={badge.classe}>{badge.texte}</span>
                      <small>{ilYA(p.date_paiement || p.created_at) || "—"}</small>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function ActivitePage({ evenements }) {
  const [recherche, setRecherche] = useState("");

  const rechercheNormalisee = recherche.trim().toLowerCase();
  const filtres = rechercheNormalisee
    ? evenements.filter(
        (e) =>
          e.entreprise.toLowerCase().includes(rechercheNormalisee) ||
          (e.auteur || "").toLowerCase().includes(rechercheNormalisee) ||
          (e.action || "").toLowerCase().includes(rechercheNormalisee)
      )
    : evenements;

  return (
    <section className="bc-panel">
      <div className="bc-panel-head simple">
        <h3>Activité ({evenements.length})</h3>
      </div>

      <input
        type="text"
        className="bc-entreprises-search"
        placeholder="Rechercher par entreprise, auteur ou action..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
      />

      {filtres.length === 0 ? (
        <p className="bc-empty">
          {evenements.length === 0
            ? "Aucune activité enregistrée pour le moment."
            : "Aucune activité ne correspond à cette recherche."}
        </p>
      ) : (
        <div className="bc-activity-list">
          {filtres.map((item, index) => {
            const style = styleAction(item.action);
            return (
              <div className="bc-activity-row" key={item.id || index}>
                <div className="bc-mini-icon" style={{ background: style.color }}>
                  <Icon name={style.icon} size={18} />
                </div>

                <div className="bc-activity-copy">
                  <strong>
                    {item.action} — {item.entreprise}
                  </strong>
                  <span>
                    {item.auteur}
                    {item.details ? ` · ${item.details}` : ""}
                  </span>
                </div>

                <small>{ilYA(item.date)}</small>
                <i style={{ background: style.color }} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ParametresPage({
  parametresPlateforme,
  setParametresPlateforme,
  tarifsPlans,
  setTarifsPlans,
}) {
  const [nomPlateforme, setNomPlateforme] = useState(parametresPlateforme.nom_plateforme);
  const [emailSupport, setEmailSupport] = useState(parametresPlateforme.email_support);
  const [enregistrementInfos, setEnregistrementInfos] = useState(false);
  const [messageInfos, setMessageInfos] = useState("");

  const [tarifsEdition, setTarifsEdition] = useState({
    essentiel: {
      prix_mensuel: tarifsPlans.essentiel?.prix_mensuel ?? 15000,
      prix_annuel: tarifsPlans.essentiel?.prix_annuel ?? 150000,
    },
    croissance: {
      prix_mensuel: tarifsPlans.croissance?.prix_mensuel ?? 35000,
      prix_annuel: tarifsPlans.croissance?.prix_annuel ?? 350000,
    },
  });
  const [enregistrementTarifPour, setEnregistrementTarifPour] = useState(null);
  const [messageTarifs, setMessageTarifs] = useState("");

  const enregistrerInfos = async () => {
    setEnregistrementInfos(true);
    setMessageInfos("");
    const { error } = await supabase
      .from("parametres_plateforme")
      .update({
        nom_plateforme: nomPlateforme,
        email_support: emailSupport,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) {
      setMessageInfos("Erreur : " + error.message);
    } else {
      setParametresPlateforme({ nom_plateforme: nomPlateforme, email_support: emailSupport });
      setMessageInfos("Enregistré ✓");
    }
    setEnregistrementInfos(false);
  };

  const enregistrerTarif = async (planId) => {
    setEnregistrementTarifPour(planId);
    setMessageTarifs("");
    const prixMensuel = Number(tarifsEdition[planId].prix_mensuel);
    const prixAnnuel = Number(tarifsEdition[planId].prix_annuel);

    if (!prixMensuel || !prixAnnuel || prixMensuel <= 0 || prixAnnuel <= 0) {
      setMessageTarifs("Les deux prix doivent être des nombres positifs.");
      setEnregistrementTarifPour(null);
      return;
    }

    const { error } = await supabase
      .from("plans_tarifs")
      .update({
        prix_mensuel: prixMensuel,
        prix_annuel: prixAnnuel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId);

    if (error) {
      setMessageTarifs("Erreur : " + error.message);
    } else {
      setTarifsPlans((prev) => ({
        ...prev,
        [planId]: { prix_mensuel: prixMensuel, prix_annuel: prixAnnuel },
      }));
      setMessageTarifs(`Tarif ${libellePlan(planId)} enregistré ✓`);
    }
    setEnregistrementTarifPour(null);
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <section className="bc-panel">
        <div className="bc-panel-head simple">
          <h3>Informations générales</h3>
        </div>

        <div style={{ display: "grid", gap: 14, maxWidth: 420 }}>
          <label style={{ fontSize: 12, color: COLORS.muted }}>
            Nom de la plateforme
            <input
              type="text"
              className="bc-settings-input"
              value={nomPlateforme}
              onChange={(e) => setNomPlateforme(e.target.value)}
            />
          </label>

          <label style={{ fontSize: 12, color: COLORS.muted }}>
            Email de support
            <input
              type="email"
              className="bc-settings-input"
              value={emailSupport}
              onChange={(e) => setEmailSupport(e.target.value)}
            />
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="bc-save-btn"
              onClick={enregistrerInfos}
              disabled={enregistrementInfos}
            >
              {enregistrementInfos ? "Enregistrement..." : "Enregistrer"}
            </button>
            {messageInfos && (
              <span
                style={{
                  fontSize: 12,
                  color: messageInfos.startsWith("Erreur") ? COLORS.red : COLORS.green,
                }}
              >
                {messageInfos}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="bc-panel">
        <div className="bc-panel-head simple">
          <h3>Tarifs des plans payants</h3>
        </div>

        <p style={{ fontSize: 12, color: COLORS.muted, margin: "0 0 16px" }}>
          Ces prix s'appliquent immédiatement aux nouveaux abonnements et sur l'écran
          d'abonnement des managers. Vérifiez-les avant d'enregistrer.
        </p>

        <div style={{ display: "grid", gap: 14 }}>
          {["essentiel", "croissance"].map((planId) => (
            <div
              key={planId}
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 16,
              }}
            >
              <strong style={{ fontSize: 13, display: "block", marginBottom: 10 }}>
                {libellePlan(planId)}
              </strong>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <label style={{ fontSize: 11.5, color: COLORS.muted }}>
                  Prix mensuel (FCFA)
                  <input
                    type="number"
                    className="bc-settings-input"
                    style={{ maxWidth: 160 }}
                    value={tarifsEdition[planId].prix_mensuel}
                    onChange={(e) =>
                      setTarifsEdition((prev) => ({
                        ...prev,
                        [planId]: { ...prev[planId], prix_mensuel: e.target.value },
                      }))
                    }
                  />
                </label>

                <label style={{ fontSize: 11.5, color: COLORS.muted }}>
                  Prix annuel (FCFA)
                  <input
                    type="number"
                    className="bc-settings-input"
                    style={{ maxWidth: 160 }}
                    value={tarifsEdition[planId].prix_annuel}
                    onChange={(e) =>
                      setTarifsEdition((prev) => ({
                        ...prev,
                        [planId]: { ...prev[planId], prix_annuel: e.target.value },
                      }))
                    }
                  />
                </label>

                <button
                  className="bc-save-btn"
                  onClick={() => enregistrerTarif(planId)}
                  disabled={enregistrementTarifPour === planId}
                >
                  {enregistrementTarifPour === planId ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {messageTarifs && (
          <p
            style={{
              fontSize: 12,
              marginTop: 12,
              color: messageTarifs.startsWith("Erreur") ? COLORS.red : COLORS.green,
            }}
          >
            {messageTarifs}
          </p>
        )}
      </section>
    </div>
  );
}

function PlaceholderPage({ title, icon }) {
  return (
    <section className="bc-placeholder">
      <div className="bc-placeholder-icon">
        <Icon name={icon} size={34} />
      </div>

      <h2>{title}</h2>

      <p>
        Cette rubrique du portail Super Admin BossClever est prête à recevoir
        ses données réelles et ses fonctionnalités.
      </p>

      <button>
        <Icon name="plus" size={17} />
        Configurer cette rubrique
      </button>
    </section>
  );
}

const STATS_VIDES = {
  nombreEntreprises: 0,
  nombreUtilisateurs: 0,
  abonnementsActifs: 0,
  comptesGratuits: 0,
  mrr: 0,
  tauxConversion: 0,
  entreprisesRecentes: [],
  toutesLesEntreprises: [],
  abonnementsRecents: [],
};

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(STATS_VIDES);
  const [evenements, setEvenements] = useState([]);
  const [tousLesEvenements, setTousLesEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [tarifsPlans, setTarifsPlans] = useState({});
  const [parametresPlateforme, setParametresPlateforme] = useState({
    nom_plateforme: "BossClever",
    email_support: "contact@cleverentreprises.com",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAdminEmail(data?.user?.email || "");
    });
  }, []);

  const deconnecter = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  useEffect(() => {
    const chargerDonneesPlateforme = async () => {
      setChargement(true);
      setErreur("");

      const { data, error } = await supabase
        .from("etat_app")
        .select("id, donnees, code_entreprise, updated_at, owner_id");

      if (error) {
        console.error("Erreur chargement données plateforme :", error);
        setErreur(
          "Impossible de charger les données des entreprises. Vérifiez les droits d'accès Super Admin sur la table etat_app."
        );
        setChargement(false);
        return;
      }

      const lignes = data || [];

      // Tarifs à jour des plans payants (éditables depuis "Paramètres").
      // Non bloquant : si la table n'existe pas encore, on retombe sur
      // les prix par défaut codés dans PLANS_INFO.
      const { data: tarifsData, error: tarifsError } = await supabase
        .from("plans_tarifs")
        .select("id, prix_mensuel, prix_annuel");

      if (tarifsError) {
        console.error("Erreur chargement tarifs :", tarifsError);
      }

      const tarifsParId = {};
      (tarifsData || []).forEach((t) => {
        tarifsParId[t.id] = { prix_mensuel: t.prix_mensuel, prix_annuel: t.prix_annuel };
      });
      setTarifsPlans(tarifsParId);

      // Informations générales de la plateforme (nom, email support),
      // éditables depuis "Paramètres". Non bloquant également.
      const { data: parametresData, error: parametresError } = await supabase
        .from("parametres_plateforme")
        .select("nom_plateforme, email_support")
        .eq("id", 1)
        .maybeSingle();

      if (parametresError) {
        console.error("Erreur chargement paramètres plateforme :", parametresError);
      }

      if (parametresData) {
        setParametresPlateforme(parametresData);
      }

      setStats(calculerStatsPlateforme(lignes, tarifsParId));

      // Agrège tout le journal d'activité de chaque entreprise : les 8
      // plus récents alimentent l'Aperçu, la liste complète alimente la
      // page dédiée "Activité".
      const evenementsAgreges = lignes.flatMap((ligne) => {
        const nomEntreprise =
          ligne.donnees?.nomEntreprise?.trim() || ligne.code_entreprise || "Entreprise";
        return (ligne.donnees?.journalActivite || []).map((evt) => ({
          ...evt,
          entreprise: nomEntreprise,
        }));
      });
      evenementsAgreges.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvenements(evenementsAgreges.slice(0, 8));
      setTousLesEvenements(evenementsAgreges);

      // Co-administrateurs invités par chaque entreprise. Requête séparée
      // et non bloquante : si la policy RLS dédiée n'est pas encore en
      // place côté Supabase, on continue simplement sans eux plutôt que
      // de faire échouer toute la page.
      const { data: adminsData, error: adminsError } = await supabase
        .from("administrateurs_comptes")
        .select("id, owner_id, email, nom, prenom, poste");

      if (adminsError) {
        console.error("Erreur chargement co-administrateurs :", adminsError);
      }

      setUtilisateurs(construireUtilisateurs(lignes, adminsData || []));

      // Historique des paiements réels (table encore vide tant qu'aucun
      // webhook Jèko n'enregistre les transactions confirmées). Non
      // bloquant, même logique de tolérance que ci-dessus.
      const { data: paiementsData, error: paiementsError } = await supabase
        .from("paiements")
        .select(
          "id, created_at, entreprise_id, nom_entreprise, plan, periode, montant, devise, moyen_paiement, statut, transaction_id, reference_jeko, email, date_paiement"
        )
        .order("created_at", { ascending: false });

      if (paiementsError) {
        console.error("Erreur chargement paiements :", paiementsError);
      }

      setPaiements(paiementsData || []);

      setChargement(false);
    };

    chargerDonneesPlateforme();
  }, []);
  const activeItem =
    menuItems.find((item) => item.id === active) || menuItems[0];

  return (
    <div className="bc-admin-app">
      <style>{styles}</style>

      <Sidebar
        active={active}
        setActive={setActive}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <main className="bc-content">
        <Topbar
          title={activeItem.label}
          openSidebar={() => setSidebarOpen(true)}
          adminEmail={adminEmail}
          onDeconnexion={deconnecter}
        />

        <div className="bc-page">
          {active === "overview" ? (
            erreur ? (
              <div className="bc-error-banner">⚠️ {erreur}</div>
            ) : chargement ? (
              <p className="bc-empty">Chargement des données…</p>
            ) : (
              <OverviewPage stats={stats} evenements={evenements} />
            )
          ) : active === "companies" ? (
            erreur ? (
              <div className="bc-error-banner">⚠️ {erreur}</div>
            ) : chargement ? (
              <p className="bc-empty">Chargement des données…</p>
            ) : (
              <EntreprisesPage entreprises={stats.toutesLesEntreprises} />
            )
          ) : active === "users" ? (
            erreur ? (
              <div className="bc-error-banner">⚠️ {erreur}</div>
            ) : chargement ? (
              <p className="bc-empty">Chargement des données…</p>
            ) : (
              <UtilisateursPage utilisateurs={utilisateurs} />
            )
          ) : active === "subscriptions" ? (
            erreur ? (
              <div className="bc-error-banner">⚠️ {erreur}</div>
            ) : chargement ? (
              <p className="bc-empty">Chargement des données…</p>
            ) : (
              <AbonnementsPage entreprises={stats.toutesLesEntreprises} />
            )
          ) : active === "payments" ? (
            erreur ? (
              <div className="bc-error-banner">⚠️ {erreur}</div>
            ) : chargement ? (
              <p className="bc-empty">Chargement des données…</p>
            ) : (
              <PaiementsPage paiements={paiements} />
            )
          ) : active === "activity" ? (
            erreur ? (
              <div className="bc-error-banner">⚠️ {erreur}</div>
            ) : chargement ? (
              <p className="bc-empty">Chargement des données…</p>
            ) : (
              <ActivitePage evenements={tousLesEvenements} />
            )
          ) : active === "settings" ? (
            <ParametresPage
              parametresPlateforme={parametresPlateforme}
              setParametresPlateforme={setParametresPlateforme}
              tarifsPlans={tarifsPlans}
              setTarifsPlans={setTarifsPlans}
            />
          ) : (
            <PlaceholderPage
              title={activeItem.label}
              icon={activeItem.icon}
            />
          )}
        </div>

        <footer className="bc-footer">
          <span>© 2026 BossClever. Tous droits réservés.</span>
          <span>
            Fait avec ❤️ en Côte d'Ivoire 🇨🇮
          </span>
        </footer>
      </main>
    </div>
  );
}

const styles = `
*{
  box-sizing:border-box;
}

html,body,#root{
  margin:0;
  min-height:100%;
}

body{
  font-family:Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background:${COLORS.bg};
  color:${COLORS.text};
}

button,input,select{
  font:inherit;
}

button{
  cursor:pointer;
}

.bc-admin-app{
  min-height:100vh;
  background:${COLORS.bg};
}

/* ============================
   SIDEBAR
============================ */

.bc-sidebar{
  position:fixed;
  inset:0 auto 0 0;
  width:245px;
  background:
    linear-gradient(180deg,#287DF1 0%,#3682EF 46%,#2675E3 100%);
  color:white;
  padding:22px 14px;
  display:flex;
  flex-direction:column;
  z-index:60;
  box-shadow:8px 0 30px rgba(24,119,242,.12);
}

.bc-brand{
  display:flex;
  align-items:center;
  gap:10px;
  padding:0 10px;
}

.bc-brand-icon{
  font-size:29px;
}

.bc-brand-name{
  font-weight:800;
  font-size:27px;
  letter-spacing:-1px;
}

.bc-brand-name span{
  color:${COLORS.yellow};
}

.bc-super-badge{
  margin:17px auto 14px;
  border:1px solid rgba(255,255,255,.22);
  background:rgba(255,255,255,.10);
  color:${COLORS.yellow};
  border-radius:9px;
  font-size:11px;
  font-weight:800;
  padding:7px 12px;
}

.bc-side-nav{
  display:flex;
  flex-direction:column;
  gap:5px;
}

.bc-nav-item{
  width:100%;
  border:0;
  background:transparent;
  color:white;
  display:flex;
  align-items:center;
  gap:12px;
  padding:12px 13px;
  border-radius:10px;
  text-align:left;
  font-weight:600;
  transition:.2s ease;
}

.bc-nav-item:hover,
.bc-nav-item.active{
  background:rgba(255,255,255,.19);
}

.bc-security-dot{
  width:7px;
  height:7px;
  background:${COLORS.yellow};
  border-radius:50%;
  margin-left:auto;
}

.bc-quick-title{
  margin:26px 10px 10px;
  font-size:10px;
  font-weight:800;
  letter-spacing:.8px;
  opacity:.75;
}

.bc-quick-box{
  border:1px solid rgba(255,255,255,.18);
  border-radius:11px;
  padding:5px;
  display:flex;
  flex-direction:column;
}

.bc-quick-box button{
  border:0;
  background:transparent;
  color:white;
  padding:10px;
  display:flex;
  align-items:center;
  gap:10px;
  text-align:left;
  border-radius:8px;
  font-size:13px;
}

.bc-quick-box button:hover{
  background:rgba(255,255,255,.12);
}

.bc-profile{
  margin-top:auto;
  border:1px solid rgba(255,255,255,.18);
  border-radius:12px;
  padding:12px;
  display:flex;
  align-items:center;
  gap:10px;
  position:relative;
  background:rgba(255,255,255,.06);
}

.bc-avatar{
  width:38px;
  height:38px;
  border-radius:50%;
  background:#fff;
  color:${COLORS.blue};
  display:grid;
  place-items:center;
  font-weight:800;
}

.bc-avatar.small{
  width:34px;
  height:34px;
}

.bc-profile strong,
.bc-admin strong{
  display:block;
  font-size:11px;
}

.bc-profile span,
.bc-admin span{
  display:block;
  font-size:11px;
  opacity:.82;
  margin-top:3px;
}

.bc-online{
  position:absolute;
  width:9px;
  height:9px;
  background:#32D071;
  border-radius:50%;
  border:2px solid ${COLORS.blue};
  left:40px;
  bottom:12px;
}

.bc-version{
  margin-top:18px;
  font-size:11px;
  opacity:.75;
  padding:0 9px;
}

/* ============================
   CONTENT / TOPBAR
============================ */

.bc-content{
  margin-left:245px;
  min-height:100vh;
}

.bc-topbar{
  height:72px;
  background:white;
  border-bottom:1px solid ${COLORS.border};
  display:flex;
  align-items:center;
  gap:24px;
  padding:0 28px;
  position:sticky;
  top:0;
  z-index:40;
}

.bc-topbar h1{
  font-size:21px;
  margin:0;
  min-width:120px;
}

.bc-search{
  margin:auto;
  width:min(410px,45vw);
  height:42px;
  border:1px solid ${COLORS.border};
  border-radius:10px;
  display:flex;
  align-items:center;
  gap:9px;
  padding:0 12px;
  color:${COLORS.muted};
}

.bc-search input{
  border:0;
  outline:0;
  flex:1;
  min-width:0;
}

.bc-search span{
  border:1px solid ${COLORS.border};
  border-radius:7px;
  padding:3px 7px;
  font-size:11px;
}

.bc-top-actions{
  display:flex;
  align-items:center;
  gap:10px;
}

.bc-icon-btn{
  position:relative;
  background:transparent;
  border:0;
  color:${COLORS.text};
  padding:8px;
}

.bc-notification{
  position:absolute;
  right:0;
  top:2px;
  min-width:17px;
  height:17px;
  background:#EF3131;
  color:white;
  border-radius:999px;
  display:grid;
  place-items:center;
  font-size:10px;
  font-weight:800;
}

.bc-admin{
  border-left:1px solid ${COLORS.border};
  margin-left:7px;
  padding-left:17px;
  display:flex;
  align-items:center;
  gap:9px;
}

.bc-logout-link{
  font-family:inherit;
  font-size:11px;
  font-weight:600;
  color:${COLORS.blue};
  background:none;
  border:none;
  padding:0;
  margin-top:2px;
  cursor:pointer;
  display:flex;
  align-items:center;
  gap:4px;
  transition:color .15s ease;
}

.bc-logout-link:hover{
  color:${COLORS.blueDark};
  text-decoration:underline;
}

.bc-mobile-menu{
  display:none;
  background:transparent;
  border:0;
}

/* ============================
   PAGE
============================ */

.bc-page{
  padding:22px 26px 30px;
}

.bc-kpi-grid{
  display:grid;
  grid-template-columns:repeat(6,minmax(0,1fr));
  gap:13px;
}

.bc-kpi{
  background:white;
  border:1px solid ${COLORS.border};
  border-radius:13px;
  padding:18px;
  min-width:0;
  display:flex;
  gap:12px;
  box-shadow:0 7px 25px rgba(15,47,88,.035);
}

.bc-kpi-icon{
  width:46px;
  height:46px;
  border-radius:10px;
  color:white;
  display:grid;
  place-items:center;
  flex:0 0 auto;
}

.bc-kpi-main{
  min-width:0;
}

.bc-kpi-main>span{
  color:${COLORS.muted};
  font-size:11px;
}

.bc-kpi-main strong{
  display:block;
  margin:5px 0 10px;
  font-size:21px;
  line-height:1.1;
  color:${COLORS.text};
}

.bc-kpi-main small{
  font-weight:700;
  font-size:11px;
  white-space:nowrap;
}

.bc-kpi-main small em{
  color:${COLORS.muted};
  font-style:normal;
  margin-left:4px;
  font-weight:500;
}

.positive{
  color:${COLORS.green};
}

.negative{
  color:${COLORS.red};
}

.bc-main-grid{
  display:grid;
  grid-template-columns:minmax(0,1.65fr) minmax(320px,.95fr);
  gap:16px;
  margin-top:18px;
}

.bc-bottom-grid{
  display:grid;
  grid-template-columns:.95fr 1.05fr 1.2fr;
  gap:16px;
  margin-top:16px;
}

.bc-panel{
  background:white;
  border:1px solid ${COLORS.border};
  border-radius:14px;
  padding:18px;
  box-shadow:0 7px 25px rgba(15,47,88,.035);
  min-width:0;
}

.bc-panel-head{
  display:flex;
  justify-content:space-between;
  gap:20px;
  align-items:flex-start;
}

.bc-panel-head.simple{
  align-items:center;
}

.bc-panel-head h3{
  margin:0;
  font-size:16px;
}

.bc-panel-head select,
.bc-panel-head button{
  border:1px solid ${COLORS.border};
  background:white;
  padding:8px 12px;
  border-radius:8px;
  color:${COLORS.text};
}

.bc-panel-head button{
  font-size:11px;
}

.bc-revenue-number{
  font-size:23px;
  font-weight:800;
  margin-top:18px;
}

.bc-revenue-number span{
  font-size:13px;
  font-weight:600;
}

.bc-revenue-number b{
  display:inline-block;
  margin-left:9px;
  font-size:11px;
  color:${COLORS.green};
  background:#E9F7EF;
  padding:5px 7px;
  border-radius:7px;
}

.bc-revenue p{
  color:${COLORS.muted};
  font-size:11px;
  margin:5px 0;
}

.bc-chart-wrap{
  display:flex;
  margin-top:15px;
  height:205px;
}

.bc-chart-y{
  width:40px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  color:${COLORS.muted};
  font-size:10px;
  padding-bottom:2px;
}

.bc-chart-svg{
  width:100%;
  height:100%;
}

.bc-chart-x{
  margin-left:42px;
  display:flex;
  justify-content:space-between;
  color:${COLORS.muted};
  font-size:10px;
  margin-top:5px;
}

.bc-chart-placeholder{
  margin-top:18px;
  padding:24px;
  border:1px dashed ${COLORS.border};
  border-radius:12px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:10px;
  color:${COLORS.muted};
  text-align:center;
}

.bc-chart-placeholder p{
  font-size:12px;
  max-width:320px;
  margin:0;
  line-height:1.6;
}

.bc-empty{
  color:${COLORS.muted};
  font-size:12.5px;
  text-align:center;
  padding:20px 0;
}

.bc-error-banner{
  background:#FDEDEC;
  color:#B3261E;
  border:1px solid #F5C6C2;
  border-radius:12px;
  padding:14px 18px;
  font-size:13px;
}

.bc-activity-list{
  display:flex;
  flex-direction:column;
  margin-top:12px;
}

.bc-activity-row{
  display:grid;
  grid-template-columns:40px minmax(0,1fr) auto 7px;
  gap:10px;
  align-items:center;
  min-height:56px;
}

.bc-mini-icon{
  width:37px;
  height:37px;
  border-radius:50%;
  color:white;
  display:grid;
  place-items:center;
}

.bc-activity-copy strong{
  display:block;
  font-size:12px;
  margin-bottom:3px;
}

.bc-activity-copy span{
  font-size:11px;
  color:#596B85;
}

.bc-activity-row small{
  font-size:10px;
  color:${COLORS.muted};
}

.bc-activity-row i{
  width:7px;
  height:7px;
  border-radius:50%;
}

.bc-company-list,
.bc-subscription-list,
.bc-alert-list{
  margin-top:11px;
}

.bc-company-row{
  min-height:48px;
  display:grid;
  grid-template-columns:36px minmax(0,1fr) auto;
  gap:10px;
  align-items:center;
}

.bc-company-avatar{
  width:31px;
  height:31px;
  border-radius:50%;
  display:grid;
  place-items:center;
  font-size:10px;
  font-weight:800;
  color:#516078;
}

.bc-company-row strong{
  font-size:11px;
  display:block;
}

/* ============================
   PAGE ENTREPRISES (liste + fiche)
============================ */

.bc-company-row-clickable{
  width:100%;
  text-align:left;
  background:#fff;
  border:1px solid transparent;
  border-radius:10px;
  padding:6px 8px;
  cursor:pointer;
  transition:border-color .15s ease, background .15s ease;
}

.bc-company-row-clickable:hover{
  border-color:${COLORS.border};
  background:${COLORS.bg};
}

.bc-entreprises-search{
  width:100%;
  max-width:340px;
  padding:9px 13px;
  border-radius:10px;
  border:1px solid ${COLORS.border};
  font-size:12.5px;
  font-family:inherit;
  margin-bottom:14px;
  outline:none;
}

.bc-entreprises-search:focus{
  border-color:${COLORS.blue};
}

.bc-badge-actif,
.bc-badge-gratuit,
.bc-badge-expire{
  font-size:10px;
  font-weight:700;
  padding:2px 8px;
  border-radius:20px;
  white-space:nowrap;
}

.bc-badge-actif{
  color:${COLORS.green};
  background:#E7F8EE;
}

.bc-badge-gratuit{
  color:${COLORS.muted};
  background:${COLORS.bg};
}

.bc-badge-expire{
  color:${COLORS.red};
  background:#FDEDEC;
}

.bc-retour-link{
  background:none;
  border:none;
  font-family:inherit;
  font-size:12.5px;
  font-weight:600;
  color:${COLORS.blue};
  cursor:pointer;
  padding:0;
  margin-bottom:16px;
}

.bc-retour-link:hover{
  text-decoration:underline;
}

.bc-fiche-head{
  display:flex;
  align-items:center;
  gap:14px;
  margin-bottom:18px;
}

.bc-fiche-head .bc-company-avatar{
  width:52px;
  height:52px;
  font-size:16px;
}

.bc-fiche-head h2{
  margin:0;
  font-size:18px;
  color:${COLORS.text};
}

.bc-fiche-head p{
  margin:3px 0 0;
  font-size:12px;
  color:${COLORS.muted};
}

.bc-fiche-kpis{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));
  gap:12px;
  margin-bottom:22px;
}

.bc-fiche-kpi{
  background:#fff;
  border:1px solid ${COLORS.border};
  border-radius:12px;
  padding:14px 16px;
}

.bc-fiche-kpi span{
  display:block;
  font-size:10.5px;
  color:${COLORS.muted};
  margin-bottom:4px;
}

.bc-fiche-kpi strong{
  font-size:16px;
  color:${COLORS.text};
}

.bc-company-row span{
  color:${COLORS.muted};
  font-size:10px;
  display:block;
  margin-top:3px;
}

.bc-company-row small{
  color:${COLORS.muted};
  font-size:10px;
}

.bc-subscription-row{
  min-height:48px;
  display:grid;
  grid-template-columns:32px minmax(95px,1fr) auto auto auto;
  gap:8px;
  align-items:center;
}

.bc-subscription-row strong{
  font-size:10.5px;
}

.bc-subscription-row span,
.bc-subscription-row small{
  color:${COLORS.muted};
  font-size:9.5px;
}

.bc-subscription-row b{
  color:${COLORS.green};
  background:#E7F6ED;
  border-radius:6px;
  font-size:9px;
  padding:4px 6px;
}

.bc-alert-row{
  width:100%;
  border:0;
  border-bottom:1px solid ${COLORS.border};
  background:transparent;
  min-height:59px;
  display:grid;
  grid-template-columns:38px minmax(0,1fr) auto 12px;
  gap:10px;
  align-items:center;
  text-align:left;
  padding:7px 0;
}

.bc-alert-row:last-child{
  border-bottom:0;
}

.bc-alert-icon{
  width:35px;
  height:35px;
  color:white;
  border-radius:10px;
  display:grid;
  place-items:center;
}

.bc-alert-row strong{
  font-size:11px;
  display:block;
}

.bc-alert-row span{
  display:block;
  color:${COLORS.muted};
  font-size:10px;
  margin-top:3px;
}

.bc-alert-row>b{
  min-width:25px;
  height:25px;
  border-radius:999px;
  display:grid;
  place-items:center;
  font-size:11px;
}

.bc-chevron{
  font-size:20px!important;
  color:${COLORS.text}!important;
}

/* ============================
   PLACEHOLDER PAGES
============================ */

.bc-placeholder{
  min-height:65vh;
  background:white;
  border:1px solid ${COLORS.border};
  border-radius:18px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  padding:50px;
}

.bc-placeholder-icon{
  width:74px;
  height:74px;
  background:${COLORS.blueSoft};
  color:${COLORS.blue};
  border-radius:20px;
  display:grid;
  place-items:center;
}

.bc-placeholder h2{
  margin:20px 0 8px;
  font-size:30px;
}

.bc-placeholder p{
  max-width:560px;
  color:${COLORS.muted};
  line-height:1.7;
}

.bc-placeholder button{
  border:0;
  background:${COLORS.blue};
  color:white;
  padding:12px 17px;
  border-radius:10px;
  display:flex;
  gap:8px;
  align-items:center;
  margin-top:10px;
}

.bc-save-btn{
  border:0;
  background:${COLORS.blue};
  color:white;
  padding:9px 16px;
  border-radius:9px;
  font-size:12.5px;
  font-weight:600;
  font-family:inherit;
  cursor:pointer;
}

.bc-save-btn:disabled{
  opacity:.6;
  cursor:default;
}

.bc-settings-input{
  display:block;
  margin-top:4px;
  padding:9px 12px;
  border-radius:9px;
  border:1px solid ${COLORS.border};
  font-size:12.5px;
  font-family:inherit;
  outline:none;
}

.bc-settings-input:focus{
  border-color:${COLORS.blue};
}

/* ============================
   FOOTER
============================ */

.bc-footer{
  padding:17px 27px 23px;
  display:flex;
  justify-content:space-between;
  font-size:10px;
  color:${COLORS.muted};
}

/* ============================
   RESPONSIVE
============================ */

.bc-overlay{
  display:none;
}

@media(max-width:1350px){
  .bc-kpi-grid{
    grid-template-columns:repeat(3,1fr);
  }

  .bc-bottom-grid{
    grid-template-columns:1fr 1fr;
  }

  .bc-bottom-grid .bc-panel:last-child{
    grid-column:1 / -1;
  }
}

@media(max-width:1000px){
  .bc-sidebar{
    transform:translateX(-105%);
    transition:.25s ease;
  }

  .bc-sidebar.open{
    transform:translateX(0);
  }

  .bc-overlay{
    display:block;
    position:fixed;
    inset:0;
    z-index:55;
    background:rgba(3,19,42,.42);
    border:0;
  }

  .bc-content{
    margin-left:0;
  }

  .bc-mobile-menu{
    display:grid;
    place-items:center;
  }

  .bc-admin{
    display:none;
  }

  .bc-main-grid{
    grid-template-columns:1fr;
  }
}

@media(max-width:720px){
  .bc-page{
    padding:15px;
  }

  .bc-topbar{
    padding:0 15px;
  }

  .bc-topbar h1{
    min-width:auto;
  }

  .bc-search{
    display:none;
  }

  .bc-top-actions{
    margin-left:auto;
  }

  .bc-kpi-grid{
    grid-template-columns:1fr 1fr;
  }

  .bc-bottom-grid{
    grid-template-columns:1fr;
  }

  .bc-bottom-grid .bc-panel:last-child{
    grid-column:auto;
  }

  .bc-footer{
    flex-direction:column;
    gap:7px;
  }
}

@media(max-width:480px){
  .bc-kpi-grid{
    grid-template-columns:1fr;
  }

  .bc-subscription-row{
    grid-template-columns:32px 1fr auto;
  }

  .bc-subscription-row span,
  .bc-subscription-row small{
    display:none;
  }

  .bc-panel{
    padding:14px;
  }
}
`;

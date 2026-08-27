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
function calculerStatsPlateforme(lignes, comptesEmployes = [], comptesAdmins = []) {
  const nbEmployesParOwner = comptesEmployes.reduce((acc, compte) => {
    if (!compte.owner_id) return acc;
    acc[compte.owner_id] = (acc[compte.owner_id] || 0) + 1;
    return acc;
  }, {});

  const nbAdminsParOwner = comptesAdmins.reduce((acc, compte) => {
    if (!compte.owner_id || !compte.user_id) return acc;
    acc[compte.owner_id] = (acc[compte.owner_id] || 0) + 1;
    return acc;
  }, {});

  const entreprises = lignes.map((ligne) => {
    const d = ligne.donnees || {};
    const plan = d.plan || "decouverte";
    const abonnement = d.abonnement || null;
    const abonnementActif =
      plan !== "decouverte" && abonnement?.statut === "actif";

    return {
      id: ligne.id,
      ownerId: ligne.owner_id || null,
      nom:
        d.nomEntreprise?.trim() ||
        ligne.code_entreprise ||
        "Entreprise sans nom",
      codeEntreprise: ligne.code_entreprise || "",
      adresse: d.adresseEntreprise?.trim() || "",
      updatedAt: ligne.updated_at || null,
      // Effectif métier présent dans la fiche de l'entreprise.
      effectifDeclare: Array.isArray(d.employes) ? d.employes.length : 0,
      // Comptes de connexion employés réellement créés dans Supabase.
      comptesEmployes: nbEmployesParOwner[ligne.owner_id] || 0,
      coAdministrateurs: nbAdminsParOwner[ligne.owner_id] || 0,
      plan,
      abonnement,
      abonnementActif,
    };
  });

  const nombreEntreprises = entreprises.length;

  // Utilisateurs réels = comptes authentifiés connus de la plateforme :
  // managers principaux (owner_id) + employés liés + co-administrateurs liés.
  // On déduplique les UUID pour éviter tout double comptage.
  const idsUtilisateurs = new Set();
  lignes.forEach((ligne) => {
    if (ligne.owner_id) idsUtilisateurs.add(ligne.owner_id);
  });
  comptesEmployes.forEach((compte) => {
    if (compte.user_id) idsUtilisateurs.add(compte.user_id);
  });
  comptesAdmins.forEach((compte) => {
    if (compte.user_id) idsUtilisateurs.add(compte.user_id);
  });
  const nombreUtilisateurs = idsUtilisateurs.size;

  const abonnementsActifs = entreprises.filter(
    (e) => e.abonnementActif
  ).length;
  const comptesGratuits = entreprises.filter(
    (e) => e.plan === "decouverte"
  ).length;

  const mrr = entreprises.reduce((somme, e) => {
    if (!e.abonnementActif) return somme;
    const infosPlan = PLANS_INFO[e.plan];
    return somme +
      (infosPlan?.payant && infosPlan.prix ? infosPlan.prix : 0);
  }, 0);

  const tauxConversion =
    nombreEntreprises > 0
      ? Math.round((abonnementsActifs / nombreEntreprises) * 1000) / 10
      : 0;

  // etat_app ne possède pas encore de vraie colonne created_at.
  // On présente donc honnêtement les entreprises récemment mises à jour.
  const entreprisesRecentes = [...entreprises]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
    )
    .slice(0, 5);

  const abonnementsRecents = entreprises
    .filter((e) => e.abonnementActif)
    .sort(
      (a, b) =>
        new Date(b.abonnement?.expireLe || 0) -
        new Date(a.abonnement?.expireLe || 0)
    )
    .slice(0, 5);

  return {
    nombreEntreprises,
    nombreUtilisateurs,
    abonnementsActifs,
    comptesGratuits,
    mrr,
    tauxConversion,
    entreprises,
    entreprisesRecentes,
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

function Topbar({ title, openSidebar }) {
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
            <strong>SERI GUY CLAVER</strong>
            <span>Super Admin</span>
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
        <h3>Entreprises récemment mises à jour</h3>
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

              <small>{ilYA(entreprise.updatedAt) || "—"}</small>
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

function CompaniesPage({ entreprises }) {
  const [recherche, setRecherche] = useState("");
  const [selection, setSelection] = useState(null);

  const terme = recherche.trim().toLowerCase();
  const filtrees = entreprises.filter((entreprise) => {
    if (!terme) return true;
    return [
      entreprise.nom,
      entreprise.codeEntreprise,
      entreprise.adresse,
      libellePlan(entreprise.plan),
    ]
      .filter(Boolean)
      .some((valeur) => valeur.toLowerCase().includes(terme));
  });

  return (
    <section className="bc-companies-page">
      <div className="bc-section-head">
        <div>
          <h2>Entreprises clientes</h2>
          <p>
            {entreprises.length} entreprise{entreprises.length > 1 ? "s" : ""} enregistrée
            {entreprises.length > 1 ? "s" : ""} dans BossClever.
          </p>
        </div>
        <div className="bc-company-search">
          <Icon name="search" size={18} />
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher par nom, code, adresse ou plan…"
          />
        </div>
      </div>

      <div className="bc-table-card">
        {filtrees.length === 0 ? (
          <p className="bc-empty">Aucune entreprise ne correspond à votre recherche.</p>
        ) : (
          <div className="bc-table-scroll">
            <table className="bc-data-table">
              <thead>
                <tr>
                  <th>Entreprise</th>
                  <th>Code</th>
                  <th>Comptes employés</th>
                  <th>Effectif déclaré</th>
                  <th>Co-admins</th>
                  <th>Plan</th>
                  <th>Abonnement</th>
                  <th>Dernière mise à jour</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtrees.map((entreprise) => (
                  <tr key={entreprise.id}>
                    <td>
                      <div className="bc-table-company">
                        <div className="bc-company-avatar">
                          {initialesDe(entreprise.nom)}
                        </div>
                        <div>
                          <strong>{entreprise.nom}</strong>
                          <span>{entreprise.adresse || "Adresse non renseignée"}</span>
                        </div>
                      </div>
                    </td>
                    <td><code>{entreprise.codeEntreprise || "—"}</code></td>
                    <td>{entreprise.comptesEmployes}</td>
                    <td>{entreprise.effectifDeclare}</td>
                    <td>{entreprise.coAdministrateurs}</td>
                    <td>{libellePlan(entreprise.plan)}</td>
                    <td>
                      <span className={`bc-status ${entreprise.abonnementActif ? "active" : "free"}`}>
                        {entreprise.abonnementActif ? "Actif" : entreprise.plan === "decouverte" ? "Gratuit" : "Inactif"}
                      </span>
                    </td>
                    <td>{ilYA(entreprise.updatedAt) || "—"}</td>
                    <td>
                      <button className="bc-link-btn" onClick={() => setSelection(entreprise)}>
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selection && (
        <div className="bc-detail-card">
          <div className="bc-detail-head">
            <div>
              <span>Fiche entreprise</span>
              <h3>{selection.nom}</h3>
            </div>
            <button onClick={() => setSelection(null)}>Fermer</button>
          </div>
          <div className="bc-detail-grid">
            <div><span>Code entreprise</span><strong>{selection.codeEntreprise || "—"}</strong></div>
            <div><span>Plan</span><strong>{libellePlan(selection.plan)}</strong></div>
            <div><span>Comptes employés</span><strong>{selection.comptesEmployes}</strong></div>
            <div><span>Effectif déclaré</span><strong>{selection.effectifDeclare}</strong></div>
            <div><span>Co-administrateurs</span><strong>{selection.coAdministrateurs}</strong></div>
            <div><span>Adresse</span><strong>{selection.adresse || "Non renseignée"}</strong></div>
            <div><span>Owner ID</span><strong className="bc-mono">{selection.ownerId || "—"}</strong></div>
            <div><span>Dernière mise à jour</span><strong>{selection.updatedAt ? new Date(selection.updatedAt).toLocaleString("fr-FR") : "—"}</strong></div>
          </div>
        </div>
      )}
    </section>
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
  entreprises: [],
  entreprisesRecentes: [],
  abonnementsRecents: [],
};

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(STATS_VIDES);
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const chargerDonneesPlateforme = async () => {
      setChargement(true);
      setErreur("");

      const [etatRes, employesRes, adminsRes] = await Promise.all([
        supabase
          .from("etat_app")
          .select("id, owner_id, donnees, code_entreprise, updated_at"),
        supabase
          .from("employe_comptes")
          .select("user_id, owner_id, employe_id, email"),
        supabase
          .from("administrateurs_comptes")
          .select("user_id, owner_id, email, nom, prenom, poste"),
      ]);

      if (etatRes.error) {
        console.error("Erreur chargement données plateforme :", etatRes.error);
        setErreur(
          "Impossible de charger les données des entreprises. Vérifiez les droits d'accès Super Admin sur la table etat_app."
        );
        setChargement(false);
        return;
      }

      if (employesRes.error) {
        console.warn("Comptes employés non accessibles :", employesRes.error);
      }
      if (adminsRes.error) {
        console.warn("Co-administrateurs non accessibles :", adminsRes.error);
      }

      const lignes = etatRes.data || [];
      const comptesEmployes = employesRes.data || [];
      const comptesAdmins = adminsRes.data || [];
      setStats(
        calculerStatsPlateforme(lignes, comptesEmployes, comptesAdmins)
      );

      // Agrège les 8 événements les plus récents du journal d'activité de
      // chaque entreprise pour donner une vue globale et réelle.
      const tousLesEvenements = lignes.flatMap((ligne) => {
        const nomEntreprise =
          ligne.donnees?.nomEntreprise?.trim() || ligne.code_entreprise || "Entreprise";
        return (ligne.donnees?.journalActivite || []).map((evt) => ({
          ...evt,
          entreprise: nomEntreprise,
        }));
      });
      tousLesEvenements.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvenements(tousLesEvenements.slice(0, 8));

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
        />

        <div className="bc-page">
          {erreur ? (
            <div className="bc-error-banner">⚠️ {erreur}</div>
          ) : chargement ? (
            <p className="bc-empty">Chargement des données…</p>
          ) : active === "overview" ? (
            <OverviewPage stats={stats} evenements={evenements} />
          ) : active === "companies" ? (
            <CompaniesPage entreprises={stats.entreprises} />
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
   ENTREPRISES
============================ */

.bc-companies-page{
  display:flex;
  flex-direction:column;
  gap:16px;
}

.bc-section-head{
  display:flex;
  justify-content:space-between;
  gap:20px;
  align-items:flex-end;
}

.bc-section-head h2{
  margin:0 0 5px;
  font-size:22px;
}

.bc-section-head p{
  margin:0;
  color:${COLORS.muted};
  font-size:12px;
}

.bc-company-search{
  width:min(430px,100%);
  height:42px;
  background:white;
  border:1px solid ${COLORS.border};
  border-radius:10px;
  display:flex;
  align-items:center;
  gap:9px;
  padding:0 12px;
  color:${COLORS.muted};
}

.bc-company-search input{
  width:100%;
  border:0;
  outline:0;
  background:transparent;
}

.bc-table-card,
.bc-detail-card{
  background:white;
  border:1px solid ${COLORS.border};
  border-radius:14px;
  box-shadow:0 7px 25px rgba(15,47,88,.035);
}

.bc-table-scroll{
  overflow:auto;
}

.bc-data-table{
  width:100%;
  border-collapse:collapse;
  min-width:1050px;
}

.bc-data-table th,
.bc-data-table td{
  padding:13px 14px;
  border-bottom:1px solid ${COLORS.border};
  text-align:left;
  font-size:11px;
  vertical-align:middle;
}

.bc-data-table th{
  color:${COLORS.muted};
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.35px;
  background:#FBFCFE;
}

.bc-data-table tbody tr:last-child td{
  border-bottom:0;
}

.bc-table-company{
  display:flex;
  align-items:center;
  gap:10px;
  min-width:190px;
}

.bc-table-company strong,
.bc-table-company span{
  display:block;
}

.bc-table-company span{
  margin-top:3px;
  color:${COLORS.muted};
  font-size:10px;
}

.bc-data-table code,
.bc-mono{
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  font-size:10px;
}

.bc-status{
  display:inline-flex;
  border-radius:999px;
  padding:5px 8px;
  font-size:10px;
  font-weight:700;
}

.bc-status.active{
  background:#E7F6ED;
  color:${COLORS.green};
}

.bc-status.free{
  background:${COLORS.blueSoft};
  color:${COLORS.blue};
}

.bc-link-btn{
  border:1px solid ${COLORS.border};
  background:white;
  color:${COLORS.blue};
  border-radius:8px;
  padding:7px 10px;
  font-size:10px;
  font-weight:700;
}

.bc-detail-card{
  padding:18px;
}

.bc-detail-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  margin-bottom:16px;
}

.bc-detail-head span{
  color:${COLORS.muted};
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.4px;
}

.bc-detail-head h3{
  margin:4px 0 0;
}

.bc-detail-head button{
  border:1px solid ${COLORS.border};
  background:white;
  border-radius:8px;
  padding:8px 12px;
}

.bc-detail-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:12px;
}

.bc-detail-grid>div{
  border:1px solid ${COLORS.border};
  border-radius:10px;
  padding:12px;
  min-width:0;
}

.bc-detail-grid span,
.bc-detail-grid strong{
  display:block;
}

.bc-detail-grid span{
  color:${COLORS.muted};
  font-size:10px;
  margin-bottom:6px;
}

.bc-detail-grid strong{
  font-size:11px;
  overflow-wrap:anywhere;
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
  .bc-section-head{
    flex-direction:column;
    align-items:stretch;
  }

  .bc-company-search{
    width:100%;
  }

  .bc-detail-grid{
    grid-template-columns:1fr 1fr;
  }

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
  .bc-detail-grid{
    grid-template-columns:1fr;
  }

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

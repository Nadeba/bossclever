import { useMemo, useState } from "react";

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

const kpis = [
  {
    title: "Entreprises",
    value: "127",
    trend: "+12,4%",
    icon: "building",
    accent: COLORS.blue,
  },
  {
    title: "Utilisateurs",
    value: "2 846",
    trend: "+18,7%",
    icon: "users",
    accent: COLORS.purple,
  },
  {
    title: "Abonnements actifs",
    value: "73",
    trend: "+8,1%",
    icon: "subscription",
    accent: COLORS.green,
  },
  {
    title: "MRR",
    value: "3 650 000 FCFA",
    trend: "+12,4%",
    icon: "wallet",
    accent: COLORS.orange,
  },
  {
    title: "Essais gratuits",
    value: "41",
    trend: "-2,3%",
    icon: "subscription",
    accent: COLORS.cyan,
  },
  {
    title: "Taux de conversion",
    value: "28,7%",
    trend: "+6,6%",
    icon: "chart",
    accent: "#EC4D7A",
  },
];

const activityData = [
  {
    title: "Nouvelle entreprise inscrite",
    text: "TechVision SARL",
    time: "Il y a 5 min",
    color: COLORS.green,
    icon: "building",
  },
  {
    title: "Nouvel utilisateur",
    text: "Koffi Éric a rejoint Innovatech",
    time: "Il y a 12 min",
    color: COLORS.purple,
    icon: "users",
  },
  {
    title: "Paiement reçu",
    text: "450 000 FCFA de SmartBuild CI",
    time: "Il y a 18 min",
    color: COLORS.orange,
    icon: "wallet",
  },
  {
    title: "Nouvel abonnement",
    text: "Global Services a souscrit au plan Pro",
    time: "Il y a 25 min",
    color: COLORS.green,
    icon: "subscription",
  },
  {
    title: "Nouveau ticket",
    text: "Problème de connexion — User #2847",
    time: "Il y a 32 min",
    color: COLORS.blue,
    icon: "shield",
  },
];

const companies = [
  ["TechVision SARL", "Plan Starter", "TV"],
  ["Innovatech CI", "Plan Pro", "IN"],
  ["Global Services", "Plan Pro", "GS"],
  ["BuildExpert SARL", "Plan Starter", "BE"],
  ["Afrika Consulting", "Plan Starter", "AC"],
];

const subscriptions = [
  ["Global Services", "Plan Pro", "Actif", "20 min"],
  ["Innovatech CI", "Plan Pro", "Actif", "1 h"],
  ["SmartBuild CI", "Plan Business", "Actif", "3 h"],
  ["Afrika Consulting", "Plan Starter", "Actif", "5 h"],
  ["NextGen Technologies", "Plan Pro", "Actif", "6 h"],
];

const securityAlerts = [
  {
    label: "Connexions suspectes détectées",
    sub: "3 connexions inhabituelles",
    count: 3,
    color: COLORS.red,
    icon: "shield",
  },
  {
    label: "Comptes bloqués",
    sub: "5 comptes nécessitent votre attention",
    count: 5,
    color: COLORS.orange,
    icon: "lock",
  },
  {
    label: "Paiements échoués",
    sub: "7 paiements en attente",
    count: 7,
    color: "#F0AE00",
    icon: "wallet",
  },
  {
    label: "Sauvegarde",
    sub: "Dernière sauvegarde : il y a 2 heures",
    count: "✓",
    color: COLORS.blue,
    icon: "check",
  },
];

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

function KPIGrid() {
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
            <small
              className={item.trend.startsWith("-") ? "negative" : "positive"}
            >
              ↗ {item.trend} <em>ce mois</em>
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}

function RevenueChart() {
  const points = useMemo(
    () => [
      [0, 75],
      [5, 72],
      [10, 62],
      [15, 62],
      [20, 55],
      [25, 60],
      [30, 49],
      [35, 44],
      [40, 45],
      [45, 35],
      [50, 30],
      [55, 34],
      [60, 40],
      [65, 35],
      [70, 27],
      [75, 18],
      [80, 21],
      [85, 29],
      [90, 23],
      [95, 12],
      [100, 5],
    ],
    []
  );

  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <section className="bc-panel bc-revenue">
      <div className="bc-panel-head">
        <div>
          <h3>Évolution du chiffre d'affaires</h3>
          <div className="bc-revenue-number">
            3 650 000 <span>FCFA</span>
            <b>+12,4%</b>
          </div>
          <p>vs 30 jours précédents</p>
        </div>

        <select>
          <option>30 derniers jours</option>
          <option>90 derniers jours</option>
          <option>Cette année</option>
        </select>
      </div>

      <div className="bc-chart-wrap">
        <div className="bc-chart-y">
          <span>5M</span>
          <span>4M</span>
          <span>3M</span>
          <span>2M</span>
          <span>1M</span>
          <span>0</span>
        </div>

        <svg
          className="bc-chart-svg"
          viewBox="0 0 100 90"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.blue} stopOpacity="0.28" />
              <stop offset="100%" stopColor={COLORS.blue} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[10, 25, 40, 55, 70, 85].map((y) => (
            <line
              key={y}
              x1="0"
              x2="100"
              y1={y}
              y2={y}
              stroke="#EAF0F7"
              strokeWidth=".5"
            />
          ))}

          <polygon
            points={`0,90 ${polyline} 100,90`}
            fill="url(#chartFill)"
          />

          <polyline
            points={polyline}
            fill="none"
            stroke={COLORS.blue}
            strokeWidth="1.4"
          />

          {points
            .filter((_, index) => index % 2 === 0)
            .map(([x, y], index) => (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.2"
                fill="#fff"
                stroke={COLORS.blue}
                strokeWidth=".8"
              />
            ))}
        </svg>
      </div>

      <div className="bc-chart-x">
        <span>26 juin</span>
        <span>1 juil.</span>
        <span>6 juil.</span>
        <span>11 juil.</span>
        <span>16 juil.</span>
        <span>21 juil.</span>
        <span>26 juil.</span>
      </div>
    </section>
  );
}

function RealTimeActivity() {
  return (
    <section className="bc-panel">
      <div className="bc-panel-head simple">
        <h3>Activité en temps réel</h3>
        <button>Voir tout</button>
      </div>

      <div className="bc-activity-list">
        {activityData.map((item, index) => (
          <div className="bc-activity-row" key={index}>
            <div
              className="bc-mini-icon"
              style={{ background: item.color }}
            >
              <Icon name={item.icon} size={18} />
            </div>

            <div className="bc-activity-copy">
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </div>

            <small>{item.time}</small>
            <i style={{ background: item.color }} />
          </div>
        ))}
      </div>
    </section>
  );
}

function CompaniesPanel() {
  const avatarColors = [
    "#EDF3FF",
    "#EEE9FF",
    "#FFF3D0",
    "#E5F0FF",
    "#E0F7F4",
  ];

  return (
    <section className="bc-panel">
      <div className="bc-panel-head simple">
        <h3>Nouvelles entreprises</h3>
        <button>Voir tout</button>
      </div>

      <div className="bc-company-list">
        {companies.map((company, index) => (
          <div className="bc-company-row" key={company[0]}>
            <div
              className="bc-company-avatar"
              style={{ background: avatarColors[index] }}
            >
              {company[2]}
            </div>

            <div>
              <strong>{company[0]}</strong>
              <span>{company[1]}</span>
            </div>

            <small>
              {index === 0
                ? "Il y a 5 min"
                : index === 1
                ? "Il y a 1 h"
                : `Il y a ${index} h`}
            </small>
          </div>
        ))}
      </div>
    </section>
  );
}

function SubscriptionsPanel() {
  return (
    <section className="bc-panel">
      <div className="bc-panel-head simple">
        <h3>Abonnements récents</h3>
        <button>Voir tout</button>
      </div>

      <div className="bc-subscription-list">
        {subscriptions.map((item, index) => (
          <div className="bc-subscription-row" key={item[0]}>
            <div
              className="bc-company-avatar"
              style={{
                background:
                  index % 2 === 0 ? COLORS.blueSoft : "#E9F8F5",
                color: index % 2 === 0 ? COLORS.blue : "#17937A",
              }}
            >
              {item[0]
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </div>

            <strong>{item[0]}</strong>
            <span>{item[1]}</span>
            <b>Actif</b>
            <small>Il y a {item[3]}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function AlertsPanel() {
  return (
    <section className="bc-panel">
      <div className="bc-panel-head simple">
        <h3>Alertes & actions requises</h3>
        <button>Voir tout</button>
      </div>

      <div className="bc-alert-list">
        {securityAlerts.map((item) => (
          <button className="bc-alert-row" key={item.label}>
            <div
              className="bc-alert-icon"
              style={{ background: item.color }}
            >
              <Icon name={item.icon} size={19} />
            </div>

            <div>
              <strong>{item.label}</strong>
              <span>{item.sub}</span>
            </div>

            <b
              style={{
                background:
                  item.count === "✓" ? "#E4F7EC" : `${item.color}18`,
                color:
                  item.count === "✓" ? COLORS.green : item.color,
              }}
            >
              {item.count}
            </b>

            <span className="bc-chevron">›</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function OverviewPage() {
  return (
    <>
      <KPIGrid />

      <div className="bc-main-grid">
        <RevenueChart />
        <RealTimeActivity />
      </div>

      <div className="bc-bottom-grid">
        <CompaniesPanel />
        <SubscriptionsPanel />
        <AlertsPanel />
      </div>
    </>
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

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          {active === "overview" ? (
            <OverviewPage />
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

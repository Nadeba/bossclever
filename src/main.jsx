import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import { supabase } from "./supabase";

function BossCleverRoot() {
  const [verification, setVerification] = useState(true);
  const [estSuperAdmin, setEstSuperAdmin] = useState(false);

  const verifierSuperAdmin = async (session) => {
    if (!session?.user?.id) {
      setEstSuperAdmin(false);
      setVerification(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("super_admins")
        .select("user_id, role, actif")
        .eq("user_id", session.user.id)
        .eq("role", "super_admin")
        .eq("actif", true)
        .maybeSingle();

      if (error) {
        console.error(
          "[BossClever] Vérification Super Admin impossible :",
          error
        );

        setEstSuperAdmin(false);
      } else {
        setEstSuperAdmin(Boolean(data));
      }
    } catch (erreur) {
      console.error(
        "[BossClever] Erreur vérification Super Admin :",
        erreur
      );

      setEstSuperAdmin(false);
    }

    setVerification(false);
  };

  useEffect(() => {
    let actif = true;

    const initialiser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (actif) {
        await verifierSuperAdmin(session);
      }
    };

    initialiser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (actif) {
        setVerification(true);
        verifierSuperAdmin(session);
      }
    });

    return () => {
      actif = false;
      subscription.unsubscribe();
    };
  }, []);

  if (verification) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "Inter, Arial, sans-serif",
          color: "#6B7A90",
        }}
      >
        Vérification de votre accès…
      </div>
    );
  }

  if (estSuperAdmin) {
    return <AdminDashboard />;
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BossCleverRoot />
  </React.StrictMode>
);

import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { HrProvider } from "./context/HrContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Route configs
import { publicRoutes } from "./routes/publicRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { userRoutes } from "./routes/userRoutes";
import { hrRoutes } from "./routes/hrRoutes";
import { commRoutes } from "./routes/commRoutes";

// Fallback
import { NotFound } from "./Components/Notfound";

import "./App.css";
import "react-calendar/dist/Calendar.css";
import VersionBadge from "./Components/VersionBadge";

const App = () => {
  // Theme handling
  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return (
    <HrProvider>
    <VersionBadge />
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* ================= ADMIN ROUTES ================= */}
        {adminRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute requireAuth requireAdmin>
                {element}
              </ProtectedRoute>
            }
          />
        ))}

        {/* ================= USER ROUTES ================= */}
        {userRoutes.map(({ path, element, verified }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute requireAuth requireVerified={Boolean(verified)}>
                {element}
              </ProtectedRoute>
            }
          />
        ))}

        {/* ================= HR ROUTES ================= */}
        {hrRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute requireAuth requireHr requireVerified>
                {element}
              </ProtectedRoute>
            }
          />
        ))}

        {/* ================= COMM TEAM ROUTES ================= */}
        {commRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute requireAuth>{element}</ProtectedRoute>}
          />
        ))}

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HrProvider>
  );
};

export default App;

import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";


import ErrorBoundary from "./Components/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <>
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Analytics />
            <Toaster />
            <App />
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  </>
);

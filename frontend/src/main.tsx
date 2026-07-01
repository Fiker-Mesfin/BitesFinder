import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./hooks/useAuth";
import FavoritesProvider from "./hooks/FavoritesContext.jsx"; // default import now
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </AuthProvider>
  </React.StrictMode>,
);

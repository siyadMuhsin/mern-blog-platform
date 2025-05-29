
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/auth.context.tsx";

createRoot(document.getElementById("root")!).render(
  <Router>
    <AuthProvider>
      
        <App />
    
    </AuthProvider>
  </Router>
);

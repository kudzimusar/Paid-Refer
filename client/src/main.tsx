import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { enableDemoMode } from "@/lib/demoMode";

if (window.location.hostname.includes("github.io")) {
  enableDemoMode();
}

createRoot(document.getElementById("root")!).render(<App />);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
      (registration) => {
        console.log("SW registered: ", registration);
      },
      (registrationError) => {
        console.log("SW registration failed: ", registrationError);
      }
    );
  });
}

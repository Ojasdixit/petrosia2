import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/performance-optimizations"; // Import performance optimizations

createRoot(document.getElementById("root")!).render(<App />);

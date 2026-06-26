import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";

import { patchGlobalFetchForMock } from "./mock/mockGlobalFetch";

patchGlobalFetchForMock();


createRoot(document.getElementById("root")).render(<App />);

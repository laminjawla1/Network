import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { PostProvider } from "./contexts/PostContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostProvider>
      <App />
    </PostProvider>
  </StrictMode>
);

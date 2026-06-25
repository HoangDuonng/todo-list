import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { MainRouter } from "./modules/core/components/MainRouter";
import { AuthProvider } from "./modules/auth/context/authContext";
import { BrowserRouter } from "react-router-dom";

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <MainRouter />
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors />
    </>
  );
}

export default App;

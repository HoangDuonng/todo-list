import Logo from "../.././../assets/logo.svg";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background text-foreground transition-colors duration-200">
      <div className="flex flex-col items-center gap-6 w-full max-w-md px-4">
        <img src={Logo} alt="Logo" className="h-12 w-auto dark:invert transition-all hover:opacity-85" />
        <Outlet />
      </div>
    </div>
  );
};

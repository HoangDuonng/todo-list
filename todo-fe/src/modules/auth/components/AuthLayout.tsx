import Logo from "../.././../assets/logo.svg";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <img src={Logo} alt="Logo" className="min-w-40 dark:invert" />
      <div className="container px-4 mt-4 flex justify-center">
        <Outlet />
      </div>
    </div>
  );
};

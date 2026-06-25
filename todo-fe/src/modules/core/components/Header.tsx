import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LogOutIcon, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo.svg";
import Icon from "../../../assets/icon.svg";
import { useAuth } from "../../auth/hooks/useAuth";

export const Header: React.FC = () => {
  const { profile, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center border-b border-gray-200 dark:border-none text-gray-800 dark:text-white transition-colors duration-200">
      <div className="flex items-center">
        <img
          onClick={() => {
            navigate("/");
          }}
          src={Logo}
          alt="Logo"
          className="h-8 w-auto mr-4 cursor-pointer dark:invert"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200 focus:outline-none"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <Menu>
          <MenuButton className="flex items-center focus:outline-none">
            {/* <UserCircleIcon className="h-8 w-8 text-gray-300 mr-4" /> */}
            <img
              src={Icon}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover dark:invert shrink-0 aspect-square"
            />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="w-52 origin-top-right rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-gray-800 p-1 text-sm text-gray-800 dark:text-white shadow-lg dark:shadow-none transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <MenuItem>
              <button
                onClick={() => {
                  navigate("/profile");
                }}
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100 dark:data-[focus]:bg-white/10"
              >
                {/* <UserCircleIcon className="h-8 w-8 text-gray-300" /> */}
                <img
                  src={Icon}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover dark:invert shrink-0 aspect-square"
                />
                <span>
                  {profile?.first_name} {profile?.last_name}
                </span>
              </button>
            </MenuItem>

            <div className="my-1 h-px bg-gray-200 dark:bg-white/5" />

            <MenuItem>
              <button
                onClick={handleLogout}
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100 dark:data-[focus]:bg-white/10"
              >
                <LogOutIcon className="size-4 text-gray-500 dark:text-gray-400" />
                Logout
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </header>
  );
};


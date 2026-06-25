import { useState } from "react";
import { LogOutIcon, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo.svg";
import Icon from "../../../assets/icon.svg";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border transition-colors duration-200">
      <div className="w-full flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          <img
            onClick={() => {
              navigate("/");
            }}
            src={Logo}
            alt="Logo"
            className="h-8 w-auto mr-4 cursor-pointer dark:invert transition-opacity duration-200 hover:opacity-85"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-500 transition-all duration-200" />
            ) : (
              <Moon className="h-5 w-5 transition-all duration-200" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full focus-visible:ring-0 p-0">
                <img
                  src={Icon}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover dark:invert shrink-0 aspect-square"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="flex items-center gap-3 cursor-pointer py-2.5"
              >
                <img
                  src={Icon}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full object-cover dark:invert shrink-0 aspect-square"
                />
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium leading-none">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile?.email}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 py-2.5"
              >
                <LogOutIcon className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};


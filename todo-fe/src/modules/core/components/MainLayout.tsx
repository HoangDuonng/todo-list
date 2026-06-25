import { Header } from "./Header";

interface IMainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: IMainLayoutProps) => {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col transition-colors duration-200">
      <Header />
      <div className="flex-grow p-8 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};

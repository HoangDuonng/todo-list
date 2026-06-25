import { Header } from "./Header";

interface IMainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: IMainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
      <Header />
      <main className="flex-grow p-4 md:p-8 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};

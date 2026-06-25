import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-background text-foreground px-4 relative overflow-hidden">
      {/* Decorative background glow circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center max-w-md w-full z-10">
        <div className="relative mb-6 inline-flex">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-125 animate-pulse" />
          <div className="bg-muted p-6 rounded-full border border-border relative">
            <FileQuestion className="h-16 w-16 text-primary animate-bounce" />
          </div>
        </div>

        <h1 className="text-8xl font-black tracking-tighter bg-gradient-to-r from-primary via-primary/80 to-muted-foreground bg-clip-text text-transparent select-none">
          404
        </h1>

        <h2 className="text-2xl font-bold tracking-tight mt-2 mb-3">
          Page not found
        </h2>

        <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved to another path.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 border-border/80 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button asChild className="flex items-center justify-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Go Back Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;

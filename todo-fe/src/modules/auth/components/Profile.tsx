import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Mail, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { profile, handleUpdateProfile } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and Last name cannot be empty");
      return;
    }

    setIsUpdating(true);
    try {
      await handleUpdateProfile({
        first_name: firstName,
        last_name: lastName,
        avatar: profile?.avatar || "",
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      // Errors are already handled or we can display a general fallback
    } finally {
      setIsUpdating(false);
    }
  };

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="w-full max-w-md mx-auto py-6 px-4">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4 text-sm flex items-center gap-2 hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card className="w-full shadow-md border-border overflow-hidden">
        <CardHeader className="text-center pb-4 border-b border-border bg-muted/10 relative">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md scale-110" />
              <div className="h-20 w-20 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center relative overflow-hidden">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-primary" />
                )}
              </div>
            </div>
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
            User Profile
          </CardTitle>
          <CardDescription>
            Manage your personal settings.
          </CardDescription>
        </CardHeader>

        <form onSubmit={onUpdate}>
          <CardContent className="pt-6 flex flex-col gap-5">
            {/* Email (Readonly) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Email Address
              </label>
              <Input
                type="email"
                value={profile?.email || ""}
                disabled
                className="bg-muted text-muted-foreground border-border/80 cursor-not-allowed"
              />
            </div>

            {/* First Name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                First Name
              </label>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Last Name
              </label>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
            </div>

            {/* Joined Date */}
            {joinedDate && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 bg-muted/40 p-2.5 rounded border border-border/40">
                <Calendar className="h-4 w-4 text-primary/75" />
                <span>Joined on {joinedDate}</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="pb-6 pt-2">
            <Button
              type="submit"
              disabled={isUpdating}
              className="w-full flex items-center justify-center gap-2 font-semibold"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

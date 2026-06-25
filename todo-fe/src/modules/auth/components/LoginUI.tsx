import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { RHFInput } from "../../core/components/RHFInput";
import { ILoginForm } from "../models/auth";
import { loginSchema } from "../models/schema";
import FormProvider from "../../core/components/FormProvider";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const defaultValues: ILoginForm = {
    email: "nguuyen0001@gmail.com",
    password: "12345678",
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(loginSchema),
  });

  const { handleSubmit } = methods;

  return (
    <Card className="w-full shadow-md border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(handleLogin)}>
          <div className="flex flex-col gap-4">
            <RHFInput
              name="email"
              type="email"
              placeholder="name@example.com"
              label="Email"
            />
            <RHFInput
              name="password"
              type="password"
              placeholder="••••••••"
              label="Password"
            />
            <Button className="w-full mt-2" type="submit">
              Sign In
            </Button>
            
            <div className="text-center mt-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-primary"
                  onClick={() => navigate("/register")}
                >
                  Register here
                </Button>
              </p>
            </div>
          </div>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default LoginForm;

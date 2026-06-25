import { useForm } from "react-hook-form";
import { IRegisterForm } from "../models/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../models/schema";
import FormProvider from "../../core/components/FormProvider";
import { RHFInput } from "../../core/components/RHFInput";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const RegisterUI = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const defaultValues: IRegisterForm = {
    password: "",
    email: "",
    first_name: "",
    last_name: "",
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(registerSchema),
  });

  const { handleSubmit } = methods;

  return (
    <Card className="w-full shadow-md border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Register</CardTitle>
        <CardDescription className="text-center">
          Create a new account to start managing your tasks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(handleRegister)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <RHFInput
                name="first_name"
                type="text"
                placeholder="John"
                label="First Name"
              />
              <RHFInput
                name="last_name"
                type="text"
                placeholder="Doe"
                label="Last Name"
              />
            </div>
            <RHFInput
              name="email"
              type="text"
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
              Register
            </Button>
            
            <div className="text-center mt-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-primary"
                  onClick={() => navigate("/login")}
                >
                  Login here
                </Button>
              </p>
            </div>
          </div>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

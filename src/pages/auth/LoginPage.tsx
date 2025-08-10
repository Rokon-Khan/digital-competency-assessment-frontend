/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useLoginMutation } from "@/redux/services/assessmentApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAppSelector((s) => s.auth) as any; // Replace 'auth' with the correct key for your auth state
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const res = await login(values).unwrap();
      toast.success("Logged in successfully");

      // Supervisor pending approval?
      if (
        res.role === "supervisor" &&
        (res.supervisorApproved === false || res.isApproved === false)
      ) {
        toast.message("Pending Approval", {
          description: "Your supervisor account is awaiting admin approval.",
        });
        // Could navigate to dedicated pending page
        navigate("/pending-approval");
        return;
      }

      // Role-based navigation (adjust routes to your app)
      if (res.role === "admin") {
        navigate("/admin");
      } else {
        // If redirect path passed in location state (protected route redirect)
        const redirectTo = (location.state as any)?.from || "/dashboard";
        navigate(redirectTo);
      }
    } catch (e: any) {
      const msg =
        e?.data?.error || e?.data?.message || "Invalid email or password";
      toast.error(msg);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-primary rounded-lg p-3 w-fit mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your Test_School account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="transition-smooth"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="pr-10 transition-smooth"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline transition-smooth"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <Separator className="my-6" />
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </div>

            {auth.role && (
              <div className="mt-6 p-3 rounded-md bg-muted/60 text-xs text-muted-foreground">
                Session Role: {auth.role}{" "}
                {auth.role === "supervisor" &&
                  `(Approved: ${String(
                    auth.supervisorApproved ?? auth.isApproved
                  )})`}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

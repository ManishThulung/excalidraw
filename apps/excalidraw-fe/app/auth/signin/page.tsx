"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { api } from "@/config/http-request";
import { useRouter } from "next/navigation";

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    mode: "onChange",
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const onSubmit = async (values: SignInFormData) => {
    try {
      setSubmitError("");
      const res = await api.post("/sign-in", {
        email: values.email,
        password: values.password,
      });

      if (res.data.success) {
        router.push("/rooms");
      }
    } catch (error) {
      setSubmitError("Failed to sign in. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/2 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Animated decorative elements */}
      <div
        className="absolute top-[160px] right-[350px] animate-pulse-glow hidden md:block"
        style={{ animationDuration: "3s" }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="animate-rotate"
          style={{ animationDuration: "25s" }}
        >
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            opacity="0.4"
          />
          <circle
            cx="60"
            cy="60"
            r="40"
            fill="none"
            stroke="#ec4899"
            strokeWidth="1.5"
            opacity="0.3"
          />
        </svg>
      </div>

      <div
        className="absolute bottom-[100px] left-[250px] animate-pulse-glow hidden md:block"
        style={{ animationDelay: "1.5s" }}
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          className="animate-rotate"
          style={{ animationDuration: "35s", animationDirection: "reverse" }}
        >
          <rect
            x="15"
            y="15"
            width="130"
            height="130"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            opacity="0.3"
          />
          <rect
            x="30"
            y="30"
            width="100"
            height="100"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
            opacity="0.2"
          />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form Card */}
        <Card className="bg-card border border-purple-500/30 p-8 shadow-xl shadow-purple-500/10 relative backdrop-blur-sm">
          <div className="absolute inset-0 border border-purple-500/20 rounded-lg pointer-events-none -m-px"></div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 relative z-10"
          >
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
                <Input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  type="email"
                  placeholder="your@email.com"
                  className="h-[44px] pl-10 bg-secondary/50 border border-purple-500/30 text-foreground placeholder:text-muted-foreground rounded-lg focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
                <Input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-[44px] pl-10 pr-10 bg-secondary/50 border border-purple-500/30 text-foreground placeholder:text-muted-foreground rounded-lg focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-purple-400 hover:text-purple-300 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-semibold py-2 h-11 rounded-lg transition-all shadow-lg shadow-purple-500/30 mt-6"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="flex items-center">
                <div className="flex-1 border-t border-purple-500/20"></div>
                <span className="px-3 text-xs text-muted-foreground">or</span>
                <div className="flex-1 border-t border-purple-500/20"></div>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link href="/auth/signup">
              <Button
                type="button"
                variant="outline"
                className="w-full border border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10 text-foreground rounded-lg font-medium transition-colors"
              >
                Create Account
              </Button>
            </Link>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          By signing in, you agree to our{" "}
          <Link href="#" className="text-accent hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-accent hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

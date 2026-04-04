"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Eye, EyeOff, Mail, User, Lock, PenTool } from "lucide-react";
import { api } from "@/config/http-request";
import { useRouter } from "next/navigation";

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpFormData>({
    mode: "onChange",
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const password = watch("password");

  const onSubmit = async (values: SignUpFormData) => {
    try {
      setSubmitError("");
      const res = await api.post("/sign-up", {
        username: values.username,
        password: values.password,
        email: values.email,
      });

      if (res.data.success) {
        router.push("/auth/signin");
      }
    } catch (error) {
      setSubmitError("Failed to create account. Please try again.");
    }
  };

  const passwordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  };

  const strength = passwordStrength(password);
  const strengthColor =
    strength <= 1
      ? "bg-red-500"
      : strength === 2
        ? "bg-yellow-500"
        : "bg-emerald-500";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-32 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Animated decorative elements */}
      <div className="absolute top-[160px] left-[350px] animate-pulse-glow hidden md:block">
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          className="animate-rotate"
          style={{ animationDuration: "30s" }}
        >
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            opacity="0.4"
          />
          <circle
            cx="70"
            cy="70"
            r="50"
            fill="none"
            stroke="#ec4899"
            strokeWidth="1.5"
            opacity="0.3"
          />
        </svg>
      </div>

      <div
        className="absolute bottom-16 right-[280px] animate-pulse-glow hidden md:block"
        style={{ animationDelay: "1.5s" }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          className="animate-rotate"
          style={{ animationDuration: "40s", animationDirection: "reverse" }}
        >
          <rect
            x="20"
            y="20"
            width="140"
            height="140"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            opacity="0.3"
          />
          <rect
            x="35"
            y="35"
            width="110"
            height="110"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
            opacity="0.2"
          />
        </svg>
      </div>

      {/* Floating decorative dots */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-purple-500 rounded-full animate-float opacity-40 hidden md:block"></div>
      <div
        className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-500 rounded-full animate-float opacity-30 hidden md:block"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/3 right-1/3 w-2.5 h-2.5 bg-cyan-500 rounded-full animate-float opacity-25 hidden md:block"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="w-full max-w-md relative z-10 animate-slide-in">
        {/* Header with icon */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl animate-pulse-glow">
              <PenTool className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Start Drawing
          </h1>
          <p className="text-muted-foreground text-sm">
            Create your account and begin collaborating
          </p>
        </div>

        {/* Form Card with glowing border effect */}
        <Card className="bg-card border border-purple-500/30 p-8 shadow-xl shadow-purple-500/10 relative backdrop-blur-sm">
          <div className="absolute inset-0 border border-purple-500/20 rounded-lg pointer-events-none -m-px"></div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 relative z-10"
          >
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
                <Input
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  placeholder="choose a username"
                  className="h-[44px] pl-10 bg-secondary/50 border border-purple-500/30 text-foreground placeholder:text-muted-foreground rounded-lg focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20"
                  disabled={isSubmitting}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">
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
              <label className="text-sm font-semibold text-foreground block">
                Password
              </label>
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
                  placeholder="at least 8 characters"
                  className="h-[44px] pl-10 pr-10 bg-secondary/50 border border-purple-500/30 text-foreground placeholder:text-muted-foreground rounded-lg focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          i < strength ? strengthColor : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {strength <= 1
                      ? "Weak - add uppercase, numbers & symbols"
                      : strength === 2
                        ? "Fair - almost there!"
                        : "Strong - ready to go!"}
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="text-xs text-[#f28482]">
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
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-accent-foreground font-semibold py-2 h-11 rounded-lg transition-all mt-6 shadow-lg shadow-purple-500/30"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="flex items-center">
                <div className="flex-1 border-t border-purple-500/20"></div>
                <span className="px-3 text-xs text-muted-foreground">or</span>
                <div className="flex-1 border-t border-purple-500/20"></div>
              </div>
            </div>

            {/* Sign In Link */}
            <Link href="/auth/signin">
              <Button
                type="button"
                variant="outline"
                className="w-full border border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10 text-foreground rounded-lg font-medium transition-colors"
              >
                Already have an account?
              </Button>
            </Link>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By creating an account, you agree to our{" "}
          <Link href="#" className="text-accent hover:underline font-medium">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-accent hover:underline font-medium">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/layout/Logo";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff, Shield } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import { toast } from "sonner";

const schema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

const inp = (err?: boolean) =>
  `w-full border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 placeholder:text-ink-faint transition-all ${
    err ? "border-red-400 focus:ring-red-400/40" : "border-surface-border"
  }`;

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login.mutateAsync(data);
      toast.success(`Welcome back, ${result.user.name}!`);
      router.push("/dashboard");
    } catch {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Image panel ────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85"
          alt="Kenyan home"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#003ecc]/85 to-black/60" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <Logo size="md" invert />

          <div>
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <Shield className="w-3.5 h-3.5 text-brand-300" />
              All listings verified
            </div>

            <h2 className="text-display-md font-extrabold mb-3 leading-tight">
              Your next home is<br />waiting for you.
            </h2>
            <p className="text-white/65 text-sm leading-relaxed max-w-sm">
              Thousands of verified rentals across all 47 Kenyan counties. Connect directly with agents — no middlemen.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-8">
              {[["10K+","Listings"],["47","Counties"],["5K+","Renters"]].map(([v,l]) => (
                <div key={l}>
                  <p className="text-2xl font-extrabold tracking-tight">{v}</p>
                  <p className="text-white/50 text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Form panel ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface-sage">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-card p-8">
            <h1 className="text-display-sm font-extrabold text-ink mb-1">Welcome back</h1>
            <p className="text-ink-muted text-sm mb-8">Sign in to your agent dashboard</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className={inp(!!errors.email)}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-brand-500 hover:text-brand-600 font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className={`${inp(!!errors.password)} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors"
                  >
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={login.isPending}
                className="btn-primary w-full justify-center py-3.5 rounded-xl disabled:opacity-60"
              >
                {login.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {login.isPending ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="divider my-6">or</div>

            <p className="text-center text-sm text-ink-muted">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-brand-500 hover:text-brand-600 font-semibold">
                Register as Agent
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-ink-faint mt-6">
            By continuing you agree to our{" "}
            <Link href="/terms" className="hover:text-brand-500">Terms</Link> and{" "}
            <Link href="/privacy" className="hover:text-brand-500">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

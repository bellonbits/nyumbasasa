"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/layout/Logo";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Home, Loader2, Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import { toast } from "sonner";

const schema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

const inp = (err?: boolean) =>
  `w-full border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent placeholder:text-gray-400 ${err ? "border-red-400" : "border-gray-200"}`;

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
      {/* Image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85"
          alt="Kenyan home"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/80 to-black/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <Logo size="md" invert />
          <div>
            <h2 className="font-heading text-3xl font-bold mb-3">
              Your next home is<br />waiting for you.
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Thousands of verified rentals across all 47 Kenyan counties. Connect directly with agents — no middlemen.
            </p>
            <div className="flex items-center gap-6 mt-8">
              {[["10K+","Listings"],["47","Counties"],["5K+","Renters"]].map(([v,l]) => (
                <div key={l}><p className="font-heading text-2xl font-bold">{v}</p><p className="text-white/60 text-xs mt-0.5">{l}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#FAFAF8]">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="font-heading text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm mb-8">Sign in to your agent dashboard</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" {...register("email")} placeholder="you@example.com" className={inp(!!errors.email)} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-brand-500 hover:text-brand-600">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} {...register("password")} placeholder="••••••••"
                    className={`${inp(!!errors.password)} pr-11`} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <button type="submit" disabled={login.isPending}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {login.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {login.isPending ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-brand-500 hover:text-brand-600 font-semibold">Register as Agent</Link>
            </p>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing you agree to our{" "}
            <Link href="/terms" className="hover:text-brand-500">Terms</Link> and{" "}
            <Link href="/privacy" className="hover:text-brand-500">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

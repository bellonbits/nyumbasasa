"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/layout/Logo";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff, BadgeCheck } from "lucide-react";
import { useRegister } from "@/hooks/useAuth";
import { toast } from "sonner";
import Cookies from "js-cookie";

const schema = z.object({
  name:        z.string().min(2, "Name must be at least 2 characters"),
  email:       z.string().email("Invalid email address"),
  phone:       z.string().regex(/^(?:\+254|0)[17]\d{8}$/, "Enter a valid Kenyan phone number"),
  agencyName:  z.string().optional(),
  password:    z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const inp = (err?: boolean) =>
  `w-full border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 placeholder:text-ink-faint transition-all ${
    err ? "border-red-400 focus:ring-red-400/40" : "border-surface-border"
  }`;

const Err = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

export default function RegisterPage() {
  const router = useRouter();
  const register_mut = useRegister();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const { confirmPassword, ...payload } = data;
    try {
      const result = await register_mut.mutateAsync(payload);
      Cookies.set("access_token", result.tokens.accessToken, { expires: 1, secure: true });
      Cookies.set("refresh_token", result.tokens.refreshToken, { expires: 7, secure: true });
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch {
      toast.error("Registration failed. Email may already be in use.");
    }
  };

  const PERKS = [
    "Go live within 24 hours",
    "Connect directly via WhatsApp",
    "Reach all 47 counties",
  ];

  return (
    <div className="min-h-screen flex">

      {/* ── Image panel ────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=85"
          alt="Kenyan property"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1117]/90 to-brand-700/60" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <Logo size="md" invert />
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <BadgeCheck className="w-3.5 h-3.5 text-brand-300" />
              Verified Professionals
            </div>
            <h2 className="text-display-sm font-extrabold mb-3 leading-tight">
              List your property,<br />reach thousands.
            </h2>
            <p className="text-white/65 text-sm leading-relaxed max-w-xs mb-6">
              Join 2,000+ verified agents listing properties across Kenya.
            </p>
            <ul className="space-y-2.5">
              {PERKS.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-white/80">
                  <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Form panel ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-surface-sage overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            <Logo size="md" />
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-card p-8">
            <h1 className="text-display-sm font-extrabold text-ink mb-1">Create Agent Account</h1>
            <p className="text-ink-muted text-sm mb-6">Start listing your properties in minutes</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">Full Name *</label>
                <input {...register("name")} placeholder="John Kamau" className={inp(!!errors.name)} />
                <Err msg={errors.name?.message} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">Email *</label>
                  <input type="email" {...register("email")} placeholder="john@example.com" className={inp(!!errors.email)} />
                  <Err msg={errors.email?.message} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">Phone *</label>
                  <input type="tel" {...register("phone")} placeholder="0712345678" className={inp(!!errors.phone)} />
                  <Err msg={errors.phone?.message} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">Agency / Company Name</label>
                <input {...register("agencyName")} placeholder="Optional" className={inp()} />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    {...register("password")}
                    placeholder="Min 8 characters"
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
                <Err msg={errors.password?.message} />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">Confirm Password *</label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className={inp(!!errors.confirmPassword)}
                />
                <Err msg={errors.confirmPassword?.message} />
              </div>

              <button
                type="submit"
                disabled={register_mut.isPending}
                className="btn-primary w-full justify-center py-3.5 rounded-xl disabled:opacity-60 mt-2"
              >
                {register_mut.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {register_mut.isPending ? "Creating account..." : "Create Account →"}
              </button>
            </form>

            <p className="text-center text-sm text-ink-muted mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-brand-500 hover:text-brand-600 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

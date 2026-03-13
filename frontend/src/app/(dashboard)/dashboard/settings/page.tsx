"use client";

import { useState, useEffect } from "react";
import { useMe, useUpdateProfile, useChangePassword } from "@/hooks/useAuth";
import { Loader2, Save, Bell, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Tab = "profile" | "security" | "notifications";

const inp = (err?: boolean) =>
  `w-full border ${err ? "border-red-400" : "border-gray-200"} rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent placeholder:text-gray-400`;

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn("relative w-11 h-6 rounded-full transition-colors", checked ? "bg-brand-500" : "bg-gray-200")}
    >
      <span className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform", checked ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}

export default function SettingsPage() {
  const { data: user }       = useMe();
  const updateProfile        = useUpdateProfile();
  const changePassword       = useChangePassword();
  const [tab, setTab]        = useState<Tab>("profile");

  // Profile form
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [agency, setAgency]   = useState("");

  // Sync with user data when it loads
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setPhone(user.phone ?? "");
      setAgency((user as any).agencyName ?? "");
    }
  }, [user]);

  // Security form
  const [currentPw, setCurrentPw]   = useState("");
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");

  // Notification state
  const [notifs, setNotifs] = useState({
    emailNewInquiry:   true,
    emailListingViews: true,
    emailWeeklyReport: false,
    smsNewInquiry:     false,
    smsLeadAlert:      true,
  });

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({ name, phone, agencyName: agency });
      toast.success("Profile updated successfully!");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to update profile");
    }
  };

  const handleSavePassword = async () => {
    if (newPw !== confirmPw) { toast.error("Passwords do not match"); return; }
    if (newPw.length < 8)    { toast.error("Password must be at least 8 characters"); return; }
    if (!currentPw)          { toast.error("Enter your current password"); return; }
    try {
      await changePassword.mutateAsync({ currentPassword: currentPw, newPassword: newPw });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      toast.success("Password changed successfully!");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to change password");
    }
  };

  const TABS: { key: Tab; label: string; icon: typeof User }[] = [
    { key: "profile",       label: "Profile",       icon: User },
    { key: "security",      label: "Security",      icon: Lock },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your account preferences</p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === "profile" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {(name || user?.name || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name ?? "Agent"}</p>
              <p className="text-sm text-gray-400 capitalize">{user?.role?.toLowerCase() ?? "agent"} account</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className={inp()} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input value={user?.email ?? ""} readOnly className={`${inp()} bg-gray-50 text-gray-400 cursor-not-allowed`} />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact support.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 700 000 000" className={inp()} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Agency / Company Name</label>
            <input value={agency} onChange={e => setAgency(e.target.value)} placeholder="Optional" className={inp()} />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={updateProfile.isPending}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60"
          >
            {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {/* Security */}
      {tab === "security" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-5">
          <h3 className="font-semibold text-gray-900">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
              <input
                type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                placeholder="••••••••" className={inp()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <input
                type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                placeholder="Min 8 characters" className={inp(newPw.length > 0 && newPw.length < 8)}
              />
              {newPw.length > 0 && newPw.length < 8 && (
                <p className="text-xs text-red-500 mt-1">Password must be at least 8 characters</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <input
                type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                placeholder="••••••••" className={inp(confirmPw.length > 0 && confirmPw !== newPw)}
              />
              {confirmPw.length > 0 && confirmPw !== newPw && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
          </div>

          <button
            onClick={handleSavePassword}
            disabled={changePassword.isPending}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60"
          >
            {changePassword.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {changePassword.isPending ? "Updating..." : "Update Password"}
          </button>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Danger Zone</h3>
            <button
              onClick={() => toast.error("Please contact support to delete your account.")}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors border border-red-200 hover:border-red-300 px-4 py-2 rounded-xl"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-6">
          {[
            {
              section: "Email Notifications",
              items: [
                { key: "emailNewInquiry",   label: "New inquiries",           desc: "When a renter messages about your listing" },
                { key: "emailListingViews", label: "Listing view milestones", desc: "When your listing hits 100, 500, 1K views" },
                { key: "emailWeeklyReport", label: "Weekly performance report",desc: "Summary of views, inquiries, and activity" },
              ],
            },
            {
              section: "SMS Notifications",
              items: [
                { key: "smsNewInquiry", label: "New inquiries",  desc: "Instant SMS when renters contact you"         },
                { key: "smsLeadAlert",  label: "New lead alert", desc: "When a new lead matches your property type" },
              ],
            },
          ].map(({ section, items }) => (
            <div key={section}>
              <h3 className="font-semibold text-gray-900 text-sm mb-3">{section}</h3>
              <div className="space-y-4">
                {items.map(({ key, label, desc }) => (
                  <div key={key} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    <Toggle
                      checked={notifs[key as keyof typeof notifs]}
                      onChange={() => setNotifs(p => ({ ...p, [key]: !p[key as keyof typeof notifs] }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={() => toast.success("Notification preferences saved!")}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      )}
    </div>
  );
}

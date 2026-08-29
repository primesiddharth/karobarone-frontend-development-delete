"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  LayoutGrid,
  Store,
  Landmark,
  LayoutTemplate,
  Globe,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Website Themes", icon: LayoutGrid },
  { href: "/dashboard/store", label: "Store Profile", icon: Store },
  { href: "/dashboard/bank-accounts", label: "Bank Accounts", icon: Landmark },
  { href: "/dashboard/sections", label: "Sections", icon: LayoutTemplate },
  { href: "/dashboard/domains", label: "Domains", icon: Globe },
  { href: "/dashboard/media", label: "Logo & Banner", icon: ImageIcon },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Checking your session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="px-5 py-5 border-b border-slate-200">
          <span className="text-lg font-semibold text-[#5b4ef9]">KarobarOne</span>
          <p className="text-xs text-slate-500 mt-0.5">Store setup & onboarding</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#5b4ef9]/10 text-[#5b4ef9]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-200">
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

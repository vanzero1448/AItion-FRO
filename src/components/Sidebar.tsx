"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  ShieldAlert,
  Settings,
  Sparkles,
  LogOut,
} from "lucide-react";
import { generatePixelAvatar } from "../lib/avatars";

export default function Sidebar() {
  const pathname = usePathname();
  const userName = "AI CTO"; // В идеале тянуть это из глобального стейта

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 z-10 shrink-0">
      <div className="h-24 flex items-center px-8">
        <div className="w-10 h-10 bg-slate-900 rounded-[14px] flex items-center justify-center mr-3 shadow-md">
          <Sparkles size={20} className="text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          Aition
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {[
          { name: "Overview", href: "/", icon: LayoutDashboard },
          { name: "Projects", href: "/projects", icon: FolderKanban },
          { name: "Alerts", href: "/alerts", icon: ShieldAlert },
          { name: "Settings", href: "/settings", icon: Settings },
        ].map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-5 py-4 rounded-2xl transition-all ${isActive ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"}`}
            >
              <Icon size={20} />
              <span className="ml-4 text-sm font-bold tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="bg-slate-50 rounded-[2rem] p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-slate-100 shrink-0">
              {generatePixelAvatar(userName, 40)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">
                {userName}
              </p>
              <p className="text-[10px] font-bold text-blue-500 uppercase">
                Pro Workspace
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

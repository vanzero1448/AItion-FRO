"use client";

import { useState } from "react";
import { generatePixelAvatar } from "../../src/lib/avatars";
import {
  User,
  Shield,
  Key,
  Database,
  Zap,
  Eye,
  EyeOff,
  Save,
  Check,
  ChevronRight,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [name, setName] = useState("AI CTO");
  const [notionKey, setNotionKey] = useState("secret_notion_v1_823...");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <header>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2 font-display">
          Workspace Settings
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          Control your AI intelligence engine and identity.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Чистый Apple-style Sidebar для настроек */}
        <nav className="space-y-2">
          {[
            { n: "Profile", i: User },
            { n: "Notion Sync", i: Database },
            { n: "API & Security", i: Shield },
          ].map((tab) => (
            <button
              key={tab.n}
              onClick={() => setActiveTab(tab.n)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${
                activeTab === tab.n
                  ? "bg-white shadow-sm text-slate-900 border border-slate-100"
                  : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
              }`}
            >
              <tab.i size={18} /> {tab.n}
            </button>
          ))}
        </nav>

        {/* Контентная часть */}
        <div className="md:col-span-3 space-y-6">
          {/* TAB: PROFILE */}
          {activeTab === "Profile" && (
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-8 pb-8 border-b border-slate-50">
                <div className="rounded-full overflow-hidden border-4 border-white shadow-2xl transition-transform hover:scale-105 cursor-pointer">
                  {generatePixelAvatar(name, 120)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    NFT Identity
                  </h3>
                  <p className="text-slate-400 font-medium">
                    Unique hash generated from:{" "}
                    <span className="text-blue-500">{name}</span>
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-500/5 focus:bg-white outline-none transition-all font-bold text-slate-900"
                />
              </div>
            </section>
          )}

          {/* TAB: NOTION SYNC */}
          {activeTab === "Notion Sync" && (
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#F3F3F2] rounded-2xl flex items-center justify-center text-2xl font-black">
                    N
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Notion Integration
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      Syncing AI reports to your workspace.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                  Connected
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Internal Integration Token
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={notionKey}
                    readOnly
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl outline-none font-mono text-sm"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex items-center gap-3 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-blue-700 text-xs font-bold leading-relaxed">
                  <Zap size={18} className="shrink-0" /> Every new AI audit will
                  be automatically formatted and sent to your Notion database as
                  a new page.
                </div>
              </div>
            </section>
          )}

          {/* TAB: API & SECURITY */}
          {activeTab === "API & Security" && (
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                  <Lock size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  System Security
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <Key className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <p className="font-bold text-slate-900">
                      API Key Encryption
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </div>
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <Shield className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <p className="font-bold text-slate-900">
                      Advanced Privacy Guard
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </div>
              </div>
            </section>
          )}

          {/* Финальная кнопка */}
          <div className="flex items-center justify-end pt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-3 bg-slate-900 text-white px-12 py-4 rounded-3xl font-black hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-95 text-sm uppercase tracking-widest"
            >
              {saved ? <Check size={20} /> : <Save size={20} />}
              {saved ? "System Saved" : "Confirm Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

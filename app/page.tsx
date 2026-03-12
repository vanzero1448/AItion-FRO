"use client";

import { useEffect, useState } from "react";
import { supabase } from "../src/lib/supabase";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Search,
  Loader2,
} from "lucide-react";
import HealthChart from "../src/components/HealthChart";

export default function Dashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Состояния для строки поиска
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data } = await supabase
        .from("reports")
        .select("*, projects(name)")
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) setReports(data);
      setIsLoading(false);
    };

    fetchInitialData();

    const channel = supabase
      .channel("realtime-reports")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reports" },
        async (payload) => {
          console.log("🚀 Incoming AI Audit:", payload.new);
          const { data: projectData } = await supabase
            .from("projects")
            .select("name")
            .eq("id", payload.new.project_id)
            .single();

          const newReport = {
            ...payload.new,
            projects: { name: projectData?.name || "Unknown Project" },
          };
          setReports((current) => [newReport, ...current].slice(0, 10));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Функция запуска аудита с сайта
  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Отправляем команду на наш бэкенд (порт 3001)
      const res = await fetch("http://localhost:3001/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: searchQuery.trim() }),
      });

      if (!res.ok) {
        throw new Error("Ошибка сервера при запуске аудита");
      }

      // Очищаем поле после успеха (карточка сама прилетит через вебсокет)
      setSearchQuery("");
    } catch (error) {
      console.error("Error triggering audit:", error);
      alert(
        "Не удалось запустить аудит. Проверь, работает ли бэкенд на порту 3001.",
      );
    } finally {
      setIsSearching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const avgScore =
    reports.length > 0
      ? Math.round(
          reports.reduce((acc, r) => acc + r.score, 0) / reports.length,
        )
      : 0;
  const maxTechDebt =
    reports.length > 0
      ? Math.max(...reports.map((r) => r.technical_debt_score || 0))
      : 0;
  const uniqueProjects = new Set(reports.map((r) => r.project_id)).size;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Заголовок и Строка поиска */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-2">
            Company Overview
          </h1>
          <p className="text-lg text-slate-500">
            Real-time AI analysis of your engineering health.
          </p>
        </div>

        <form onSubmit={handleAudit} className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader2 size={18} className="text-blue-500 animate-spin" />
            ) : (
              <Search
                size={18}
                className="text-slate-400 group-focus-within:text-blue-500 transition-colors"
              />
            )}
          </div>
          <input
            type="text"
            placeholder="Analyze new repository (e.g., vercel/next.js)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200/60 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:bg-slate-50 text-slate-900 placeholder:text-slate-400"
          />
        </form>
      </div>

      {/* Топ-метрики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 transition-transform duration-300 hover:-translate-y-1">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Activity size={28} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 mb-1">
              Avg Health Score
            </div>
            <div className="text-3xl font-semibold tracking-tight text-slate-900">
              {avgScore}
              <span className="text-xl text-slate-400 font-normal">/100</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 transition-transform duration-300 hover:-translate-y-1">
          <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
            <AlertTriangle size={28} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 mb-1">
              Max Tech Debt
            </div>
            <div className="text-3xl font-semibold tracking-tight text-slate-900">
              {maxTechDebt}
              <span className="text-xl text-slate-400 font-normal">%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 transition-transform duration-300 hover:-translate-y-1">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle size={28} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 mb-1">
              Audited Projects
            </div>
            <div className="text-3xl font-semibold tracking-tight text-slate-900">
              {uniqueProjects}
            </div>
          </div>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
          <p className="text-slate-500 text-lg">
            Use the search bar above to run your first AI Audit.
          </p>
        </div>
      ) : (
        <>
          {/* Блок: График динамики */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">
              Development Dynamics
            </h2>
            <p className="text-slate-500 mb-8">
              Correlation between project health and accumulated technical debt.
            </p>
            <HealthChart data={reports} />
          </div>

          {/* Лента активности (AI выводы) */}
          <div className="pt-4">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6">
              Latest AI Audits
            </h2>
            <div className="bg-white rounded-3xl border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              {reports.map((report, index) => (
                <div
                  key={report.id || index}
                  className="p-8 border-b border-slate-100 last:border-0 transition-colors hover:bg-[#fafafc] animate-in slide-in-from-top-4 duration-500"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-semibold text-xl tracking-tight text-slate-900">
                      {report.projects?.name || "Unknown Project"}
                    </div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-medium tracking-wide ${
                        report.score >= 80
                          ? "bg-emerald-50 text-emerald-700"
                          : report.score >= 60
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      Score: {report.score}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {report.ai_summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

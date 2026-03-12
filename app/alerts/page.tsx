"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabase";
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [solutions, setSolutions] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data } = await supabase
        .from("alerts")
        .select("*, projects(name)")
        .order("created_at", { ascending: false });
      if (data) setAlerts(data);
    };
    fetchAlerts();
  }, []);

  const handleTakeAction = async (
    alertId: string,
    message: string,
    repoName: string,
  ) => {
    setLoadingIds((prev) => [...prev, alertId]);
    try {
      const res = await fetch("http://localhost:3001/api/alerts/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, repoName }),
      });
      const data = await res.json();
      setSolutions((prev) => ({ ...prev, [alertId]: data.plan }));
    } catch (e) {
      alert("Failed to connect to AI engine.");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== alertId));
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">
          System Nominal
        </h2>
        <p className="text-slate-500">No active incidents detected.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
        Incident Response
      </h1>

      <div className="flex flex-col gap-6">
        {alerts.map((alert) => {
          const isResolving = loadingIds.includes(alert.id);
          const solution = solutions[alert.id];

          return (
            <div
              key={alert.id}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {alert.type}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {alert.projects?.name}
                    </span>
                    <span className="text-slate-400 text-sm flex items-center gap-1">
                      <Clock size={14} />{" "}
                      {new Date(alert.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xl text-slate-900 font-medium">
                    {alert.message}
                  </p>

                  {/* План решения от ИИ */}
                  {solution && (
                    <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
                      <h4 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-blue-500" /> AI
                        Recommended Fix
                      </h4>
                      <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {solution}
                      </div>
                    </div>
                  )}
                </div>

                {!alert.is_resolved && !solution && (
                  <button
                    onClick={() =>
                      handleTakeAction(
                        alert.id,
                        alert.message,
                        alert.projects?.name,
                      )
                    }
                    disabled={isResolving}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isResolving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                    Take Action
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

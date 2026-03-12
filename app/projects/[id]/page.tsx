import { supabase } from "../../../src/lib/supabase";
import { Github, ArrowLeft, Activity, AlertTriangle, Bug } from "lucide-react";
import Link from "next/link";
import HealthChart from "../../../src/components/HealthChart";

export const revalidate = 0;

// В новых версиях Next.js params — это Promise
export default async function ProjectDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Дожидаемся получения ID из URL
  const { id } = await params;

  // 2. Получаем данные проекта (имя и репозиторий)
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  // 3. Получаем историю отчетов
  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  // Если проект не найден, выводим красивую ошибку для дебага
  if (!project || projectError) {
    return (
      <div className="p-20 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-red-500" size={32} />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Project not found
        </h1>
        <p className="text-slate-500 mb-8">
          Could not find a project with ID:{" "}
          <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm">
            {id}
          </span>
        </p>
        <Link href="/projects" className="text-blue-600 hover:underline">
          Return to Projects List
        </Link>
      </div>
    );
  }

  const latestReport = reports?.[0];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Navigation */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors mb-6 group"
        >
          <ArrowLeft
            size={16}
            className="mr-2 transition-transform group-hover:-translate-x-1"
          />
          Back to Projects
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-2">
              {project.name}
            </h1>
            <a
              href={`https://github.com/${project.github_repo}`}
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 flex items-center hover:text-blue-600 transition-colors"
            >
              <Github size={18} className="mr-2" />
              {project.github_repo}
            </a>
          </div>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ${
              project.is_active
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {project.is_active ? "Active Monitoring" : "Paused"}
          </span>
        </div>
      </div>

      {!reports || reports.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100/50 shadow-sm text-center">
          <p className="text-slate-500 text-lg">
            No AI audits found for this project yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity size={16} /> Latest AI Summary
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                {latestReport?.ai_summary || "No summary provided."}
              </p>
            </div>

            <div className="bg-red-50/30 p-8 rounded-3xl border border-red-100/50 shadow-sm">
              <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle size={16} /> Detected Risks
              </h3>
              <p className="text-slate-800 text-lg leading-relaxed font-medium">
                {latestReport?.risks_detected ||
                  "No critical risks detected by AI."}
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6">
              Health Timeline
            </h2>
            <HealthChart data={reports} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6">
              Audit History
            </h2>
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white p-6 rounded-2xl border border-slate-100/50 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-center w-12">
                      <div className="text-3xl font-semibold text-slate-900">
                        {report.score}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Score
                      </div>
                    </div>
                    <div className="w-px h-12 bg-slate-100 hidden md:block"></div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1 font-medium">
                        {new Date(report.created_at).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                      <div className="text-slate-700 max-w-xl line-clamp-2">
                        {report.ai_summary}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100/50">
                    <Bug size={16} className="text-red-400" />
                    Debt: {report.technical_debt_score}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { supabase } from "../../src/lib/supabase";
import { generatePixelAvatar } from "../../src/lib/avatars";
import { Github, Activity, Filter, ChevronRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function ProjectsPage() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-2">
            Monitored Projects
          </h1>
          <p className="text-slate-500">
            Engineering health insights for your repositories.
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-slate-600 font-medium hover:bg-slate-50 transition-all shadow-sm">
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects?.map((project) => (
          <Link
            href={`/projects/${project.id}`}
            key={project.id}
            className="block group"
          >
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100/50 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 flex flex-col h-full relative overflow-hidden">
              <div className="flex items-start justify-between mb-8">
                {/* Возвращаем иконку GitHub в стиле Apple */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-500">
                  <Github size={28} />
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    project.is_active
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  {project.is_active ? "Active" : "Paused"}
                </div>
              </div>

              <div className="mb-10 flex-grow">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {project.name}
                </h2>
                <div className="text-slate-400 font-mono text-xs truncate">
                  {project.github_repo}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {/* NFT аватары только для людей */}
                  {["Lead", "Dev", "QA"].map((u) => (
                    <div
                      key={u}
                      className="border-2 border-white rounded-full overflow-hidden shadow-sm"
                    >
                      {generatePixelAvatar(project.name + u, 28)}
                    </div>
                  ))}
                </div>
                <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-sm font-semibold">
                  Details <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

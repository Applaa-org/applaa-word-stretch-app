import { Link, useParams, useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import { AppShell, DataCard } from "@/components/applaa";
import { ArrowLeft, Heart } from "lucide-react";
import { useState } from "react";

export function Detail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = THEMES[APP_CONFIG.theme];
  const [liked, setLiked] = useState(false);
  const item = APP_CONFIG.items.find((i) => String(i.id) === id);

  if (!item) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-xl font-bold mb-2">Not Found</h2>
          <p className="text-gray-500 mb-6 text-sm">
            This item doesn't exist or may have been removed.
          </p>
          <Link
            to="/"
            className={`${theme.primaryClass} text-white px-6 py-3 rounded-2xl font-bold inline-flex items-center gap-2 shadow-lg`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {APP_CONFIG.name}
          </Link>
        </div>
      </AppShell>
    );
  }

  // Related items — same category, excluding current
  const related = APP_CONFIG.items
    .filter(i => i.id !== item.id && (!item.category || i.category === item.category))
    .slice(0, 4);

  return (
    <AppShell>
      {/* ── Hero image with overlay ── */}
      {item.image ? (
        <div className="relative -mx-4 mb-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-64 object-cover"
            style={{ maxHeight: "280px" }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Back button over image */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-1">
              {item.badge && <span className="text-3xl">{item.badge}</span>}
              <h1 className="text-2xl font-black text-white drop-shadow-lg leading-tight">
                {item.title}
              </h1>
            </div>
            {/* Metadata pills */}
            <div className="flex flex-wrap gap-2">
              {item.category && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white">
                  {item.category}
                </span>
              )}
              {item.date && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/80">
                  {item.date}
                </span>
              )}
              {item.value && (
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${theme.primaryClass} text-white shadow`}>
                  {item.value}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* No image — simple back nav */
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors mt-4 mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          {APP_CONFIG.name}
        </button>
      )}

      {/* ── Content card ── */}
      <div className={`${theme.card} rounded-3xl p-5 shadow-xl mb-4 ${item.image ? "mt-4" : ""}`}>

        {/* When no image — title + metadata inside card */}
        {!item.image && (
          <>
            <div className="flex items-start gap-3 mb-3">
              {item.badge && <span className="text-4xl flex-shrink-0">{item.badge}</span>}
              <h1 className="text-2xl font-black leading-tight">{item.title}</h1>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {item.value && (
                <span className={`inline-flex items-center px-3 py-1.5 rounded-2xl ${theme.primaryLight} ${theme.primaryText} font-black text-lg`}>
                  {item.value}
                </span>
              )}
              {item.category && (
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${theme.pillActive}`}>
                  {item.category}
                </span>
              )}
              {item.date && (
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                  {item.date}
                </span>
              )}
            </div>
          </>
        )}

        {/* Description */}
        {item.subtitle && (
          <p className="text-base leading-relaxed text-gray-600 mb-4">{item.subtitle}</p>
        )}

        {/* Progress bar */}
        {item.progress !== undefined && (
          <div>
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-gray-700">Progress</span>
              <span className={theme.primaryText}>{item.progress}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${theme.primaryClass} rounded-full transition-all duration-700`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Related items ── */}
      {related.length > 0 && (
        <div className="mb-24">
          <h2 className="text-base font-black mb-3 flex items-center gap-2">
            <span>✨</span> More like this
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            {related.map(rel => (
              <div
                key={rel.id}
                onClick={() => navigate(`/item/${rel.id}`)}
                className={`${theme.card} rounded-2xl overflow-hidden shadow-md ${theme.shadow} flex-shrink-0 w-36 cursor-pointer
                  transition-all duration-200 hover:scale-[1.04] active:scale-[0.96]`}
              >
                {rel.image && (
                  <img src={rel.image} alt={rel.title} className="w-full h-24 object-cover" />
                )}
                <div className="p-2.5">
                  <div className="flex items-center gap-1 mb-0.5">
                    {rel.badge && <span className="text-sm">{rel.badge}</span>}
                    <span className="font-bold text-xs truncate">{rel.title}</span>
                  </div>
                  {rel.value && <span className={`text-xs font-black ${theme.primaryText}`}>{rel.value}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Floating action bar ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex gap-3 max-w-2xl mx-auto"
        style={{ background: "transparent" }}>
        <Link
          to="/"
          className={`flex-1 text-center ${theme.primaryClass} text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all hover:opacity-90 active:scale-[0.98]`}
        >
          ← Back to {APP_CONFIG.name}
        </Link>
        <button
          onClick={() => setLiked(l => !l)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-[0.92]
            ${liked ? `${theme.primaryClass} text-white` : "bg-white/80 backdrop-blur-md text-gray-500"}`}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
        </button>
      </div>
    </AppShell>
  );
}

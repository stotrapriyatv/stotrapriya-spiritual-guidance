import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../../i18n";
import { useAuth } from "../../services/auth";
import { api } from "../../services/api";
import { StatusBadge } from "../../components/StatusBadge";

interface RequestSummary {
  id: number;
  reference_number: string;
  full_name: string;
  status: string;
  created_at: string;
}

export function AdminDashboard() {
  const { t } = useTranslation();
  const { token, adminName, logout } = useAuth();
  const navigate = useNavigate();

  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [recent, setRecent] = useState<RequestSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const [countsData, requestsData] = await Promise.all([
          api.dashboard(token),
          api.listRequests(token),
        ]);
        setCounts(countsData);
        setRecent(requestsData.slice(0, 8));
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  const cards = counts
    ? [
        { label: t("admin.dashboard.new"), value: counts.new },
        { label: t("admin.dashboard.underReview"), value: counts.under_review },
        { label: t("admin.dashboard.contacted"), value: counts.contacted },
        { label: t("admin.dashboard.scheduled"), value: counts.guidance_scheduled },
        { label: t("admin.dashboard.completed"), value: counts.completed },
        { label: t("admin.dashboard.noAction"), value: counts.no_further_action },
      ]
    : [];

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-2xl text-maroon-deep">{t("admin.dashboard.title")}</h1>
          {adminName && <p className="font-body text-sm text-ink/50 mt-1">{adminName}</p>}
        </div>
        <button onClick={handleLogout} className="text-sm text-ink/60 hover:text-maroon font-medium">
          {t("admin.logout")}
        </button>
      </div>

      {loading ? (
        <p className="font-body text-sm text-ink/50">…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12">
            {cards.map((c) => (
              <div key={c.label} className="rounded-md border border-ink/10 bg-white/50 px-4 py-5 text-center">
                <div className="font-display text-3xl text-maroon-deep">{c.value}</div>
                <div className="font-body text-xs text-ink/60 mt-1 leading-tight">{c.label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-maroon-deep">{t("admin.dashboard.recent")}</h2>
            <Link to="/admin/requests" className="text-sm text-maroon font-medium hover:text-maroon-deep">
              {t("admin.dashboard.viewAll")}
            </Link>
          </div>

          <div className="divide-y divide-ink/10 border-t border-b border-ink/10">
            {recent.map((r) => (
              <Link
                key={r.id}
                to={`/admin/requests/${r.id}`}
                className="flex items-center justify-between py-3 px-1 hover:bg-white/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-body text-sm text-ink/50 w-28">{r.reference_number}</span>
                  <span className="font-body text-sm text-ink">{r.full_name}</span>
                </div>
                <StatusBadge status={r.status} />
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

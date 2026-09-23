import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "../../i18n";
import { useAuth } from "../../services/auth";
import { api, ApiError } from "../../services/api";
import { StatusBadge } from "../../components/StatusBadge";

interface RequestDetail {
  id: number;
  reference_number: string;
  full_name: string;
  mobile_number: string;
  place: string;
  male_deity: string;
  female_deity: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ActivityEntry {
  id: number;
  action: string;
  created_at: string;
}

const ACTIONS: { status: string; labelKey: string }[] = [
  { status: "UNDER_REVIEW", labelKey: "admin.detail.markUnderReview" },
  { status: "CONTACTED", labelKey: "admin.detail.markContacted" },
  { status: "GUIDANCE_SCHEDULED", labelKey: "admin.detail.markScheduled" },
  { status: "COMPLETED", labelKey: "admin.detail.markCompleted" },
  { status: "NO_FURTHER_ACTION", labelKey: "admin.detail.markNoAction" },
];

export function AdminRequestDetail() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const requestId = Number(id);

  const [record, setRecord] = useState<RequestDetail | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [updating, setUpdating] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const load = useCallback(async () => {
    if (!token || !requestId) return;
    const [r, a] = await Promise.all([
      api.getRequest(token, requestId),
      api.getActivity(token, requestId),
    ]);
    setRecord(r);
    setActivity(a);
  }, [token, requestId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(newStatus: string) {
    if (!token) return;
    setUpdating(true);
    try {
      const updated = await api.updateStatus(token, requestId, newStatus);
      setRecord(updated);
      const a = await api.getActivity(token, requestId);
      setActivity(a);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDeleteRequest() {
    if (!token || !requestId) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await api.deleteRequest(token, requestId);
      navigate("/admin/requests", {
        replace: true,
        state: { successMessage: t("admin.detail.deleteSuccess") },
      });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setDeleteError(t("admin.detail.deleteErrorNotFound"));
        } else if (err.status === 401 || err.status === 403) {
          setDeleteError(t("admin.detail.deleteErrorAuth"));
        } else {
          setDeleteError(t("admin.detail.deleteError"));
        }
      } else {
        setDeleteError(t("admin.detail.deleteError"));
      }
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
    }
  }

  if (!record) return <section className="mx-auto max-w-2xl px-6 py-12 font-body text-sm text-ink/50">…</section>;

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <Link to="/admin/requests" className="text-sm text-maroon font-medium hover:text-maroon-deep">
        ← {t("admin.detail.back")}
      </Link>

      <div className="flex items-center justify-between mt-4 mb-8">
        <h1 className="font-display text-2xl text-maroon-deep">{record.reference_number}</h1>
        <StatusBadge status={record.status} />
      </div>

      <dl className="grid grid-cols-[140px_1fr] gap-y-4 font-body text-sm mb-10">
        <dt className="text-ink/50">{t("form.fullName")}</dt>
        <dd className="text-ink">{record.full_name}</dd>

        <dt className="text-ink/50">{t("form.mobileNumber")}</dt>
        <dd className="text-ink">{record.mobile_number}</dd>

        <dt className="text-ink/50">{t("form.place")}</dt>
        <dd className="text-ink">{record.place}</dd>

        <dt className="text-ink/50">{t("form.maleDeity")}</dt>
        <dd className="text-ink">{record.male_deity}</dd>

        <dt className="text-ink/50">{t("form.femaleDeity")}</dt>
        <dd className="text-ink">{record.female_deity}</dd>

        <dt className="text-ink/50">{t("admin.detail.submitted")}</dt>
        <dd className="text-ink">{new Date(record.created_at).toLocaleString()}</dd>
      </dl>

      <div className="flex flex-wrap gap-2 mb-10">
        {ACTIONS.filter((a) => a.status !== record.status).map((a) => (
          <button
            key={a.status}
            disabled={updating}
            onClick={() => handleStatusChange(a.status)}
            className="rounded-arch border border-maroon/30 px-4 py-2 text-sm text-maroon-deep font-medium hover:bg-maroon/5 transition-colors disabled:opacity-50"
          >
            {t(a.labelKey)}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setDeleteConfirmOpen(true)}
          className="rounded-arch border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
        >
          {t("admin.detail.delete")}
        </button>
      </div>

      {deleteError && <p className="mb-4 text-sm font-medium text-red-700">{deleteError}</p>}

      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 px-4">
          <div className="w-full max-w-md rounded-xl border border-ink/10 bg-paper p-5 shadow-lg">
            <h2 className="font-display text-xl text-maroon-deep mb-3">{t("admin.detail.deleteTitle")}</h2>
            <p className="font-body text-sm text-ink/70 leading-relaxed mb-5">
              {t("admin.detail.deleteDescription")}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="rounded-arch border border-ink/20 px-4 py-2 text-sm font-medium text-ink/70 hover:bg-ink/5"
              >
                {t("admin.detail.deleteCancel")}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteRequest}
                className="rounded-arch border border-red-300 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? t("admin.detail.deleting") : t("admin.detail.deleteConfirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="font-display text-lg text-maroon-deep mb-3">{t("admin.detail.activity")}</h2>
      <ul className="space-y-2 border-l-2 border-ink/10 pl-4">
        {activity.map((entry) => (
          <li key={entry.id} className="font-body text-sm">
            <span className="text-ink/40 text-xs block">{new Date(entry.created_at).toLocaleString()}</span>
            <span className="text-ink/80">{entry.action}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

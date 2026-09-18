import React, { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Eye,
  MessageSquare,
  MoreHorizontal,
  Search,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const statusConfig = {
  published: {
    label: "Published",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
  hidden: {
    label: "Hidden",
    className: "border-red-500/20 bg-red-500/10 text-red-400",
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.published;

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function Rating({ value }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={13}
          className={
            star <= value
              ? "fill-yellow-400 text-yellow-400"
              : "text-slate-700"
          }
        />
      ))}

      <span className="ml-1 text-xs font-semibold text-white">
        {value}.0
      </span>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function AdminReviews() {
  const {
    reviews,
    updateReviewStatus,
    addAuditLog,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  const averageRating = useMemo(() => {
    if (!reviews.length) return "0.0";

    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating),
      0
    );

    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const fiveStarCount = reviews.filter(
    (review) => Number(review.rating) === 5
  ).length;

  const lowRatingCount = reviews.filter(
    (review) => Number(review.rating) <= 2
  ).length;

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        review.user.toLowerCase().includes(keyword) ||
        review.event.toLowerCase().includes(keyword) ||
        review.comment.toLowerCase().includes(keyword);

      const matchesRating =
        ratingFilter === "all" ||
        Number(review.rating) === Number(ratingFilter);

      const matchesStatus =
        statusFilter === "all" ||
        review.status === statusFilter;

      return matchesSearch && matchesRating && matchesStatus;
    });
  }, [reviews, search, ratingFilter, statusFilter]);

  const hideReview = (id) => {
    updateReviewStatus(id, "hidden");
    setMenuId(null);

    if (selectedReview?.id === id) {
      setSelectedReview((current) =>
        current ? { ...current, status: "hidden" } : current
      );
    }
  };

  const publishReview = (id) => {
    updateReviewStatus(id, "published");
    setMenuId(null);

    if (selectedReview?.id === id) {
      setSelectedReview((current) =>
        current ? { ...current, status: "published" } : current
      );
    }
  };

  const deleteReview = (id) => {
    addAuditLog("Delete Review", `Review #${id}`);
    setMenuId(null);

    if (selectedReview?.id === id) {
      setSelectedReview(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-300">
          <Star size={13} />
          Review Moderation
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Reviews
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Pantau dan moderasi review pengguna terhadap event
            yang tersedia di platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Review"
          value={reviews.length}
          icon={MessageSquare}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Average Rating"
          value={averageRating}
          icon={Star}
          iconClass="bg-yellow-500/10 text-yellow-400"
        />

        <StatCard
          title="5 Star Review"
          value={fiveStarCount}
          icon={Check}
          iconClass="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Low Rating"
          value={lowRatingCount}
          icon={MessageSquare}
          iconClass="bg-red-500/10 text-red-400"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d1422] p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-lg">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari user, event, atau review..."
              className="h-11 w-full rounded-xl border border-white/10 bg-[#090f1b] pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/40"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="flex h-11 w-full items-center justify-between gap-5 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:w-52"
            >
              <span className="flex items-center gap-2">
                <ChevronDown size={14} />

                {ratingFilter === "all"
                  ? statusFilter === "all"
                    ? "Semua Filter"
                    : statusConfig[statusFilter]?.label
                  : `${ratingFilter} Star`}
              </span>

              <ChevronDown
                size={15}
                className={`transition ${
                  showFilter ? "rotate-180" : ""
                }`}
              />
            </button>

            {showFilter && (
              <>
                <button
                  type="button"
                  aria-label="Close filter"
                  onClick={() => setShowFilter(false)}
                  className="fixed inset-0 z-10 cursor-default"
                />

                <div className="absolute right-0 top-12 z-20 w-52 rounded-xl border border-white/10 bg-[#151c2c] p-1.5 shadow-2xl">
                  <p className="px-3 pb-2 pt-2 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                    Rating
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setRatingFilter("all");
                      setShowFilter(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs text-slate-400 hover:bg-white/5 hover:text-white"
                  >
                    Semua Rating
                    {ratingFilter === "all" && <Check size={14} />}
                  </button>

                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => {
                        setRatingFilter(String(rating));
                        setShowFilter(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs text-slate-400 hover:bg-white/5 hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <Star
                          size={13}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        {rating} Star
                      </span>

                      {ratingFilter === String(rating) && (
                        <Check size={14} />
                      )}
                    </button>
                  ))}

                  <div className="my-1.5 border-t border-white/5" />

                  <p className="px-3 pb-2 pt-2 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                    Status
                  </p>

                  {[
                    { value: "all", label: "Semua Status" },
                    { value: "published", label: "Published" },
                    { value: "hidden", label: "Hidden" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setStatusFilter(item.value);
                        setShowFilter(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs text-slate-400 hover:bg-white/5 hover:text-white"
                    >
                      {item.label}

                      {statusFilter === item.value && (
                        <Check size={14} />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  User
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Concert
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Rating
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Review
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Date
                </th>

                <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.015]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                          <Users size={15} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-white">
                            {review.user}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-600">
                            Customer
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="max-w-[180px] px-5 py-4">
                      <p className="truncate text-xs font-medium text-slate-300">
                        {review.event}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <Rating value={Number(review.rating)} />
                    </td>

                    <td className="max-w-[300px] px-5 py-4">
                      <p className="truncate text-xs text-slate-400">
                        {review.comment}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={review.status} />
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                      {review.createdAt}
                    </td>

                    <td className="relative px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setMenuId(
                            menuId === review.id ? null : review.id
                          )
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {menuId === review.id && (
                        <>
                          <button
                            type="button"
                            aria-label="Close menu"
                            onClick={() => setMenuId(null)}
                            className="fixed inset-0 z-10 cursor-default"
                          />

                          <div className="absolute right-5 top-12 z-20 w-48 rounded-xl border border-white/10 bg-[#151c2c] p-1.5 text-left shadow-2xl">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedReview(review);
                                setMenuId(null);
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"
                            >
                              <Eye size={15} />
                              Lihat Detail
                            </button>

                            {review.status === "published" ? (
                              <button
                                type="button"
                                onClick={() => hideReview(review.id)}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-yellow-400 transition hover:bg-yellow-500/10"
                              >
                                <X size={15} />
                                Sembunyikan
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  publishReview(review.id)
                                }
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-emerald-400 transition hover:bg-emerald-500/10"
                              >
                                <Check size={15} />
                                Publish
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => deleteReview(review.id)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-red-400 transition hover:bg-red-500/10"
                            >
                              <Trash2 size={15} />
                              Hapus
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-600">
                      <MessageSquare size={20} />
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-400">
                      Review tidak ditemukan
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Coba gunakan pencarian atau filter yang berbeda.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-white/5 px-5 py-4">
          <p className="text-[10px] text-slate-600">
            Menampilkan{" "}
            <span className="font-semibold text-slate-400">
              {filteredReviews.length}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-slate-400">
              {reviews.length}
            </span>{" "}
            review
          </p>
        </div>
      </div>

      {selectedReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#101827] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Review Detail
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Detail review pengguna
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <Users size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {selectedReview.user}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-600">
                    {selectedReview.createdAt}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <Rating value={Number(selectedReview.rating)} />
                <StatusBadge status={selectedReview.status} />
              </div>

              <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Concert
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  {selectedReview.event}
                </p>
              </div>

              <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Review
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {selectedReview.comment}
                </p>
              </div>

              <div className="mt-5 flex gap-2">
                {selectedReview.status === "published" ? (
                  <button
                    type="button"
                    onClick={() => hideReview(selectedReview.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-xs font-semibold text-yellow-400 transition hover:bg-yellow-500/15"
                  >
                    <X size={14} />
                    Sembunyikan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      publishReview(selectedReview.id)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/15"
                  >
                    <Check size={14} />
                    Publish
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
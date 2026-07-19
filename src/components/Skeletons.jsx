export const SkeletonCard = ({ className = '' }) => (
  <div className={`card-surface rounded-xl2 p-5 shadow-soft ${className}`}>
    <div className="skeleton h-3 w-20 rounded-full" />
    <div className="skeleton mt-4 h-7 w-16 rounded-lg" />
  </div>
);

export const SkeletonSubjectCard = () => (
  <div className="card-surface rounded-xl2 p-5 shadow-soft">
    <div className="skeleton h-10 w-10 rounded-xl" />
    <div className="skeleton mt-4 h-4 w-28 rounded-full" />
    <div className="mt-4 grid grid-cols-2 gap-2">
      <div className="skeleton h-3 w-full rounded-full" />
      <div className="skeleton h-3 w-full rounded-full" />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <tr className="border-b border-ink-100/70">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="skeleton h-3.5 w-full rounded-full" />
      </td>
    ))}
  </tr>
);

export const SkeletonProfileCard = () => (
  <div className="card-surface flex items-center gap-4 rounded-xl2 p-6 shadow-soft">
    <div className="skeleton h-16 w-16 shrink-0 rounded-2xl" />
    <div className="flex-1 space-y-3">
      <div className="skeleton h-4 w-32 rounded-full" />
      <div className="skeleton h-3 w-48 rounded-full" />
    </div>
  </div>
);

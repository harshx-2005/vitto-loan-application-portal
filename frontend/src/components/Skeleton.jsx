import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/80 shimmer-effect ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm flex flex-col gap-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-1/2 mt-1" />
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 8 }) => {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className={`h-4 ${i === 0 ? 'w-24' : i === 2 ? 'w-16' : 'w-20'}`} />
        </td>
      ))}
    </tr>
  );
};

export default Skeleton;

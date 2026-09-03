const MetricCardSkeleton = () => {
  return (
    <div className="relative bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden animate-pulse">
      {/* Accent bar */}
      <div className="h-[3px] w-full bg-gray-800" />

      <div className="p-4">
        {/* Label skeleton */}
        <div className="h-3 w-20 bg-gray-800 rounded mb-3" />

        {/* Value skeleton */}
        <div className="h-7 w-28 bg-gray-700 rounded" />

        {/* Delta skeleton */}
        <div className="h-3 w-16 bg-gray-800 rounded mt-2" />
      </div>
    </div>
  );
};

export default MetricCardSkeleton;

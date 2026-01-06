export function PostSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-5 bg-white rounded-[20px] border animate-pulse">
      <div className="w-full md:w-[280px] aspect-[4/3] bg-gray-200 rounded-xl" />
      <div className="flex-1 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}
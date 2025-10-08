// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function OpendaysSkeleton() {
  return (
    <div className={`${shimmer} flex grow flex-col justify-between rounded-xl bg-gray-50 p-4`}>
      <div className="bg-green-50 p-2">
        <h2 className={`mb-4 text-xl md:text-1xl pt-2`}></h2>
        {/* Header row: hidden on mobile, visible on md+ */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-2 py-1 font-semibold text-gray-700 text-sm md:text-base border-b border-gray-200">
          <div className="col-span-5">&nbsp;</div>
          <div className="col-span-5">&nbsp;</div>
          <div className="col-span-2">&nbsp;</div>
        </div>
        {[1, 2, 3].map((row) => (
          <div
            key={row}
            className="grid md:grid-cols-12 grid-cols-1 items-start md:items-center p-4 bg-white border-t first:border-t-0"
          >
            {/* Title & Campus */}
            <div className="md:col-span-5 min-w-0">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
            {/* Date/Time */}
            <div className="md:col-span-5 mt-2 md:mt-0">
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>
            {/* Edit button */}
            <div className="md:col-span-2 flex md:justify-center items-center mt-2 md:mt-0">
              <div className="h-5 w-5 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EventSkeleton() {
  return (
    <div className={`${shimmer} space-y-4`}>
      {[1, 2, 3].map((event) => (
        <div
          key={event}
          className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="h-5 w-48 bg-gray-200 dark:bg-gray-600 rounded mb-1" />
              <div className="h-4 w-64 bg-gray-100 dark:bg-gray-600 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-100 dark:bg-gray-600 rounded" />
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <div className="h-6 w-12 bg-gray-200 dark:bg-gray-600 rounded" />
              <div className="h-6 w-14 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
            <div className="space-y-2">
              {[1, 2].map((session) => (
                <div key={session} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-600/30 p-2 rounded">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded" />
                  <div className="flex space-x-1">
                    <div className="h-5 w-10 bg-gray-200 dark:bg-gray-600 rounded" />
                    <div className="h-5 w-12 bg-gray-200 dark:bg-gray-600 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function OpendaysSkeleton() {
  return (
    <div className={`${shimmer} flex grow flex-col justify-between rounded-xl bg-gray-50 p-4`}>
      <div className="bg-green-50 p-2">
        <h2 className={` mb-4 text-xl md:text-1xl pt-2`}></h2>
          <div
            className="flex flex-row items-center justify-between p-4 bg-white"
          >
            <div className="flex">
              <div className="min-w-0">
                <p></p>
                <p></p>
              </div>
            </div>
            <div className="flex">
            </div>
            <div className="flex items-center">
            </div>
          </div>
          <div
            className="flex flex-row items-center justify-between p-4 bg-white"
          >
            <div className="flex">
              <div className="min-w-0">
              </div>
            </div>
            <div className="flex">
            </div>
            <div className="flex items-center">
            </div>
          </div>
          <div
            className="flex flex-row items-center justify-between p-4 bg-white"
          >
            <div className="flex">
              <div className="min-w-0">
              </div>
            </div>
            <div className="flex">
            </div>
            <div className="flex items-center">
            </div>
          </div>
      </div>
    </div>
  );
}
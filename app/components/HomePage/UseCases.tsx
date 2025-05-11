import Image from "next/image";
export default function UseCases() {
  return (
    <div id="use-cases" className="min-h-screen h-screen flex flex-col justify-center">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl">Use Cases</h2>
        <div className="mt-10 sm:mt-4 md:mt-16 space-y-10 sm:space-y-2 md:space-y-10">
          <div className="flex flex-col gap-5 sm:gap-10 sm:flex-row sm:items-center">
            <div className="flex flex-col space-y-1 sm:space-y-1 md:space-y-2 sm:w-3/12 md:w-4/12">
              <span className="text-xl lg:text-2xl font-semibold text-left">Feature Requests</span>
              <span className="text-lg lg:text-xl">Ask GitAuto to create a feature</span>
            </div>
            <div className="w-full sm:w-9/12 md:w-8/12">
              <Image
                src="/homepage/feature.png"
                width={907}
                height={252}
                loading="lazy"
                alt="A feature request GitHub issue example for GitAuto"
                className="p-2 sm:p-2 md:p-4 bg-stone-200 rounded-lg"
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 sm:gap-10 sm:flex-row sm:items-center">
            <div className="flex flex-col space-y-1 sm:space-y-1 md:space-y-2 sm:w-3/12 md:w-4/12">
              <span className="text-xl lg:text-2xl font-semibold text-left">Bug Fixes</span>
              <span className="text-lg lg:text-xl">Ask GitAuto to fix bugs</span>
            </div>
            <div className="w-full sm:w-9/12 md:w-8/12">
              <Image
                src="/homepage/bugfix.png"
                width={907}
                height={252}
                loading="lazy"
                alt="A bug report GitHub issue example for GitAuto"
                className="p-2 sm:p-2 md:p-4 bg-stone-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

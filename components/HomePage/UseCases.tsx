import Image from "next/image";
export default function UseCases() {
  return (
    <div id="use-cases" className="h-screen flex flex-col py-16">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl">Use Cases</h2>
        <div className="mt-10 lg:mt-16">
          <div className="flex flex-col gap-5 lg:gap-10 lg:flex-row justify-between items-center">
            <div className="flex flex-col gap-2">
              <span className="text-xl lg:text-3xl">Feature Requests</span>
              <span className="text-lg lg:text-xl">Ask GitAuto to create a feature</span>
            </div>
            <div className="w-full md:w-8/12">
              <Image
                src="/homepage/feature.png"
                width={907}
                height={252}
                alt="Feature Request"
                className="p-2 sm:p-3 md:p-4 bg-stone-200 rounded-lg"
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 lg:gap-10 lg:flex-row justify-between items-center mt-10">
            <div className="flex flex-col gap-2">
              <span className="text-xl lg:text-3xl">Bug Fixes</span>
              <span className="text-lg lg:text-xl">Ask GitAuto to fix bugs</span>
            </div>
            <div className="w-full md:w-8/12">
              <Image
                src="/homepage/bugfix.png"
                width={907}
                height={252}
                alt="Feature Request"
                className="p-2 sm:p-3 md:p-4 bg-stone-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

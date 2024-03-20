import Image from "next/image";
export default function Features() {
  return (
    <div className="bg-white text-black w-[100vw] flex flex-col py-16">
      <div className="flex flex-col items-center">
        <h2 className="text-center text-3xl">Let AI do the work for you</h2>
        <div className=" w-[95vw] sm:w-[80vw] lg:w-[1000px] 2xl:w-[1250px] mt-16 mx-5">
          <div className="flex flex-col gap-10 lg:flex-row justify-between items-center">
            <div className="flex flex-col gap-2 min-w-[200px] lg:max-w-[200px] xxl:max-w-auto">
              <span className="text-3xl">Feature Requests</span>
              <span className="text-xl">Ask GitAuto to create a feature</span>
            </div>
            <Image
              src="/homepage/feature.png"
              width={907}
              height={252}
              alt="Feature Request"
              className="p-2 sm:p-3 lg:p-4 bg-light rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-10 lg:flex-row justify-between items-center mt-10">
            <div className="flex flex-col gap-2 min-w-[200px] lg:max-w-[200px] xxl:max-w-auto">
              <span className="text-3xl">Bug Fixes</span>
              <span className="text-xl">Ask GitAuto to fix bugs</span>
            </div>
            <Image
              src="/homepage/bugfix.png"
              width={907}
              height={252}
              alt="Feature Request"
              className="p-2 sm:p-3 lg:p-4 bg-light rounded-lg"
            />
          </div>
          {/* Not yet a feature */}
          {/* <div className="flex">
          <div className="flex flex-col">
            <span>Code Debt</span>
            <span>Ask GitAuto to refactor and fix code</span>
          </div>
          <Image
            src="/homepage/error.png"
            width={300}
            height={300}
            alt="Feature Request"
          />
        </div> */}
        </div>
      </div>
    </div>
  );
}

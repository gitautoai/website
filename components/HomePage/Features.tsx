import Image from "next/image";
export default function Features() {
  return (
    <div className="bg-white text-black w-[100vw] flex flex-col py-16">
      <div className="flex flex-col items-center">
        <h2 className="text-center text-3xl">
          Reduce cost by 99% by never hiring an engineer
        </h2>
        <div className=" w-[95vw]  sm:w-[80vw] 2xl:w-[800px] mt-16">
          <div className="flex flex-col gap-5 lg:gap-0 lg:flex-row justify-between items-center  ">
            <div className="flex flex-col">
              <span className="text-xl">Feature Requests</span>
              <span className="text-lg">Ask GitAuto to create a feature</span>
            </div>
            <Image
              src="/homepage/feature.png"
              width={500}
              height={500}
              alt="Feature Request"
              className="p-5 bg-light rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-5 lg:gap-0 lg:flex-row justify-between items-center mt-10">
            <div className="flex flex-col ">
              <span className="text-xl">Bug Fixes</span>
              <span className="text-lg">Ask GitAuto to fix bugs</span>
            </div>
            <Image
              src="/homepage/bugfix.png"
              width={300}
              height={300}
              alt="Feature Request"
              className="p-5 bg-light rounded-lg"
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

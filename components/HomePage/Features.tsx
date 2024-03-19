import Image from "next/image";
export default function Features() {
  return (
    <div className="bg-white text-black w-[100vw] flex flex-col py-16">
      <div className="flex flex-col items-center">
        <h2 className="text-center text-3xl">
          Reduce cost by 99% by never hiring an engineer
        </h2>
        <div className="flex gap-5 mt-5">
          <div className="flex flex-col">
            <span>Feature Requests</span>
            <span>Ask GitAuto to create a feature</span>
          </div>
          <Image
            src="/homepage/error.png"
            width={300}
            height={300}
            alt="Feature Request"
          />
        </div>
        <div className="flex">
          <div className="flex flex-col">
            <span>Bug Fixes</span>
            <span>Ask GitAuto to fix bugs</span>
          </div>
          <Image
            src="/homepage/error.png"
            width={300}
            height={300}
            alt="Feature Request"
          />
        </div>
        <div className="flex">
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
        </div>
      </div>
    </div>
  );
}

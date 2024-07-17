import { PRODUCT_NAME } from "@/config";
import Image from "next/image";

const Problem = () => {
  return (
    <div
      id="problem"
      className="h-screen flex flex-col items-center justify-center gap-4 sm:gap-4 md:gap-10"
    >
      <h2 className="text-3xl sm:text-3xl md:text-4xl">Problem we tackle</h2>
      <div className="flex flex-col items-center gap-4 sm:gap-2 md:gap-4">
        <p className="w-full sm:w-10/12 md:w-10/12 text-center">
          71% of SaaS companies aren't satisfied with their development speed. {PRODUCT_NAME} helps
          SaaS engineering teams facing resource constraints, hiring challenges, and high pressure
          to deliver more features and fix bugs faster.
        </p>
        <div className="w-full sm:w-9/12 md:w-10/12">
          <Image
            src="/homepage/problem-tree.png"
            width={2666}
            height={1114}
            loading="lazy"
            alt="A tree diagram dissecting development speed for engineering teams"
            className=""
          />
        </div>
      </div>
    </div>
  );
};

export default Problem;

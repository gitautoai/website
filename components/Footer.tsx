import Link from "next/link";
export default function Footer() {
  return (
    <div className="flex flex-col w-full mt-auto justify-center font-helvetica items-center bg-darkBlue shadow-lg fixed bottom-0 mb-4">
      <div className="flex  w-[95vw] footerXM:w-[90vw] footerSM:w-[85vw]  sm:w-[80vw] xxl:w-[1280px] flex-col justify-center ">
        <div className="flex flex-col gap-10 footerXM:gap-0 footerXM:flex-row items-center py-10 mt-auto w-full text-white text-lg font-helvetica justify-center ">
          <div className="flex flex-wrap  gap-16 xl:gap-32 mx-auto w-auto ">
            <ol className="flex gap-2">
              <li>
                <Link
                  href="/"
                  passHref
                  className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
                >
                  Github
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  passHref
                  className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  passHref
                  className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  passHref
                  className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
                >
                  Docs
                </Link>
              </li>
            </ol>
          </div>
        </div>
        <span className="mx-auto text-white">
          &copy; 2024 GitAuto. All Rights Reserved
        </span>
      </div>
    </div>
  );
}

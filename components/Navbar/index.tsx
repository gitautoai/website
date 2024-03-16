// import WebNav from "./webNav";
// import MobileNav from "./mobileNav";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex flex-col w-full justify-center font-helvetica font-normal items-center bg-white text-black">
      <div className="flex flex-col w-[95vw] footerXM:w-[90vw] footerSM:w-[85vw] sm:w-[80vw] xxl:w-[1280px] ">
        <nav className="flex text-lg justify-center items-center my-4">
          <Link href="/" className="mr-auto ml-5">
            <div className="flex items-center gap-2 text-sm footerSM:text-xl text-black">
              <Image
                src="/transparent-not-centered.png"
                width={30}
                height={30}
                alt="GitAuto Logo"
              />
              <span className="font-bold font-lexend text-black">GitAuto</span>
            </div>
          </Link>
          <ol className="flex gap-2">
            <li>
              <Link
                href="/#pricing"
                passHref
                className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
              >
                Pricing
              </Link>
            </li>
            {/* <li>
              <Link
                href="/pricing"
                passHref
                className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
              >
                Documentation
              </Link>
            </li> */}
          </ol>
          {/* <WebNav></WebNav> */}

          {/* <MobileNav session={session} status={status}></MobileNav> */}
        </nav>
      </div>
      <hr className="h-[1px] opacity-50 bg-[#C2C2C2] w-full border-0 rounded"></hr>
    </div>
  );
}

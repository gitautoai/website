// import WebNav from "./webNav";
// import MobileNav from "./mobileNav";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex flex-col w-full justify-center font-helvetica font-normal items-center bg-white ">
      <div className="flex flex-col w-[95vw] footerXM:w-[90vw] footerSM:w-[85vw] sm:w-[80vw] xxl:w-[1280px] ">
        <nav className="flex text-lg justify-center items-center my-4">
          <Link href="/" className="mr-auto ml-5">
            <div className="flex flex-col items-start text-sm footerSM:text-xl text-black">
              <span className="font-bold font-lexend text-blue">GitAuto</span>
            </div>
          </Link>

          <div>Pricing Documentation</div>
          {/* <WebNav></WebNav> */}

          {/* <MobileNav session={session} status={status}></MobileNav> */}
        </nav>
      </div>
      <hr className="h-[1px] opacity-50 bg-[#C2C2C2] w-full border-0 rounded"></hr>
    </div>
  );
}

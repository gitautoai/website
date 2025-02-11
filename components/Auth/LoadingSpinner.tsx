import { Spinner } from "@chakra-ui/react";
import Image from "next/image";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-239px)] bg-gray-100">
      <div className="relative flex items-center">
        <Spinner
          thickness="4px"
          speed=".8s"
          emptyColor="gray.200"
          color="#f23b87"
          width={{ base: "100px", md: "200px" }}
          height={{ base: "100px", md: "200px" }}
        />
        <div
          className="absolute
			w-[46px] h-[46px] ml-[27px]
			md:w-[90px] md:h-[90px] md:ml-[55px]"
        >
          <Image src="/logo.png" alt="GitAuto Logo" fill loading="lazy" />
        </div>
      </div>
    </div>
  );
}

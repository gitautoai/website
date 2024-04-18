// import React from "react";

// export default function Page() {
//   const { data: content } = useSWR("/api/markdown/privacy-policy", async () => {
//     const res = await fetch("/api/markdown/privacy-policy");
//     return res.json();
//   });
//   console.log(content);

//   return (
//     <div
//       className="outer"
//       // dangerouslySetInnerHTML={{
//       //   __html: md.render("HELLO WORLD"),
//       // }}
//     ></div>
//   );
// }
"use client";
import React, { useEffect, useState } from "react";

import markdownIt from "markdown-it";
import highlightjs from "markdown-it-highlightjs";
import markdownItAnchor from "markdown-it-anchor";

// Components
import Footer from "@/components/Footer";

// Analytics
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";

export default function Home() {
  const [content, setContent] = useState("");
  useEffect(() => {
    async function getContent() {
      const response = await fetch("/api/markdown/privacy-policy");
      const res = await response.json();
      setContent(await res);
    }
    if (!content) {
      getContent();
    }
  }, [content]);

  // const md = markdownIt({ html: true })
  //   .use(highlightjs, { inline: true })
  //   .use(markdownItAnchor, {
  //     tabIndex: false,
  //     permalink: markdownItAnchor.permalink.headerLink(),
  //   });

  return (
    <div className="bg-light text-black ">
      <div className="min-h-[calc(100vh-232px)] mx-5 text-center">
        <div className="flex flex-col justify-center items-center text-xl sm:text-2xl gap-10 ">
          <span className="mt-16">
            You have not installed our GitHub Marketplace App.
          </span>
          <div
            className="outer"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          ></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

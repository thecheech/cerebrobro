"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export function OpenAiPixel({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const measure =
    pathname === "/thanks"
      ? 'oaiq("measure", "appointment_scheduled", { type: "customer_action" });'
      : "";

  return (
    <Script id="openai-ads-pixel" strategy="afterInteractive">
      {`(function (w, d, s, u) {
  if (w.oaiq) return;
  var q = function () { q.q.push(arguments); };
  q.q = [];
  w.oaiq = q;
  var js = d.createElement(s);
  js.async = true;
  js.src = u;
  var f = d.getElementsByTagName(s)[0];
  f.parentNode.insertBefore(js, f);
})(window, document, "script", "https://bzrcdn.openai.com/sdk/oaiq.min.js");
oaiq("init", { pixelId: "${pixelId}" });
${measure}`}
    </Script>
  );
}

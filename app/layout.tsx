import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { ReactNode } from "react";
import "@/app/_global/styles/globals.css";
import BasicUI from "@/app/_global/component/BasicUI";
import { ModalProvider } from "@/app/_global/providers/ModalProvider";
import QueryProvider from "./_global/providers/QueryProvider";
import { PageMetaProvider } from "@/app/_global/providers/PageMetaProvider";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  icons: {
    icon: "/wooriIcon.png",
    // shortcut: "/favicon-16x16.png",
    // apple: "/apple-touch-icon.png",
  },
  title: "Woori Dolfin Plus",
  description: "Korean Equity Market Insights Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    // FIXME: 테스트 용도
    <html lang="ko" className={"typo-base mx-auto md:max-w-[720px]"}>
      {/*<html lang="ko" className={"typo-base"}>*/}
      <body className={`${notoSansKR.className} bg-neutral-500 antialiased`}>
        <QueryProvider>
          <ModalProvider>
            <PageMetaProvider>
              <BasicUI>{children}</BasicUI>
            </PageMetaProvider>
          </ModalProvider>
          <div id={"modal-root"} />
        </QueryProvider>
      </body>
    </html>
  );
}

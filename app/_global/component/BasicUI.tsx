"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback } from "react";
import { Back, LaurenLogo } from "@/app/_common/component/atoms/Icon";
import Footer from "@/app/_global/component/Footer";
import { usePageMeta } from "@/app/_global/providers/PageMetaProvider";

interface BasicUIProps {
  children?: ReactNode;
  hideFooter?: boolean;
}

export default function BasicUI({
  children,
  hideFooter = false,
}: Readonly<BasicUIProps>) {
  const router = useRouter();
  const [pageDepth, pathname] = useCalculatePathDepth();

  const { hideFooter: hideFooterFromContext } = usePageMeta();

  // Hide footer when:
  // - explicit prop requests it
  // - context (set by error.tsx or not-found.tsx) requests it
  // - certain sections (business rule) should not show footer
  const shouldHideFooter =
    hideFooter ||
    hideFooterFromContext ||
    pathname.includes("/company-info/") ||
    pathname.includes("/company-search") 


  
  const handleBackButtonClick = useCallback(() => {
    // Check if there's history to go back to
    if (window.history.length > 1 && pageDepth >= 2) {
      window.history.back();
    } else {
      // If no history or shallow depth, navigate to home instead of closing window
      router.push('/');
    }
  }, [pageDepth, router]);

  return (
    <main
      className={
        "mx-auto flex min-h-screen max-w-[1080px] flex-col overflow-x-hidden"
      }
      style={{
        backgroundColor: pathname.includes("issues/latest")
          ? "#2684ff"
          : "white",
      }}
    >
      <nav className={"flex w-full flex-col"}>
        <div className={"relative flex items-center justify-between px-3 py-5"}>
          <button
            className={"p-2"}
            onClick={handleBackButtonClick}
            title={"뒤로가기"}
          >
            <Back className={"size-5"} />
          </button>
          {pageDepth < 3 && (
            <div
              className={
                "text-gray-w400 bold typo-micro flex items-center gap-1"
              }
            >
              by <LaurenLogo className={"rounded-sm"} />
            </div>
          )}
        </div>
      </nav>
      {children}
      {!shouldHideFooter && <Footer />}
    </main>
  );
}

const useCalculatePathDepth = () => {
  const pathname = usePathname();

  return [pathname.split("/").length - 1, pathname] as const;
};

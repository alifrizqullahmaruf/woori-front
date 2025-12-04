import { Suspense } from "react";
import CompanySearchPageClient from "./CompanySearchPageClient";

export default function CompanySearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-gray-600">검색 페이지를 불러오는 중입니다…</p>
        </div>
      }
    >
      <CompanySearchPageClient />
    </Suspense>
  );
}

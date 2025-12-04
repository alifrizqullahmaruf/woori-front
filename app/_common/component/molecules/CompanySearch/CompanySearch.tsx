
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import type { CompanySearchProps } from "./types";

// Refactored: company search is now a simple trigger that navigates
// to the dedicated search page. Props stay compatible but are unused
// here except for `placeholder` to preserve API shape.
export default function CompanySearch({
  placeholder = "종목 검색",
}: CompanySearchProps) {
  const router = useRouter();

  return (
    <div className="relative w-full">
      <div className="relative">
        <FiSearch
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
          size={18}
          aria-hidden="true"
        />
        <input
          type="text"
          onClick={() => router.replace("/company-search")}
          placeholder={placeholder}
          readOnly
          className="w-full cursor-pointer rounded-lg border border-[#8C8D96] bg-white py-2.5 pr-10 pl-10 text-sm transition-all duration-200 outline-none"
          aria-label="회사 검색"
        />
      </div>
    </div>
  );
}

  // (All overlay/search logic removed.)

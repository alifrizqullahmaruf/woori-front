import { Suspense } from "react";
import LatestIssuesPageView from "@/app/issues/latest/_component/LatestIssuesPageView";

export default function LatestIssuesPage() {
  return (
    <Suspense>
      <LatestIssuesPageView />
    </Suspense>
  );
}

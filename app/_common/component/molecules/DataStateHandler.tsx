import LoadingDots from "@/app/_common/component/atoms/LoadingDots";
import PageViewContainer from "@/app/_common/component/templates/PageViewContainer";
import Empty from "@/app/_common/assets/icons/Empty_V2.svg";

interface DataStateHandlerProps {
  isLoading: boolean;
  error: Error | null;
  isEmpty?: boolean;
  title?: string;
  children: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

export function DataStateHandler({
  isLoading,
  error,
  isEmpty,
  title,
  children,
  emptyComponent
}: DataStateHandlerProps) {
  if (isLoading) {
    return (
      <PageViewContainer>
        {title && <h2 className="typo-micro mb-[18px]">{title}</h2>}
        <div className="flex items-center justify-center py-8">
          <LoadingDots />
        </div>
      </PageViewContainer>
    );
  }

  if (error) {
    return (
      <PageViewContainer>
        {title && <h2 className="typo-micro mb-[18px]">{title}</h2>}
        <div className="flex items-center justify-center py-8 text-red-500">
          데이터 불러오는 중 오류가 발생했습니다.
        </div>
      </PageViewContainer>
    );
  }

  if (isEmpty) {
    
    if (emptyComponent) return <PageViewContainer>{emptyComponent}</PageViewContainer>;

    return (
      <PageViewContainer>
        <div className="flex flex-col items-center justify-center py-10">
          <Empty className="size-10 text-gray-400" />
          <p className="text-base text-black">이 회사는 현재 데이터가 없습니다.</p>
        </div>
      </PageViewContainer>
    );
  }

  return <>{children}</>;
}

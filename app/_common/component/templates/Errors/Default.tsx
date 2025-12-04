export default function ErrorDefault() {
  return (
    <div
      className={"flex flex-1 flex-col items-center justify-center gap-7 p-7"}
    >
      <h1 className={"text-center text-4xl"}>잘못된 경로입니다.</h1>
      <p className={"text-center text-xl"}>관리자에게 문의해주세요.</p>
      <button
        className={
          "w-max rounded-lg bg-sky-500 px-5 py-2 text-xl font-bold text-white"
        }
      >
        돌아가기
      </button>
    </div>
  );
}

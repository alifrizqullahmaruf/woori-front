export interface DummyTableContents {
  category: string;
  value:
    | string
    | {
        companyName: string;
        stockCode: string;
      };
}

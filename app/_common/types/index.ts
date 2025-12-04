export interface TabListData {
  text: string;
  value: string;
}

export interface HelpDescriptions {
  title: string;
  content?: string;
  summary?: string;
  note?: string;
  items?: Array<{
    summary: string;
    content: string;
  }>;
}
export type HelpTexts = Record<string, HelpDescriptions>;

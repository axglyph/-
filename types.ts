
export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  date?: string;
}

export interface QuantumTrends {
  chinese: NewsItem[];
  english: NewsItem[];
}

export enum Language {
  CHINESE = 'zh',
  ENGLISH = 'en'
}

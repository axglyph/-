
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
  // Mandatory: Extract the URLs from groundingChunks and list them on the web app.
  groundingUrls?: string[];
}

export enum Language {
  CHINESE = 'zh',
  ENGLISH = 'en'
}

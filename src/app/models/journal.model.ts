import {Tag} from './tag.model';

export interface Journal {
  id: string;
  journal_type: 'diary' | 'dream' | 'ritual' | 'divination';
  title: string;
  entry: string;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

export interface NewJournal {
  journal_type: 'diary' | 'dream' | 'ritual' | 'divination';
  title: string;
  entry: string;
  tags: string[];
}

export interface JournalStats {
  stats: {
    diary: number;
    dream: number;
    ritual: number;
    divination: number;
  }
  total: number;
}

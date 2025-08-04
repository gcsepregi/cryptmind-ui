import {Tag} from './tag.model';

export interface Journal {
  id: string;
  journal_type: 'diary' | 'dream' | 'ritual' | 'divination';
  title: string;
  entry: string;
  created_at: string;
  updated_at: string;
  tags: Tag[];

  // Common optional metadata
  mood?: string;
  location?: string;

  // Diary-specific fields
  diary_date?: string;        // The date the entry refers to (may differ from creation date)
  gratitude_list?: string[];  // List of things to be grateful for
  achievements?: string[];    // Daily achievements

  // Dream-specific fields
  dream_date?: string;        // When the dream occurred
  lucidity_level?: number;    // Scale 1-5 for how lucid the dream was
  dream_signs?: string[];     // Recurring symbols or themes
  dream_characters?: string[];// People or entities in the dream
  dream_emotions?: string[];  // Emotions experienced during the dream
  dream_clarity?: number;     // How clearly the dream is remembered (1-5)

  // Ritual-specific fields
  ritual_date?: string;       // When the ritual was performed
  ritual_type?: string;       // Type of ritual (meditation, offering, etc.)
  ritual_tools?: string[];    // Tools or items used
  ritual_deities?: string[];  // Deities or entities invoked
  ritual_purpose?: string;    // Intent or purpose of the ritual
  ritual_outcome?: string;    // Perceived results or effects
  ritual_duration?: number;   // Duration in minutes
}

export interface NewJournal {
  journal_type: 'diary' | 'dream' | 'ritual' | 'divination';
  title: string;
  entry: string;
  tags: string[];

  // Common optional metadata
  mood?: string;
  location?: string;

  // Diary-specific fields
  diary_date?: string;
  gratitude_list?: string[];
  achievements?: string[];

  // Dream-specific fields
  dream_date?: string;
  lucidity_level?: number;
  dream_signs?: string[];
  dream_characters?: string[];
  dream_emotions?: string[];
  dream_clarity?: number;

  // Ritual-specific fields
  ritual_date?: string;
  ritual_type?: string;
  ritual_tools?: string[];
  ritual_deities?: string[];
  ritual_purpose?: string;
  ritual_outcome?: string;
  ritual_duration?: number;
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

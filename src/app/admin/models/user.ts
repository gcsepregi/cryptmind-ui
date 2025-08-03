export interface User {
  id: string;
  nickname: string;
  email: string;
  sessions_count: number;
  journals_count: number;
  created_at: string;
  updated_at: string;

  [prop: string]: any;
}

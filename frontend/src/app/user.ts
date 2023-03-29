export interface User {
  intraId: string;
  name: string;
  image: string;
  score?: number;
  mfa_enabled?: boolean;
  isLogged?: boolean;
  friends?: string[];
  blocks?: string[];
}

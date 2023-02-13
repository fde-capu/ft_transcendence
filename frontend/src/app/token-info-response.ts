export interface TokenInfoResponse {
  sub: string;
  exp: number;
  mfa: {
    enabled: boolean;
    verified: boolean;
  };
}

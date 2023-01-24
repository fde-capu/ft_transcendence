export interface TokenInfoResponse {
  resource_owner_id: number;
  scopes: string[];
  expires_in_seconds: number;
  application: { uid: string };
  created_at: number;
}

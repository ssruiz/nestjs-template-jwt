export interface JWTPayload {
  ci: string;
  sub: string;
  at?: number;
  exp?: number;
}

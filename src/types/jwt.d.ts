export interface JwtPayload {
  id: number;
  email: string;
  rol: string;
  iat?: number;
  exp?: number;
}
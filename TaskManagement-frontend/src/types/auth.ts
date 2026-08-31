export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface RefreshToken {
  token: string;
  expiryDate: string;
  isRevoked: boolean;
  createdAt: string;
  ipAddress: string;
}
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  refreshTokens: RefreshToken[];
}
export interface TokenResponseDto {
  username: string;
  userId : string;
  email: string;
  role: string;
}

export interface ProjectCountDto{
  TotalProjects:number;
  ActiveProjects:number;
  TotalTasks:number;
}

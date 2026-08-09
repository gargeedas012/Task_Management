import type { ApiResponse } from '../types/api';
import type { LoginRequest, RegisterRequest, TokenResponseDto } from '../types/auth'
import api from './axios'

export const registerUser = async (data: RegisterRequest): Promise<void> => {
    await api.post("/register", data);
};
export const loginUser = async (data: LoginRequest): Promise<ApiResponse<TokenResponseDto>> => {
    const response = await api.post("/login", data);
    return response.data;
}
export const refreshToken = async (): Promise<ApiResponse<TokenResponseDto>> => {
    const response = await api.post("/refresh");
    return response.data;
}
export const getCurrentUser = async (): Promise<ApiResponse<TokenResponseDto>> => {
    const response = await api.get("/me");
    return response.data;
};
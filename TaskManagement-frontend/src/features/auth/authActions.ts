import { loginUser, logoutUser } from "../../api/authApi";
import type { AppDispatch } from "../../app/store";
import type { LoginRequest } from "../../types/auth";
import { loginFailure, loginStart, loginSuccess } from "./authSlice";

export const login = (data: LoginRequest) => async (dispatch: AppDispatch) => {
    try {
        dispatch(loginStart());
        const response = await loginUser(data);
        dispatch(
            loginSuccess(
                {
                    username: response.result.username,
                    userId:response.result.userId,
                    email: response.result.email,
                    role: response.result.role
                }
            )
        );
    } catch (err) {
        dispatch(loginFailure())
        throw err;
    }
}
export const logout = () => async (dispatch: AppDispatch) => {
    try {
        await logoutUser();
        dispatch(logout());
    } catch (err) {
        dispatch(loginFailure())
        throw err;
    }
}
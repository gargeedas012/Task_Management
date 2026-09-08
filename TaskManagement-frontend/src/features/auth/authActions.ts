import { getApiErrorMessage } from "../../api/apiError";
import { loginUser, logoutUser } from "../../api/authApi";
import type { AppDispatch } from "../../app/store";
import type { LoginRequest } from "../../types/auth";
import { loginFailure, loginStart, loginSuccess , logout1} from "./authSlice";

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
        const message = getApiErrorMessage(err);
        console.log("errorr",message);
        dispatch(loginFailure())
        throw err;
    }
}
export const logout = () => async (dispatch: AppDispatch) => {
    try {
        await logoutUser();
        dispatch(logout1());
    } catch (err) {
        dispatch(loginFailure())
        throw err;
    }
}
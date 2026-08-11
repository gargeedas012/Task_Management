import axios from "axios";

export const getApiErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.errors?.[0]?.message ||
            error.response?.data?.message ||
            "Something went wrong"
        );
    }

    return "Something went wrong";
};
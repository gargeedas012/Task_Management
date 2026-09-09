import { useEffect, useState } from "react";

import { useAppDispatch } from "../app/hooks";

import {
    loginSuccess,
    loginFailure,
} from "../features/auth/authSlice";

import {
    getCurrentUser,
    refreshToken,
} from "../api/authApi";

interface AuthInitializerProps {
    children: React.ReactNode;
}

function AuthInitializer({
    children,
}: AuthInitializerProps) {
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // First check existing access token
                const user = await getCurrentUser();

                dispatch(
                    loginSuccess({
                        username: user.result.username,
                        userId:user.result.userId,
                        email: user.result.email,
                        role: user.result.role,
                    })
                );
            } catch (error) {
                try {
                    // Access token may be expired.
                    // Try refresh token.
                    const user = await refreshToken();

                    dispatch(
                        loginSuccess({
                            username: user.result.username,
                            userId:user.result.userId,
                            email: user.result.email,
                            role: user.result.role,
                        })
                    );
                } catch (refreshError) {
                    // User is not authenticated
                    dispatch(loginFailure());
                }
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, [dispatch]);

    if (loading) {
        return <div>Checking authentication...</div>;
    }

    return <>{children}</>;
}

export default AuthInitializer;
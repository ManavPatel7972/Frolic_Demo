import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        await authService.login(credentials);
        const userData = await authService.getMe();
        setUser(userData);
        return userData;
    };

    const register = async (userData) => {
        await authService.register(userData);
        const loginCredentials = {
            EmailAddress: userData.EmailAddress,
            UserPassword: userData.UserPassword
        };
        return await login(loginCredentials);
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
        }
    };

    const checkAuthStatus = async () => {
        try {
            const userData = await authService.getMe();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

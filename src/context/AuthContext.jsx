import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const MOCK_USER = {
        id: 'demo-123',
        name: "Demo User",
        displayName: "Demo User",
        email: "demo@kiddoz.com",
        role: "admin"
    };

    // DEMO MODE: Default to MOCK_USER immediately to prevent auth blocks
    const [user, setUser] = useState(MOCK_USER);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    // Start with stored user for immediate UI
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        if (parsedUser) setUser(parsedUser);
                    } catch (e) {
                        console.error("Auth: Failed to parse user from storage", e);
                        localStorage.removeItem('user');
                    }

                    // Verify with backend
                    const userData = await api.get('/auth/me');
                    if (userData) {
                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    // For demo, don't logout on fail, just use mock if needed
                    // logout();
                }
            } else {
                // FALLBACK MOCK USER FOR DEMO ACCESS
                setUser(MOCK_USER);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user: userData } = response;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            addToast('Successfully logged in!', 'success');
            return userData;
        } catch (error) {
            console.error('Login error:', error);

            // FALLBACK FOR DEMO: If backend is unreachable, allow demo login
            const isConnectionError = !error.response && error.code === 'ERR_NETWORK' || error.message.includes('Network Error');
            const isDemoAttempt = email === 'admin@kiddoz.com' || email === 'demo@kiddoz.com' || email.includes('rahim');

            if (isConnectionError && isDemoAttempt) {
                console.log('Backend unreachable, logging in as mock user for demo');
                const demoUser = {
                    ...MOCK_USER,
                    email: email,
                    role: email.includes('admin') ? 'admin' : 'parent',
                    displayName: email.includes('admin') ? 'Demo Admin' : 'Demo Parent'
                };
                setUser(demoUser);
                localStorage.setItem('user', JSON.stringify(demoUser));
                localStorage.setItem('token', 'demo-token');
                addToast('Logged in as Demo User (Offline Mode)', 'info');
                return true;
            }

            const message = error.response?.data?.error || 'Login failed';
            addToast(message, 'error');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, user: registeredUser } = response;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(registeredUser));
            setUser(registeredUser);

            addToast('Registration successful!', 'success');
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            const message = error.response?.data?.error || 'Registration failed';
            addToast(message, 'error');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        addToast('Logged out successfully', 'info');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

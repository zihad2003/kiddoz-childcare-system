import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const MOCK_USER = {
        id: 'demo-123',
        name: "Demo User",
        displayName: "Demo User",
        email: "demo@kiddoz.com",
        role: "admin"
    };
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    // Start with stored user for immediate UI
                    setUser(JSON.parse(storedUser));

                    // Verify with backend
                    const response = await api.get('/auth/me');
                    if (response.data) {
                        setUser(response.data);
                        localStorage.setItem('user', JSON.stringify(response.data));
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
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            addToast('Successfully logged in!', 'success');
            return true;
        } catch (error) {
            console.error('Login error:', error);
            const message = error.response?.data?.error || 'Login failed';
            addToast(message, 'error');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

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

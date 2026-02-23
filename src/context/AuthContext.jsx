import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            console.log("Auth: State changed", fbUser?.uid);

            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            // 1. JWT priority: verify with backend
            if (token) {
                try {
                    const userData = await api.get('/auth/me');
                    if (userData) {
                        setUser(userData);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.warn('Auth: Backend JWT verification failed', error.message);
                    // Proactively clear stale auth data if verification fails
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }

            // 2. Handle Firebase Identity (optional fallback)
            if (fbUser) {
                try {
                    if (fbUser.isAnonymous) {
                        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
                        const data = userDoc.exists() ? userDoc.data() : {};
                        setUser({
                            id: fbUser.uid,
                            fullName: data?.fullName || "Demo Guest",
                            email: data?.email || "guest@kiddoz.com",
                            isAnonymous: true,
                            role: data?.role || "parent",
                            ...data
                        });
                    } else {
                        setUser({
                            id: fbUser.uid,
                            fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
                            email: fbUser.email,
                            role: 'parent'
                        });
                    }
                } catch (e) {
                    console.warn("Auth: Firebase supplemental data fetch failed", e.message);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
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

    const logout = async () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            await signOut(auth);
            setUser(null);
            addToast('Logged out successfully', 'info');
        } catch (e) {
            console.error("Logout error", e);
            setUser(null);
        }
    };

    const loginAsDemo = async (role = 'parent') => {
        try {
            setLoading(true);
            let demoEmail, demoPassword;

            if (role === 'superadmin') {
                demoEmail = 'superadmin@kiddoz.com';
                demoPassword = 'admin123';
            } else if (role === 'admin') {
                demoEmail = 'admin@kiddoz.com';
                demoPassword = 'admin123';
            } else {
                demoEmail = 'rahim@gmail.com'; // Use a seeded parent account
                demoPassword = 'password123';
            }

            const userData = await login(demoEmail, demoPassword);
            addToast(`Logged in as Demo ${role}!`, 'success');
            return { success: true, role: userData.role };
        } catch (error) {
            console.error('Demo Login Error:', error);
            addToast('Demo login failed. Backend may be offline.', 'error');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, loginAsDemo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

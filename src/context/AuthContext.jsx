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

            // 1. Check if we have a valid JWT first (MySQL priority)
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
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }

            // 2. Handle Firebase Identity
            if (fbUser) {
                if (fbUser.isAnonymous) {
                    // Anonymous Demo/Guest Mode
                    try {
                        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
                        if (userDoc.exists()) {
                            setUser({ id: fbUser.uid, ...userDoc.data(), isAnonymous: true });
                        } else {
                            setUser({
                                id: fbUser.uid,
                                fullName: "Demo Guest",
                                email: "guest@kiddoz.com",
                                role: "parent", // Default to parent for exploration
                                isAnonymous: true
                            });
                        }
                    } catch (e) {
                        setUser({
                            id: fbUser.uid,
                            fullName: "Demo Guest",
                            role: "parent",
                            isAnonymous: true
                        });
                    }
                } else {
                    // Regular Firebase User (if implemented)
                    setUser({
                        id: fbUser.uid,
                        fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
                        email: fbUser.email,
                        role: 'parent' // Default
                    });
                }
            } else {
                // 3. Auto-trigger Anonymous Login for the "Demo Mode" requirement
                // Only if no JWT exists
                try {
                    await signInAnonymously(auth);
                } catch (err) {
                    console.error("Auth: Failed auto-anon login", err);
                    setUser(null);
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
            const { user: firebaseUser } = await signInAnonymously(auth);
            const profile = {
                role: role,
                fullName: role === 'admin' ? 'Demo Administrator' : role === 'superadmin' ? 'Super Admin Demo' : 'Demo Parent Account',
                email: `demo-${role}@kiddoz.com`,
                createdAt: serverTimestamp(),
                isDemo: true
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), profile);
            setUser({ id: firebaseUser.uid, ...profile });
            addToast(`Logged in as Demo ${role}!`, 'success');
            return { success: true, role };
        } catch (error) {
            console.error('Demo Login Error:', error);
            addToast('Demo login failed. Please try again.', 'error');
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

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                try {
                    const docRef = doc(db, 'users', firebaseUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserRole(docSnap.data().role || 'parent');
                    } else {
                        setUserRole('parent');
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setUserRole('parent');
                }
            } else {
                setUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const loginAsDemo = async (role = 'parent') => {
        try {
            setLoading(true);
            const { user: firebaseUser } = await signInAnonymously(auth);
            const profile = {
                role: role,
                fullName: role === 'admin' ? 'Demo Administrator' : 'Demo Parent Account',
                createdAt: serverTimestamp(),
                isDemo: true
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), profile);
            setUser({ ...firebaseUser, ...profile });
            setUserRole(role);
            return { success: true, role };
        } catch (error) {
            console.error('Demo Login Error:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => signOut(auth);

    return {
        user: user ? { ...user, role: userRole } : null,
        userRole,
        loading,
        logout,
        loginAsDemo
    };
}

import {
    collection, doc, addDoc, updateDoc, deleteDoc,
    getDocs, getDoc, query, where, orderBy, onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'parents';

export const parentService = {
    async addParent(data) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION), {
                ...data,
                createdAt: serverTimestamp(),
                isActive: true,
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('addParent error:', error);
            return { success: false, error: error.message };
        }
    },

    async getParents() {
        try {
            const q = query(
                collection(db, COLLECTION),
                where('isActive', '==', true),
                orderBy('fullName', 'asc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('getParents error:', error);
            return [];
        }
    },

    async getParent(id) {
        try {
            const docSnap = await getDoc(doc(db, COLLECTION, id));
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
        } catch (error) {
            return null;
        }
    },

    async updateParent(id, data) {
        try {
            await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async deleteParent(id) {
        try {
            await updateDoc(doc(db, COLLECTION, id), { isActive: false, deletedAt: serverTimestamp() });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    subscribeToParents(callback) {
        const q = query(collection(db, COLLECTION), where('isActive', '==', true), orderBy('fullName', 'asc'));
        return onSnapshot(q, (sn) => callback(sn.docs.map(d => ({ id: d.id, ...d.data() }))));
    }
};

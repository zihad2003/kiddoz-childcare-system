import {
    collection, doc, addDoc, updateDoc,
    getDocs, getDoc, query, where, orderBy, onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'staff';

export const staffService = {
    async addStaff(data) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION), {
                ...data,
                createdAt: serverTimestamp(),
                isActive: true,
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async getStaff() {
        try {
            const q = query(collection(db, COLLECTION), where('isActive', '==', true), orderBy('fullName', 'asc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    },

    async updateStaff(id, data) {
        try {
            await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async deleteStaff(id) {
        try {
            await updateDoc(doc(db, COLLECTION, id), { isActive: false, deletedAt: serverTimestamp() });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    subscribeToStaff(callback) {
        const q = query(collection(db, COLLECTION), where('isActive', '==', true), orderBy('fullName', 'asc'));
        return onSnapshot(q, (sn) => callback(sn.docs.map(d => ({ id: d.id, ...d.data() }))));
    }
};

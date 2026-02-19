import {
    collection, doc, addDoc, updateDoc, deleteDoc,
    getDocs, query, where, orderBy, onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'notifications';

export const notificationService = {
    async addNotification(data) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION), {
                ...data,
                createdAt: serverTimestamp(),
                isRead: false
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async markAsRead(id) {
        try {
            await updateDoc(doc(db, COLLECTION, id), { isRead: true });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    subscribeToNotifications(callback) {
        const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (sn) => callback(sn.docs.map(d => ({ id: d.id, ...d.data() }))));
    }
};

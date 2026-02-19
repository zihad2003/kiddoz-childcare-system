import {
    collection, doc, addDoc, updateDoc,
    getDocs, getDoc, query, where, orderBy, onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'healthRecords';

export const healthService = {
    async logHealth(data) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION), {
                ...data,
                createdAt: serverTimestamp(),
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async getHealthRecords(studentId) {
        try {
            const q = query(
                collection(db, COLLECTION),
                where('studentId', '==', studentId),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    },

    subscribeToHealth(studentId, callback) {
        const q = query(
            collection(db, COLLECTION),
            where('studentId', '==', studentId),
            orderBy('createdAt', 'desc')
        );
        return onSnapshot(q, (sn) => callback(sn.docs.map(d => ({ id: d.id, ...d.data() }))));
    }
};

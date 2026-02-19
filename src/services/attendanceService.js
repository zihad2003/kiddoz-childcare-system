import {
    collection, doc, addDoc, updateDoc,
    getDocs, query, where, orderBy, onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'attendance';

export const attendanceService = {
    async markAttendance(data) {
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

    async getDailyAttendance(date) {
        try {
            const q = query(collection(db, COLLECTION), where('date', '==', date));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    },

    subscribeToAttendance(date, callback) {
        const q = query(collection(db, COLLECTION), where('date', '==', date), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (sn) => callback(sn.docs.map(d => ({ id: d.id, ...d.data() }))));
    }
};

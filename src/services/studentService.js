import {
    collection, doc, addDoc, updateDoc, deleteDoc,
    getDocs, getDoc, query, where, orderBy, onSnapshot,
    serverTimestamp, writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'students';

export const studentService = {
    // CREATE
    async addStudent(data) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION), {
                ...data,
                createdAt: serverTimestamp(),
                isActive: true,
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('addStudent error:', error);
            return { success: false, error: error.message };
        }
    },

    // READ ALL
    async getStudents() {
        try {
            const q = query(
                collection(db, COLLECTION),
                where('isActive', '==', true),
                orderBy('fullName', 'asc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('getStudents error:', error);
            return [];
        }
    },

    // READ ONE
    async getStudent(id) {
        try {
            const docSnap = await getDoc(doc(db, COLLECTION, id));
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
        } catch (error) {
            console.error('getStudent error:', error);
            return null;
        }
    },

    // UPDATE
    async updateStudent(id, data) {
        try {
            await updateDoc(doc(db, COLLECTION, id), {
                ...data,
                updatedAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error('updateStudent error:', error);
            return { success: false, error: error.message };
        }
    },

    // SOFT DELETE
    async deleteStudent(id) {
        try {
            await updateDoc(doc(db, COLLECTION, id), {
                isActive: false,
                deletedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('deleteStudent error:', error);
            return { success: false, error: error.message };
        }
    },

    // REAL-TIME LISTENER
    subscribeToStudents(callback) {
        const q = query(
            collection(db, COLLECTION),
            where('isActive', '==', true),
            orderBy('fullName', 'asc')
        );
        return onSnapshot(q,
            (snapshot) => callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))),
            (error) => { console.error('Stream error:', error); callback([]); }
        );
    }
};

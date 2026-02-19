import {
    collection, doc, addDoc, updateDoc,
    getDocs, query, where, orderBy, onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'payments';

export const paymentService = {
    async recordPayment(data) {
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

    async getPayments() {
        try {
            const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    },

    async getMonthlyRevenue() {
        try {
            const payments = await this.getPayments();
            const stats = {
                total: 0,
                pending: 0,
                paid: 0,
                overdue: 0,
                paidAmount: 0,
                pendingAmount: 0,
                overdueAmount: 0,
                totalCount: payments.length
            };

            payments.forEach(p => {
                const amount = parseFloat(p.amount) || 0;
                stats.total += amount;

                const status = (p.status || 'pending').toLowerCase();
                if (status === 'paid') {
                    stats.paid++;
                    stats.paidAmount += amount;
                } else if (status === 'overdue') {
                    stats.overdue++;
                    stats.overdueAmount += amount;
                } else {
                    stats.pending++;
                    stats.pendingAmount += amount;
                }
            });

            return stats;
        } catch (error) {
            console.error('getMonthlyRevenue error:', error);
            return null;
        }
    },

    async updatePayment(id, data) {
        try {
            await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    subscribeToPayments(callback) {
        const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (sn) => callback(sn.docs.map(d => ({ id: d.id, ...d.data() }))));
    }
};

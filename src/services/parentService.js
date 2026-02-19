import api from './api';

export const parentService = {
    async addParent(data) {
        try {
            const payload = { ...data };
            if (payload.fullName && !payload.name) payload.name = payload.fullName;

            const response = await api.addParent(payload);
            return { success: true, id: response.id };
        } catch (error) {
            console.error('addParent error:', error);
            return { success: false, error: error.message };
        }
    },

    async getParents() {
        try {
            return await api.getParents();
        } catch (error) {
            console.error('getParents error:', error);
            return [];
        }
    },

    async getParent(id) {
        try {
            const parents = await this.getParents();
            return parents.find(p => p.id === id) || null;
        } catch (error) {
            return null;
        }
    },

    async updateParent(id, data) {
        try {
            const payload = { ...data };
            if (payload.fullName && !payload.name) payload.name = payload.fullName;
            await api.updateParent(id, payload);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async deleteParent(id) {
        try {
            await api.deleteParent(id);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    subscribeToParents(callback) {
        this.getParents().then(callback);
        return () => { };
    }
};

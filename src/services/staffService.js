import api from './api';

export const staffService = {
    async addStaff(data) {
        try {
            const payload = { ...data };
            if (payload.fullName && !payload.name) payload.name = payload.fullName;
            const response = await api.addStaff(payload);
            return { success: true, id: response.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async getStaff() {
        try {
            return await api.getStaff();
        } catch (error) {
            console.error('getStaff error:', error);
            return [];
        }
    },

    async updateStaff(id, data) {
        try {
            const payload = { ...data };
            if (payload.fullName && !payload.name) payload.name = payload.fullName;
            await api.updateStaff(id, payload);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async deleteStaff(id) {
        try {
            await api.deleteStaff(id);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    subscribeToStaff(callback) {
        this.getStaff().then(callback);
        return () => { };
    }
};

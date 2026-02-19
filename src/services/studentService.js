import api from './api';

export const studentService = {
    // CREATE
    async addStudent(data) {
        try {
            const payload = { ...data };
            if (payload.fullName && !payload.name) payload.name = payload.fullName;
            const response = await api.addStudent(payload);
            return { success: true, id: response.id };
        } catch (error) {
            console.error('addStudent error:', error);
            return { success: false, error: error.message };
        }
    },

    // READ ALL
    async getStudents() {
        try {
            return await api.getStudents();
        } catch (error) {
            console.error('getStudents error:', error);
            return [];
        }
    },

    // READ ONE
    async getStudent(id) {
        try {
            return await api.get(id); // Assumes generic get handles it or add specific one
        } catch (error) {
            console.error('getStudent error:', error);
            return null;
        }
    },

    // UPDATE
    async updateStudent(id, data) {
        try {
            const payload = { ...data };
            if (payload.fullName && !payload.name) payload.name = payload.fullName;
            await api.updateStudent(id, payload);
            return { success: true };
        } catch (error) {
            console.error('updateStudent error:', error);
            return { success: false, error: error.message };
        }
    },

    // DELETE
    async deleteStudent(id) {
        try {
            await api.deleteStudent(id);
            return { success: true };
        } catch (error) {
            console.error('deleteStudent error:', error);
            return { success: false, error: error.message };
        }
    },

    // REAL-TIME LISTENER (Mocked for API)
    subscribeToStudents(callback) {
        // Since we don't have WebSockets in the backend yet, 
        // we'll fetch once and provide a way to refresh if needed.
        // For compatibility with components, we'll return a no-op unsubscribe.
        this.getStudents().then(callback);
        return () => { }; // No-op unsubscribe
    }
};

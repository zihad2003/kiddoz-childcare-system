import axios from 'axios';
import { BANGLADESHI_STUDENTS } from '../data/bangladeshiData';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to inject the token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle network errors for demo
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const isConnectionError = !error.response && (error.code === 'ERR_NETWORK' || error.message.includes('Network Error'));

        // If it's a connection error, return MOCK DATA to simulate a working app
        if (isConnectionError) {
            console.warn('Backend connection failed. Serving MOCK DATA for demo.');

            const url = error.config.url;

            // Mock Responses based on URL
            if (url.includes('/auth/login')) {
                const role = url.includes('admin') ? 'admin' : url.includes('superadmin') ? 'superadmin' : 'parent';
                return Promise.resolve({
                    data: {
                        token: 'mock-token',
                        user: { id: 'mock-id', email: 'mock@example.com', role: role, fullName: 'Mock User' }
                    }
                });
            }
            if (url.includes('/parent/students')) {
                return Promise.resolve({ data: BANGLADESHI_STUDENTS.slice(0, 2) });
            }
            if (url.includes('/students')) {
                return Promise.resolve({ data: BANGLADESHI_STUDENTS });
            }
            if (url.includes('/notifications')) {
                return Promise.resolve({
                    data: [
                        { id: 1, title: 'Tuition Due', message: 'Monthly fee for February is due.', type: 'admin', createdAt: (new Date()).toISOString() },
                        { id: 2, title: 'Health Update', message: 'Temperature check completed: Normal.', type: 'nurse', createdAt: (new Date()).toISOString() }
                    ]
                });
            }
            if (url.includes('/activities')) {
                return Promise.resolve({
                    data: [
                        { id: 1, activityType: 'meal', details: 'Healthy Lunch', value: 'Finished', timestamp: new Date(), recordedBy: 'Staff' },
                        { id: 2, activityType: 'nap', details: 'Afternoon Nap', value: '1h 30m', timestamp: new Date(), recordedBy: 'Staff' },
                        { id: 3, activityType: 'mood', details: 'Playtime', value: 'Happy', timestamp: new Date(), recordedBy: 'Staff' }
                    ]
                });
            }
            if (url.includes('/health')) {
                return Promise.resolve({ data: [] });
            }
            if (url.includes('/staff')) {
                return Promise.resolve({
                    data: [
                        { id: 1, name: 'Fatima Begum', role: 'Nanny', area: 'Dhaka', rate: 15, rating: 4.8, experience: '5 Years', availability: 'Available', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
                        { id: 2, name: 'Rohima Khatun', role: 'Nanny', area: 'Uttara', rate: 12, rating: 4.5, experience: '3 Years', availability: 'Busy', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' }
                    ]
                });
            }
            if (url.includes('/billing')) {
                return Promise.resolve({
                    data: {
                        invoices: [
                            { id: 'INV-001', month: 'January', amount: 5000, status: 'Paid', date: new Date().toISOString() },
                            { id: 'INV-002', month: 'February', amount: 5000, status: 'Unpaid', date: new Date().toISOString() }
                        ]
                    }
                });
            }

            if (url.includes('/incidents')) {
                return Promise.resolve({
                    data: [
                        { id: 'mock-1', studentId: 'mock-s1', type: 'Injury', severity: 'Low', description: 'Minor scrape during playtime', location: 'Playground', actionTaken: 'Cleaned and bandaged', reportedBy: 'teacher@kiddoz.com', status: 'Resolved', student: { name: 'Aryan Rahman' }, createdAt: new Date().toISOString() },
                    ]
                });
            }

            // Default empty array for list endpoints, empty object for others
            return Promise.resolve({ data: [] });
        }

        return Promise.reject(error);
    }
);

// Define API Service Object
const api = {
    // Expose generic Axios methods
    get: (url, config) => apiClient.get(url, config).then(res => res.data),
    post: (url, data, config) => apiClient.post(url, data, config).then(res => res.data),
    put: (url, data, config) => apiClient.put(url, data, config).then(res => res.data),
    delete: (url, config) => apiClient.delete(url, config).then(res => res.data),

    // Auth Methods
    login: (email, password) => apiClient.post('/auth/login', { email, password }),
    register: (data) => apiClient.post('/auth/register', data),

    // Domain Methods
    getStaff: () => apiClient.get('/staff').then(res => res.data),
    addStaff: (data) => apiClient.post('/staff', data).then(res => res.data),
    updateStaff: (id, data) => apiClient.put(`/staff/${id}`, data).then(res => res.data),
    deleteStaff: (id) => apiClient.delete(`/staff/${id}`).then(res => res.data),

    getStudents: (parentId) => apiClient.get(`/students${parentId ? '?parentId=' + parentId : ''}`).then(res => res.data),
    addStudent: (data) => apiClient.post('/students', data).then(res => res.data),
    updateStudent: (id, data) => apiClient.put(`/students/${id}`, data).then(res => res.data),
    deleteStudent: (id) => apiClient.delete(`/students/${id}`).then(res => res.data),
    addMilestone: (id, data) => apiClient.post(`/students/${id}/milestones`, data).then(res => res.data),
    addHealthRecord: (studentId, data) => apiClient.post(`/students/${studentId}/health`, data).then(res => res.data),

    getTasks: () => apiClient.get('/tasks').then(res => res.data),
    addTask: (data) => apiClient.post('/tasks', data).then(res => res.data),
    updateTask: (id, data) => apiClient.patch(`/tasks/${id}`, data).then(res => res.data),
    deleteTask: (id) => apiClient.delete(`/tasks/${id}`).then(res => res.data),

    getPayroll: () => apiClient.get('/financials/payroll').then(res => res.data),
    addPayroll: (data) => apiClient.post('/financials/payroll', data).then(res => res.data),
    markPaid: (id) => apiClient.patch(`/financials/payroll/${id}`).then(res => res.data),
    getRevenue: () => apiClient.get('/financials/revenue').then(res => res.data),

    getNotifications: () => apiClient.get('/notifications').then(res => res.data),
    addNotification: (data) => apiClient.post('/notifications', data).then(res => res.data),

    // Incidents
    getIncidents: () => apiClient.get('/incidents').then(res => res.data),
    addIncident: (data) => apiClient.post('/incidents', data).then(res => res.data),
    updateIncident: (id, data) => apiClient.patch(`/incidents/${id}`, data).then(res => res.data),

    getCareTasks: (filters) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiClient.get(`/care-tasks?${queryParams}`).then(res => res.data);
    },
    addCareTask: (data) => apiClient.post('/care-tasks', data).then(res => res.data),
    updateCareTask: (id, data) => apiClient.patch(`/care-tasks/${id}`, data).then(res => res.data),
    generateCareTasks: (studentId) => apiClient.post('/care-tasks/generate', { studentId }).then(res => res.data),

    // Parent Portal Methods
    getParentStudents: () => apiClient.get('/parent/students').then(res => res.data),
    getStudentActivities: (studentId) => apiClient.get(`/parent/students/${studentId}/activities`).then(res => res.data),
    getStudentHealthRecords: (studentId) => apiClient.get(`/parent/students/${studentId}/health`).then(res => res.data),
    getParentBilling: () => apiClient.get('/parent/billing').then(res => res.data),
    createNannyBooking: (data) => apiClient.post('/parent/nanny-booking', data).then(res => res.data),
    getParentBookings: () => apiClient.get('/parent/nanny-booking').then(res => res.data),
    getParentNotifications: () => apiClient.get('/parent/notifications').then(res => res.data),

    // Settings Methods
    getSettings: () => apiClient.get('/settings').then(res => res.data),
    updateSettings: (data) => apiClient.put('/settings', data).then(res => res.data),
    exportData: (type) => {
        // Trigger download
        const url = `${apiClient.defaults.baseURL}/students?export=${type}`;
        window.open(url, '_blank');
        return Promise.resolve();
    },

    // Super Admin Methods
    getSuperAdminOverview: () => apiClient.get('/superadmin/overview').then(res => res.data),
    getAnalyticsRevenue: () => apiClient.get('/superadmin/analytics/revenue').then(res => res.data),
    getAnalyticsUsers: () => apiClient.get('/superadmin/analytics/users').then(res => res.data),

    getAllUsers: (params) => apiClient.get('/superadmin/users', { params }).then(res => res.data),
    addUser: (data) => apiClient.post('/superadmin/users', data).then(res => res.data),
    updateUser: (id, data) => apiClient.put(`/superadmin/users/${id}`, data).then(res => res.data),
    deleteUser: (id) => apiClient.delete(`/superadmin/users/${id}`).then(res => res.data),

    getCenters: () => apiClient.get('/superadmin/centers').then(res => res.data),
    addCenter: (data) => apiClient.post('/superadmin/centers', data).then(res => res.data),
    updateCenter: (id, data) => apiClient.put(`/superadmin/centers/${id}`, data).then(res => res.data),
    deleteCenter: (id) => apiClient.delete(`/superadmin/centers/${id}`).then(res => res.data),
    getCenterDetails: (id) => apiClient.get(`/superadmin/centers/${id}/details`).then(res => res.data),

    getApiKeys: () => apiClient.get('/superadmin/developer/api-keys').then(res => res.data),
    createApiKey: (data) => apiClient.post('/superadmin/developer/api-keys', data).then(res => res.data),
    revokeApiKey: (id) => apiClient.delete(`/superadmin/developer/api-keys/${id}`).then(res => res.data),

    getWebhooks: () => apiClient.get('/superadmin/developer/webhooks').then(res => res.data),

    getAppVersions: () => apiClient.get('/superadmin/app/versions').then(res => res.data),
    createAppVersion: (data) => apiClient.post('/superadmin/app/versions', data).then(res => res.data),

    getAuditLogs: () => apiClient.get('/superadmin/security/audit-logs').then(res => res.data),
    getCompliance: () => apiClient.get('/superadmin/security/compliance').then(res => res.data),

    getFeedback: () => apiClient.get('/superadmin/feedback').then(res => res.data),
    respondFeedback: (id, response) => apiClient.put(`/superadmin/feedback/${id}/respond`, { response }).then(res => res.data),

    getStaffAll: () => apiClient.get('/superadmin/staff/all').then(res => res.data),

    getRecentActivity: () => apiClient.get('/superadmin/security/audit-logs?limit=5').then(res => res.data),
    getFinancialOverview: () => apiClient.get('/superadmin/financials/overview').then(res => res.data),
};

export default api;

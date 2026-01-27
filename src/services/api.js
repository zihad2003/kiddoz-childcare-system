import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5001/api',
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

// Define API Service Object
const api = {
    // Expose generic Axios methods
    get: (url, config) => apiClient.get(url, config),
    post: (url, data, config) => apiClient.post(url, data, config),
    put: (url, data, config) => apiClient.put(url, data, config),
    delete: (url, config) => apiClient.delete(url, config),

    // Auth Methods
    login: (email, password) => apiClient.post('/auth/login', { email, password }),
    register: (data) => apiClient.post('/auth/register', data),

    // Domain Methods
    // Domain Methods
    getStaff: () => apiClient.get('/staff').then(res => res.data),
    addStaff: (data) => apiClient.post('/staff', data).then(res => res.data),
    updateStaff: (id, data) => apiClient.put(`/staff/${id}`, data).then(res => res.data),
    deleteStaff: (id) => apiClient.delete(`/staff/${id}`).then(res => res.data),

    getStudents: (parentId) => apiClient.get(`/students${parentId ? '?parentId=' + parentId : ''}`).then(res => res.data),
    addStudent: (data) => apiClient.post('/students', data).then(res => res.data),
    updateStudent: (id, data) => apiClient.put(`/students/${id}`, data).then(res => res.data),

    getTasks: () => apiClient.get('/tasks').then(res => res.data),
    addTask: (data) => apiClient.post('/tasks', data).then(res => res.data),
    updateTask: (id, data) => apiClient.patch(`/tasks/${id}`, data).then(res => res.data),
    deleteTask: (id) => apiClient.delete(`/tasks/${id}`).then(res => res.data),

    getPayroll: () => apiClient.get('/financials/payroll').then(res => res.data),
    addPayroll: (data) => apiClient.post('/financials/payroll', data).then(res => res.data),
    markPaid: (id) => apiClient.patch(`/financials/payroll/${id}`).then(res => res.data),

    getNotifications: () => apiClient.get('/notifications').then(res => res.data),
    addNotification: (data) => apiClient.post('/notifications', data).then(res => res.data),

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

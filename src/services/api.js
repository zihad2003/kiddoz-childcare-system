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
};

export default api;

import axios from 'axios';
import { BANGLADESHI_STUDENTS } from '../data/bangladeshiData';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
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
        const isServerError = error.response && error.response.status >= 500;
        const isProduction = import.meta.env.PROD || window.location.hostname.includes('pages.dev') || window.location.hostname.includes('firebaseapp.com');

        // If it's a connection error OR a server error in production, return MOCK DATA to keep the UI alive
        if (isConnectionError || (isServerError && isProduction)) {
            console.warn(`Backend error (${error.response?.status || 'Network'}). Serving MOCK DATA for demo stability.`);

            const url = error.config?.url?.toLowerCase() || '';
            let requestData = {};
            try {
                if (error.config?.data) {
                    requestData = typeof error.config.data === 'string' ? JSON.parse(error.config.data) : error.config.data;
                }
            } catch (e) {
                console.warn('Failed to parse request data for mock', e);
            }

            // ─── AUTH MOCK ──────────────────────────────────────────────────
            if (url.includes('/auth/login')) {
                const email = requestData.email?.toLowerCase() || '';
                let role = 'parent';
                if (email.includes('super')) role = 'superadmin';
                else if (email.includes('admin')) role = 'admin';

                console.log(`[Mock Auth] Logging in as ${role} for email: ${email}`);

                return Promise.resolve({
                    data: {
                        token: 'mock-token',
                        user: {
                            id: 'mock-id',
                            email: email || 'parent@kiddoz.com',
                            role: role,
                            fullName: role.charAt(0).toUpperCase() + role.slice(1) + ' User'
                        }
                    }
                });
            }

            if (url.includes('/auth/me')) {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) return Promise.resolve({ data: null });
                try {
                    return Promise.resolve({ data: JSON.parse(storedUser) });
                } catch (e) {
                    return Promise.resolve({ data: null });
                }
            }

            // ─── DATA MOCK ──────────────────────────────────────────────────
            if (url.includes('/parent/students') || url.includes('/students')) {
                return Promise.resolve({ data: BANGLADESHI_STUDENTS });
            }

            if (url.includes('/notifications')) {
                return Promise.resolve({
                    data: [
                        { id: 1, title: 'Welcome to KiddoZ', message: 'Thank you for choosing us for your child\'s care.', type: 'admin', createdAt: new Date().toISOString() },
                        { id: 2, title: 'Health Update', message: 'Routine temperature checks completed.', type: 'nurse', createdAt: new Date().toISOString() }
                    ]
                });
            }

            if (url.includes('/activities')) {
                return Promise.resolve({
                    data: [
                        { id: 1, activityType: 'meal', details: 'Healthy Lunch', value: 'Full Portion', timestamp: new Date(), recordedBy: 'Staff' },
                        { id: 2, activityType: 'nap', details: 'Midday Rest', value: '1h 45m', timestamp: new Date(), recordedBy: 'Staff' },
                        { id: 3, activityType: 'mood', details: 'Group Activity', value: 'Excited', timestamp: new Date(), recordedBy: 'Staff' }
                    ]
                });
            }

            if (url.includes('/staff')) {
                return Promise.resolve({
                    data: [
                        { id: 1, name: 'Fatima Begum', role: 'Senior Nanny', area: 'Dhaka', rate: 15, rating: 4.8, experience: '5 Years', availability: 'Available', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
                        { id: 2, name: 'Rohima Khatun', role: 'Toddler Teacher', area: 'Uttara', rate: 12, rating: 4.5, experience: '3 Years', availability: 'Available', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
                        { id: 3, name: 'Zayed Khan', role: 'Music Instructor', area: 'Gulshan', rate: 20, rating: 4.9, experience: '7 Years', availability: 'Available', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }
                    ]
                });
            }

            // ─── FINANCIALS MOCK ─────────────────────────────────────────────
            if (url.includes('/financials/payroll')) {
                return Promise.resolve({
                    data: [
                        { id: 1, name: 'Fatima Begum', role: 'Nanny', amount: 15000, status: 'Paid', type: 'Salary', date: '2026-01-20' },
                        { id: 2, name: 'Rohima Khatun', role: 'Teacher', amount: 18000, status: 'Pending', type: 'Salary', date: '2026-02-15' },
                        { id: 3, name: 'CleanCo Inc.', role: 'Vendor', amount: 5000, status: 'Pending', type: 'Maintenance', date: '2026-02-18' }
                    ]
                });
            }

            if (url.includes('/financials/revenue')) {
                return Promise.resolve({
                    data: {
                        total: 450000,
                        count: 44,
                        byPlan: {
                            'Little Explorer': 120000,
                            'Growth Scholar': 180000,
                            'VIP Guardian': 150000
                        }
                    }
                });
            }

            if (url.includes('/financials/overview') || url.includes('/superadmin/financials/overview')) {
                return Promise.resolve({
                    data: {
                        summary: {
                            totalRevenue: 1250000,
                            totalExpenses: 840000,
                            netProfit: 410000,
                            outstandingInvoices: 12
                        },
                        revenueByPlan: [
                            { plan: 'Growth Scholar', total: 450000 },
                            { plan: 'Little Explorer', total: 320000 },
                            { plan: 'VIP Guardian', total: 480000 }
                        ],
                        monthlyRevenue: [
                            { month: 'Sep', revenue: 850000, expenses: 620000 },
                            { month: 'Oct', revenue: 920000, expenses: 650000 },
                            { month: 'Nov', revenue: 980000, expenses: 680000 },
                            { month: 'Dec', revenue: 1100000, expenses: 720000 },
                            { month: 'Jan', revenue: 1150000, expenses: 780000 },
                            { month: 'Feb', revenue: 1250000, expenses: 840000 }
                        ]
                    }
                });
            }

            if (url.includes('/billing')) {
                return Promise.resolve({
                    data: {
                        invoices: [
                            { id: 'INV-001', month: 'January', amount: 15000, status: 'Paid', date: new Date().toISOString() },
                            { id: 'INV-002', month: 'February', amount: 15000, status: 'Unpaid', date: new Date().toISOString() }
                        ],
                        totalRevenue: 450000,
                        monthlyTarget: 500000
                    }
                });
            }

            // ─── SUPER ADMIN MOCK ───────────────────────────────────────────
            if (url.includes('/superadmin/overview')) {
                return Promise.resolve({
                    data: {
                        totalUsers: 156,
                        activeCenters: 8,
                        totalStudents: 342,
                        revenue: 1250000
                    }
                });
            }

            if (url.includes('/superadmin/analytics/revenue')) {
                return Promise.resolve({
                    data: {
                        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
                        data: [850000, 920000, 980000, 1100000, 1150000, 1250000]
                    }
                });
            }

            if (url.includes('/superadmin/analytics/users')) {
                return Promise.resolve({
                    data: {
                        total: 156,
                        byRole: [
                            { role: 'parent', count: 98 },
                            { role: 'staff', count: 42 },
                            { role: 'admin', count: 12 },
                            { role: 'superadmin', count: 4 }
                        ]
                    }
                });
            }

            if (url.includes('/superadmin/users')) {
                return Promise.resolve({
                    data: [
                        { id: 'u1', fullName: 'Zihad Hussain', email: 'zihad@kiddoz.com', role: 'superadmin', status: 'active', phone: '+8801712345678' },
                        { id: 'u2', fullName: 'Karim Ahmed', email: 'karim@center.com', role: 'admin', status: 'active', phone: '+8801812345678' },
                        { id: 'u3', fullName: 'Fatima Begum', email: 'fatima@nanny.com', role: 'nanny', status: 'active', phone: '+8801912345678' },
                        { id: 'u4', fullName: 'Rahima Khatun', email: 'rahima@parent.com', role: 'parent', status: 'active', phone: '+8801612345678' }
                    ]
                });
            }

            if (url.includes('/superadmin/bulletins')) {
                return Promise.resolve({
                    data: [
                        { id: 1, title: 'Annual Healthcare Symposium', content: 'Join us for a discussion on pediatric wellness and new safety protocols.', category: 'Event', priority: 'High', createdAt: new Date().toISOString() },
                        { id: 2, title: 'Server Upgrade Scheduled', content: 'The platform will undergo maintenance this Sunday at 2:00 AM BDT.', category: 'Maintenance', priority: 'Medium', createdAt: new Date().toISOString() },
                        { id: 3, title: 'New Vaccination Policy', content: 'Please review the updated requirements for the upcoming academic session.', category: 'Policy', priority: 'Critical', createdAt: new Date().toISOString() }
                    ]
                });
            }

            if (url.includes('/superadmin/centers')) {
                return Promise.resolve({
                    data: [
                        { id: 'c1', name: 'KiddoZ Gulshan Branch', address: 'Gulshan, Dhaka', status: 'active', capacity: 120, current: 104 },
                        { id: 'c2', name: 'KiddoZ Uttara Node', address: 'Uttara, Dhaka', status: 'active', capacity: 80, current: 72 },
                        { id: 'c3', name: 'KiddoZ Dhanmondi Hub', address: 'Dhanmondi, Dhaka', status: 'active', capacity: 100, current: 85 }
                    ]
                });
            }

            if (url.includes('/superadmin/developer/api-keys')) {
                return Promise.resolve({
                    data: [
                        { id: 'ak1', name: 'Main Website Production', key: 'kz_live_8f7h2s90j1l', createdAt: new Date().toISOString(), status: 'active' },
                        { id: 'ak2', name: 'Mobile App Test', key: 'kz_test_1m9n4v5k2p3', createdAt: new Date().toISOString(), status: 'active' }
                    ]
                });
            }

            if (url.includes('/superadmin/developer/webhooks')) {
                return Promise.resolve({
                    data: [
                        { id: 'wh1', url: 'https://api.crm-partner.com/webhooks/kiddoz', events: ['enrollment.created', 'payment.success'], status: 'active' }
                    ]
                });
            }

            // ─── OTHER MOCKS ───────────────────────────────────────────────
            if (url.includes('/incidents')) {
                return Promise.resolve({
                    data: [
                        { id: 'mock-1', studentId: 'mock-s1', type: 'Scrape', severity: 'Low', description: 'Minor scrape during playground time', location: 'Playground', actionTaken: 'First aid applied', reportedBy: 'teacher@kiddoz.com', status: 'Resolved', student: { name: 'Aryan Rahman' }, createdAt: new Date().toISOString() },
                    ]
                });
            }

            if (url.includes('/superadmin/settings')) {
                return Promise.resolve({
                    data: [
                        { settingKey: 'systemName', settingValue: JSON.stringify('KiddoZ Platform') },
                        { settingKey: 'supportEmail', settingValue: JSON.stringify('support@kiddoz.com') },
                        { settingKey: 'maintenanceMode', settingValue: JSON.stringify(false) },
                        { settingKey: 'allowRegistration', settingValue: JSON.stringify(true) },
                        { settingKey: 'emailNotifications', settingValue: JSON.stringify(true) },
                        { settingKey: 'maxUploadSize', settingValue: JSON.stringify('10') },
                        { settingKey: 'yolo.liveStream', settingValue: JSON.stringify({ active: true, type: 'demo' }) }
                    ]
                });
            }

            if (url.includes('/settings')) {
                return Promise.resolve({
                    data: {
                        centerName: 'KiddoZ Childcare Dhaka',
                        contactEmail: 'contact@kiddoz.com',
                        phone: '+880-1234-5678',
                        address: 'Dhaka, Bangladesh',
                        currency: 'BDT',
                        taxRate: 5
                    }
                });
            }

            // Default fallback for any other endpoint
            return Promise.resolve({ data: null });
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

    // AI/YOLO Methods
    aiChat: (data) => apiClient.post('/ai/chat', data).then(res => res.data),
    getDemoVideo: () => apiClient.get('/ai/demo-video').then(res => res.data),
    uploadDemoVideo: (formData) => apiClient.post('/ai/demo-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),

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

    // Parent Management (Admin)
    getParents: (params) => apiClient.get('/parents', { params }).then(res => res.data),
    addParent: (data) => apiClient.post('/parents', data).then(res => res.data),
    updateParent: (id, data) => apiClient.put(`/parents/${id}`, data).then(res => res.data),
    deleteParent: (id) => apiClient.delete(`/parents/${id}`).then(res => res.data),

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

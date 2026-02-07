const axios = require('axios');

async function testLogin() {
    try {
        const response = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'admin@kiddoz.com',
            password: 'admin123'
        });
        console.log('Login Success:', response.data);
    } catch (error) {
        console.error('Login Failed:', error.response ? {
            status: error.response.status,
            data: error.response.data
        } : error.message);
    }
}

testLogin();

const request = require('supertest');
const app = require('../../server');

describe('Health & Ready Check Endpoints', () => {
    it('GET /health should return 200 UP', async () => {
        const res = await request(app).get('/health');
        if (res.statusCode !== 200) console.log('Health Check Failed:', res.statusCode, res.body, res.text);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('UP');
    });

    it('GET /ready should return 200 READY', async () => {
        const res = await request(app).get('/ready');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('READY');
        expect(res.body.database).toBe('connected');
    });
});

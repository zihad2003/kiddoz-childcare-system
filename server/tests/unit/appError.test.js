const AppError = require('../../utils/AppError');

describe('AppError Utility', () => {
    it('should create an error with the correct message and statusCode', () => {
        const message = 'Test Error Message';
        const statusCode = 400;
        const err = new AppError(message, statusCode);

        expect(err.message).toBe(message);
        expect(err.statusCode).toBe(statusCode);
        expect(err.status).toBe('fail');
        expect(err.isOperational).toBe(true);
    });

    it('should set status to "error" for 500 status code', () => {
        const err = new AppError('Server Error', 500);
        expect(err.status).toBe('error');
    });

    it('should capture stack trace', () => {
        const err = new AppError('Stack Trace', 500);
        expect(err.stack).toBeDefined();
    });
});

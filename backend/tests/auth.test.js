"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../src/routes/auth"));
jest.mock('../src/db', () => ({
    db: {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnValue([]),
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnValue([{ id: 1, email: 'test@test.com' }])
    }
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
describe('Auth Endpoints', () => {
    it('should return 400 when missing required fields in /register', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/auth/register')
            .send({ email: 'test@test.com' }); // Missing password
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body).toHaveProperty('details');
    });
    it('should return 400 when password is too short in /register', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/auth/register')
            .send({ name: 'Test', email: 'test@test.com', password: '123' }); // short password
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body).toHaveProperty('details');
    });
});

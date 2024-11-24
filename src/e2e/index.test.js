"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const createApp_1 = require("../createApp");
describe("/api/users", () => {
    let app;
    beforeAll(() => {
        app = (0, createApp_1.createApp)();
    });
    it("should return an empty array when getting /api/users", async () => {
        const response = await (0, supertest_1.default)(app).get("/api/users");
        expect(response.body).toStrictEqual([]);
    });
});

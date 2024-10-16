"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MONGO_URL = process.env.NODE_ENV === 'dev'
            ? process.env.MONGO_URL_DEV
            : process.env.MONGO_URL_PRO;
        if (!MONGO_URL) {
            throw new Error('MONGO_URL is not defined in environment variables.');
        }
        yield mongoose_1.default.connect(`${MONGO_URL}/VoyaGo-User`);
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
});
exports.default = connectDB;

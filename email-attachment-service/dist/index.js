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
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const emailService_1 = require("./emailService");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.post('/getDocuments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Chama a função sem passar credenciais, usando as credenciais padrão
        const attachments = yield (0, emailService_1.getXmlAttachments)();
        // Save to MongoDB
        const client = new mongodb_1.MongoClient('mongodb://localhost:27017');
        yield client.connect();
        const db = client.db('emailService');
        const collection = db.collection('attachments');
        yield collection.insertMany(attachments);
        yield client.close();
        res.json(attachments);
    }
    catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

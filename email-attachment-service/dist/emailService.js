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
exports.getXmlAttachments = getXmlAttachments;
const imap_1 = __importDefault(require("imap"));
const xml2js_1 = require("xml2js");
// Definição das credenciais diretamente no código
const EMAIL_CREDENTIALS = {
    user: 'carregamento@tcsmg.info',
    password: 'CaRG@Tcs2024@#',
    host: 'imap.hostinger.com',
    port: 993,
};
function getXmlAttachments() {
    return __awaiter(this, arguments, void 0, function* (credentials = EMAIL_CREDENTIALS) {
        const imap = new imap_1.default({
            user: credentials.user,
            password: credentials.password,
            host: credentials.host,
            port: credentials.port,
            tls: true, // Usando TLS para segurança
        });
        const openInbox = (callback) => {
            imap.openBox('INBOX', false, callback);
        };
        const fetchEmails = () => {
            return new Promise((resolve, reject) => {
                imap.search(['UNSEEN'], (err, results) => {
                    if (err)
                        return reject(err);
                    const fetch = imap.fetch(results, { bodies: [''] });
                    const attachments = [];
                    fetch.on('message', (msg) => {
                        msg.on('body', (stream) => {
                            let body = '';
                            stream.on('data', (chunk) => (body += chunk.toString('utf8')));
                            stream.on('end', () => __awaiter(this, void 0, void 0, function* () {
                                try {
                                    const parsed = yield (0, xml2js_1.parseStringPromise)(body);
                                    // Ajuste a condição com base na estrutura do seu XML
                                    if (parsed['YOUR_XML_ELEMENT'] && parsed['YOUR_XML_ELEMENT']['filename'][0].endsWith('.xml')) {
                                        attachments.push({
                                            filename: parsed['YOUR_XML_ELEMENT']['filename'][0],
                                            content: body,
                                        });
                                    }
                                }
                                catch (parseError) {
                                    console.error('Error parsing XML:', parseError);
                                }
                            }));
                        });
                    });
                    fetch.on('end', () => {
                        imap.end();
                        resolve(attachments);
                    });
                    fetch.on('error', (err) => {
                        reject(err);
                    });
                });
            });
        };
        return new Promise((resolve, reject) => {
            imap.once('ready', () => {
                openInbox((err, box) => {
                    if (err)
                        return reject(err);
                    fetchEmails()
                        .then(resolve)
                        .catch(reject);
                });
            });
            imap.once('error', (err) => {
                reject(err);
            });
            imap.connect();
        });
    });
}

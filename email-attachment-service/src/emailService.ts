import Imap from 'imap';
import { parseStringPromise } from 'xml2js';

// Definição das credenciais diretamente no código
const EMAIL_CREDENTIALS = {
  user: 'carregamento@tcsmg.info',
  password: 'CaRG@Tcs2024@#',
  host: 'imap.hostinger.com',
  port: 993,
};

interface EmailCredentials {
  user: string;
  password: string;
  host: string;
  port: number;
}

export async function getXmlAttachments(credentials: EmailCredentials = EMAIL_CREDENTIALS): Promise<any[]> {
  const imap = new Imap({
    user: credentials.user,
    password: credentials.password,
    host: credentials.host,
    port: credentials.port,
    tls: true, // Usando TLS para segurança
  });

  const openInbox = (callback: (error: any, box: any) => void) => {
    imap.openBox('INBOX', false, callback);
  };

  const fetchEmails = (): Promise<any[]> => {
    return new Promise<any[]>((resolve, reject) => {
      imap.search(['UNSEEN'], (err: any, results: any[]) => {
        if (err) return reject(err);

        const fetch = imap.fetch(results, { bodies: [''] });
        const attachments: any[] = [];

        fetch.on('message', (msg: any) => {
          msg.on('body', (stream: any) => {
            let body = '';
            stream.on('data', (chunk: Buffer) => (body += chunk.toString('utf8')));
            stream.on('end', async () => {
              try {
                const parsed = await parseStringPromise(body);
                // Ajuste a condição com base na estrutura do seu XML
                if (parsed['YOUR_XML_ELEMENT'] && parsed['YOUR_XML_ELEMENT']['filename'][0].endsWith('.xml')) {
                  attachments.push({
                    filename: parsed['YOUR_XML_ELEMENT']['filename'][0],
                    content: body,
                  });
                }
              } catch (parseError) {
                console.error('Error parsing XML:', parseError);
              }
            });
          });
        });

        fetch.on('end', () => {
          imap.end();
          resolve(attachments);
        });

        fetch.on('error', (err: any) => {
          reject(err);
        });
      });
    });
  };

  return new Promise<any[]>((resolve, reject) => {
    imap.once('ready', () => {
      openInbox((err: any, box: any) => {
        if (err) return reject(err);
        fetchEmails()
          .then(resolve)
          .catch(reject);
      });
    });

    imap.once('error', (err: any) => {
      reject(err);
    });

    imap.connect();
  });
}

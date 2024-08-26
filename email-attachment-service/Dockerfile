FROM node:18

#Cria um diretório de trabalho
WORKDIR /usr/src/app

#Copie os arquivos de package.json e package-lock.json
COPY package*.json ./

#Instala as dependências
RUN npm install

#Copia o código-fonte
COPY . .

#Compila o TypeScript
RUN npm run build

#porta que o servidor Express irá usar
EXPOSE 3000

#Comando para iniciar o servidor
CMD ["npm", "start"]



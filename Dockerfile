FROM node:18-alpine

# Define o diretório do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm ci --only=production && npm cache clean --force

# Copia o código fonte
COPY . .

# Cria o arquivo db.json a partir do template se não existir
RUN if [ ! -f db.json ]; then cp db.json.template db.json; fi

# Instala o concurrently globalmente para rodar múltiplos comandos
RUN npm install -g concurrently

# Expõe as portas
# 3000 para o dev server
# 3001 para o json-server
EXPOSE 3000 3001

# Comando para rodar tanto o json-server quanto o Next.js dev server
CMD ["npx", "concurrently", "--kill-others", "--prefix", "name", "--names", "API,APP", "--prefix-colors", "yellow,cyan", "\"npm run server\"", "\"npm run dev\""]

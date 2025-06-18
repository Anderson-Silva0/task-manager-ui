FROM node:18-alpine

WORKDIR /app

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar arquivos de configuração
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 4200

# Comando para iniciar o servidor Angular com configuração Docker
CMD ["npm", "start", "--", "--configuration=docker", "--host", "0.0.0.0", "--disable-host-check"] 
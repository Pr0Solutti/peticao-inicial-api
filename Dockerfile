# Step 1: Base image
FROM node:18-slim

# Step 2: Instalar dependências do Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    wget \
    libu2f-udev \
    libvulkan1 \
    libxss1 \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Step 3: Definir variável de ambiente com caminho do Chromium
ENV CHROMIUM_PATH=/usr/bin/chromium

# Step 4: Diretório de trabalho
WORKDIR /usr/src/app

# Step 5: Copiar dependências e instalar
COPY package*.json ./
RUN npm install

# Step 6: Copiar o restante do código
COPY . .

# Step 7: Build (transpilar TypeScript)
RUN npm run build

# Step 8: Expor a porta padrão do NestJS
EXPOSE 8080

# Step 9: Rodar a aplicação
CMD ["node", "dist/main"]

FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    ca-certificates \
    fonts-liberation \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    HEADLESS=true

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY index.js config.json ./

CMD ["node", "index.js"]

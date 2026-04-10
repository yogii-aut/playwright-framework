FROM mcr.microsoft.com/playwright:v1.54.2-noble

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npx playwright install --with-deps

CMD ["npx", "playwright", "test"]


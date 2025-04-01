FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /app
COPY . .
RUN npm install
EXPOSE 10000
CMD ["node", "index.js"]

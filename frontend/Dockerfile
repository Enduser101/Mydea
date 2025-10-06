FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-fund --no-audit
COPY . .
RUN npm run build
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
CMD ["serve", "-s", "dist", "-l", "3000"]

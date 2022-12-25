FROM node:14.19.1-alpine3.14
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm ci
CMD ["npm", "run", "start"]
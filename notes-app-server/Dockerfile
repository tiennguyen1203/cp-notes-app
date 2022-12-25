FROM node:14.19.1-alpine3.14 AS prepare-stage
WORKDIR /usr/src/app
ADD package*.json ./
RUN npm ci
ADD . .
RUN npm run build

FROM node:14.19.1-alpine3.14 AS development
WORKDIR /usr/src/app
ADD package*.json ./
COPY --from=prepare-stage /usr/src/app/node_modules/ ./node_modules/
COPY --from=prepare-stage /usr/src/app/dist ./dist
EXPOSE 3001
CMD ["npm", "run", "start:dev"]
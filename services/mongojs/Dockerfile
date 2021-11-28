FROM node:12.18.1
ENV NODE_ENV=production

COPY . .

RUN npm install --production

WORKDIR /app

EXPOSE 4567

CMD [ "node", "main.js" ]
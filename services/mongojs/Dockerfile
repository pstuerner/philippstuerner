FROM node:12.18.1
ENV NODE_ENV=production

WORKDIR .
COPY package-lock.json .
COPY package.json .
RUN npm install --production

COPY . .

EXPOSE 8002

CMD [ "node", "server.js" ]

FROM node:12.18.1
ENV NODE_ENV=production

COPY . .

RUN npm install --production

WORKDIR .

EXPOSE 8002

CMD [ "node", "server.js" ]

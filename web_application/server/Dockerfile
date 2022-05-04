FROM node:lts-slim

COPY . /opt/api
RUN cd /opt/api && npm install

WORKDIR /opt/api

CMD [ "npm", "run", "start" ]
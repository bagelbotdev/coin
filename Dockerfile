FROM node:6
WORKDIR /app

COPY ./package.json /app/package.json
RUN npm install

COPY . /app

CMD ["node", "bin/naivecoin.js", "-p", "80"]
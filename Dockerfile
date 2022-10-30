FROM node:18
WORKDIR /app

COPY ./package.json /app/package.json
RUN yarn install
RUN mkdir /app/data
RUN chmod -R a+rw /app/data

COPY . /app

CMD ["node", "bin/bryxcoin.js", "-p", "8080"]
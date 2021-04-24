FROM node:12.21.0

WORKDIR /workspace

COPY package.json yarn.lock /workspace/

RUN yarn install --silent --production

COPY . .

RUN yarn build

CMD ["yarn", "start:debug:prod"]

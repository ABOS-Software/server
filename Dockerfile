FROM node:8.10.0-alpine

RUN apk add --no-cache bash
WORKDIR /usr/app


COPY package.json .
RUN yarn install --dev

COPY . .
RUN chmod +x ./wait-for-it.sh
ENV NODE_ENV production
CMD ["yarn", "run", "start"]

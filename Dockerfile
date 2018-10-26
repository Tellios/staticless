FROM node:10.12.0-alpine
LABEL name="Staticless" maintainer="https://github.com/Tellios"


RUN mkdir /opt/app
WORKDIR /opt/app

ADD dist ./
ADD node_modules node_modules

ENV NODE_ENV=production
EXPOSE 8080

USER node

CMD ["node", "run.js"]

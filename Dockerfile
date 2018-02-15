FROM node:8.9.4-alpine
LABEL name="Staticless" maintainer="https://github.com/Tellios"


RUN mkdir /opt/app
WORKDIR /opt/app

ADD dist ./
ADD node_modules node_modules

ENV NODE_ENV=production
EXPOSE 8080

USER node

CMD ["node", "run.js", "--server:port", "8080", "--server:address", "0.0.0.0"]

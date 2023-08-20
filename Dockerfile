FROM node:20-alpine as angular_dev

ARG ANGULAR_CLI_VERSION=latest
ENV NG_CLI_ANALYTICS=false

RUN apk update \
  && apk add --update alpine-sdk python3 \
  && yarn global add @angular/cli@$ANGULAR_CLI_VERSION \
  && ng config --global cli.packageManager yarn \
  && apk del alpine-sdk python3 \
  && rm -rf /tmp/* /var/cache/apk/* *.tar.gz ~/.npm \
  && npm cache clean --force \
  && yarn cache clean\
  && mkdir -p /dist

COPY app /app
WORKDIR /app/xknxui
RUN ng build --output-path=/app/dist --configuration production

###############################################################################
FROM python:3-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/

RUN pip3 install --upgrade pip
RUN pip3 install --no-cache-dir -r requirements.txt

COPY server /usr/src/app/server
COPY --from=angular_dev /app/dist /usr/src/app/server/app

EXPOSE 8124

ENTRYPOINT ["python3"]

CMD ["-m", "server"]

FROM ubuntu:18.04

WORKDIR /usr/src/app

RUN apt update
RUN apt install -y curl

ADD script .

CMD ["./script"]

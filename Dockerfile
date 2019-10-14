FROM ubuntu:18.04

WORKDIR /usr/src/app

ADD script .

CMD ["./script"]

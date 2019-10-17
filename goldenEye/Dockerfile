FROM kalilinux/kali-linux-docker

COPY ./GoldenEye .

RUN apt-get update

RUN apt-get install -f -y tor python

RUN service tor start

CMD ["./goldeneye.py", "http://18.190.15.1"]

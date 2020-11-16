FROM python:3.8
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/
RUN mkdir /etc/letsencrypt/
RUN mkdir /etc/letsencrypt/live
RUN mkdir /etc/letsencrypt/live/k3b304.p.ssafy.io/
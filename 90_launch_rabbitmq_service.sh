#!/bin/bash

docker run -d \
  --hostname my-rabbit \
  --name some-rabbit \
  -p 5672:5672 \
  -e RABBITMQ_ERLANG_COOKIE='secret cookie here' \
  rabbitmq:3.7.7

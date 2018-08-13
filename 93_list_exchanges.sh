#!/bin/bash

docker run --rm \
  --link some-rabbit:my-rabbit \
  -e RABBITMQ_ERLANG_COOKIE='secret cookie here' rabbitmq:3 \
  rabbitmqctl -n rabbit@my-rabbit list_exchanges

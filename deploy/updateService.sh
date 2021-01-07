#!/bin/bash

set -e

COMPOSE_PRJ_DIR=$1

err() {
  echo "[Error] $@" >&2
}


info() {
  echo "[Info] $@" >&1
}

dia() {
  local retCode=$1
  shift
  echo "[Error]: $@" >&2
  exit ${retCode}
}

info "runner user [$USER]"
info "docker-compose dir [$COMPOSE_PRJ_DIR]"

if [[ ! -f ${COMPOSE_PRJ_DIR}/docker-compose.yml ]]; then
  dia 2 "There is no docker compoase project found, please indicate the right directory."
fi

#if [[ ! -n ${TAG} ]]; then
#  dia 2 "Please indicate the image tag."
#fi

cd ${COMPOSE_PRJ_DIR}

docker image load -i ~/web.tar
./update.sh

# if [ "${MACHINE_NAME}" != "self" ]; then
#   # Use docker machine
#   eval $(docker-machine env ${MACHINE_NAME})
# fi

# info "Pull new image [$CD_IMAGE_REPOSITORY]"
# docker image pull ${CD_IMAGE_REPOSITORY}:${TAG}

# info "Update the service [$SERVICE_NAME] ..."
# docker-compose up -d $SERVICE_NAME
# if [ $? -ne 0 ]; then
#   dia 1 "Update service [$SERVICE_NAME] failed, please check it manually."
# else
#   info "Update service [$SERVICE_NAME] successfully for test environment."
# fi

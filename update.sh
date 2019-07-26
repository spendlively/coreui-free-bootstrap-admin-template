#!/usr/bin/env bash

SERVER_USER=admin
SERVER_IP=192.168.8.74

npm run rsdu-login-build \
&& npm run rsdu-build \
&& npm run build \
&& rsync -r /home/spendlively/vhosts/gis/coreui-free-bootstrap-admin-template/dist/ $SERVER_USER@$SERVER_IP:/var/www/omsfrontend/dist/

#!/usr/bin/env bash

npm run rsdu-login-build && npm run rsdu-build && npm run build && rsync -r /home/spendlively/vhosts/gis/coreui-free-bootstrap-admin-template/dist/ admin@192.168.8.74:/var/www/omsfrontend/dist/

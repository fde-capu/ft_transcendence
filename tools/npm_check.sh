#!/bin/sh

MYSELF="$(realpath "$0")";
MYDIR="${MYSELF%/*}";
. $MYDIR/z_helper_functions.sh --source-only

ask "Reinstall npm?" && sudo apt install -y npm;
ask "Install npm-n? Usefull to get latest stable." && sudo npm install -g n;
ask "Run n stable? Sets npm version." && sudo n stable;
ask "Install latest npm?" && sudo npm install -g npm@latest;
ask "Install nestjs/cli@latest?" && sudo npm install -g @nestjs/cli@latest;

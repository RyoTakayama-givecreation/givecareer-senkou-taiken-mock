#!/bin/sh
set -eu
cd "$(dirname "$0")"
printf 'Give Career 選考体験 prototype: http://127.0.0.1:8766/\n'
python3 -m http.server 8766 --bind 127.0.0.1

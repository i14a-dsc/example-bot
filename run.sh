#!/bin/bash

set -e
DIR="$(cd "$(dirname "$(readlink -f "$0")")" && pwd)"
cd "$DIR"

bun i

arg="$1"
if [ "$arg" == "dev" ]; then
  bunCommand="bun run --hot src/index.ts --development"
  echo "Development mode enabled."
else
  bunCommand="bun src/index.ts --production"
fi

while true; do
  eval "$bunCommand"
done

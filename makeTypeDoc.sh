#!/bin/bash
set -e  # Enable exit on error
BLUE_COLOR='\033[1;38;2;0;119;247m'
ORANGE_COLOR='\033[1;38;2;255;127;0m'
RESET_COLOR='\033[0m'
TEMP_DIR=$(mktemp -d -t docs-XXXXXXXXXX)
cleanup() {
  rm -rf "${TEMP_DIR}"
}
trap cleanup EXIT
pnpm exec typedoc --out "${TEMP_DIR}" --plugin typedoc-plugin-markdown --disableSources
set +e
diff -u -r "${TEMP_DIR}" ./docs > /dev/null
diff_exit_code=$?
set -e

if [ "${diff_exit_code}" -ne 0 ]; then
  echo -e "[${0}] ${ORANGE_COLOR}Docs are out of date, updating...${RESET_COLOR}"
  rm -rf ./docs
  mv "${TEMP_DIR}" ./docs
  git add ./docs
else
  echo -e "[${0}] ${BLUE_COLOR}Docs are up to date${RESET_COLOR}"
fi
exit 0

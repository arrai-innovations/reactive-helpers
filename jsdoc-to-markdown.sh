#!/bin/bash
set -e
npx --no-install jsdoc-to-markdown > ./docs.new.md
npx --no-install prettier --write docs.new.md > /dev/null
set +e
diff ./docs.new.md ./docs.md > /dev/null
diffCode=$?
# we want to return a non-zero exit code if the files are different, to stop the commit
if [ $diffCode != 0 ]; then
  echo "docs.md is out of date, see git diff for details"
  mv ./docs.new.md ./docs.md
  exit $diffCode
fi
set -e
rm ./docs.new.md

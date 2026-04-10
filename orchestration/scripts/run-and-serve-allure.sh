#!/usr/bin/env bash
set -euo pipefail

test_exit_code=0

npx playwright test "$@" || test_exit_code=$?
npm run report:allure:generate

if [[ "${CI:-false}" == "true" || "${GITHUB_ACTIONS:-false}" == "true" ]]; then
  echo "CI environment detected. Skipping Allure serve and keeping generated HTML report only."
else
  npm run report:allure:serve
fi

exit "$test_exit_code"

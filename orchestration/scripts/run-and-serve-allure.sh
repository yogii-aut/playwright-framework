#!/usr/bin/env bash
set -euo pipefail

test_exit_code=0

npx playwright test "$@" || test_exit_code=$?
npm run report:allure:generate
npm run report:allure:serve

exit "$test_exit_code"

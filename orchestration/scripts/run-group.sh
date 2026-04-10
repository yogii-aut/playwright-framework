#!/usr/bin/env bash
set -euo pipefail

GROUP="${1:-smoke}"

case "$GROUP" in
  smoke)
    npx playwright test --grep @smoke
    ;;
  sanity)
    npx playwright test --grep @sanity
    ;;
  regression)
    npx playwright test --grep @regression
    ;;
  cross-browser)
    npx playwright test --project=chromium --project=firefox --project=webkit
    ;;
  *)
    echo "Unsupported group: $GROUP"
    exit 1
    ;;
esac


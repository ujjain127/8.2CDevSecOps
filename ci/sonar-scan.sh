#!/bin/sh
set -eu
set +x
: "${SONAR_TOKEN:?Configure Jenkins Secret text credential SONAR_TOKEN}"
version=8.1.0.6389
case "$(uname -s):$(uname -m)" in
  Linux:x86_64) platform=linux-x64 ;;
  Linux:aarch64|Linux:arm64) platform=linux-aarch64 ;;
  Darwin:arm64) platform=macosx-aarch64 ;;
  Darwin:x86_64) platform=macosx-x64 ;;
  *) echo 'Unsupported scanner platform' >&2; exit 2 ;;
esac
mkdir -p .tools reports
archive="sonar-scanner-cli-$version-$platform.zip"
url="https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/$archive"
curl --fail --silent --show-error --location "$url" -o ".tools/$archive"
unzip -q -o ".tools/$archive" -d .tools
scanner=".tools/sonar-scanner-$version-$platform/bin/sonar-scanner"
# Authentication remains in the environment, not command arguments or properties.
"$scanner" > reports/sonar-scanner.log 2>&1 || { cat reports/sonar-scanner.log; exit 1; }
cat reports/sonar-scanner.log
node ci/sonar-status.cjs

#!/bin/sh
# Preserve real exit codes while allowing the assessment pipeline to continue.
set -u
name=$1
shift
mkdir -p reports
"$@" > "reports/$name.log" 2>&1
result=$?
cat "reports/$name.log"
printf '%s\n' "$result" > "reports/$name.exit-code"
printf '\n%s exit code: %s\n' "$name" "$result"
exit "$result"

#!/bin/sh
# Runs the tests on an iOS simulator, picked by UDID so duplicate simulator names don't matter.
#   scripts/test.sh [xcodebuild args…]                   # e.g. -only-testing:DHDTests
#   SIMULATOR="iPhone 17" scripts/test.sh                # a simulator by name (first match) or UDID
# Without SIMULATOR, uses an iPhone on the newest installed iOS runtime.
set -eu
cd "$(dirname "$0")/.."

udid=$(xcrun simctl list devices available -j | /usr/bin/python3 -I -c '
import json, re, sys
wanted = sys.argv[1]
runtimes = json.load(sys.stdin)["devices"]
def version(runtime):
    return [int(n) for n in re.findall(r"\d+", runtime.rsplit("iOS", 1)[-1])]
for runtime in sorted((r for r in runtimes if ".iOS-" in r), key=version, reverse=True):
    for device in runtimes[runtime]:
        if device["udid"] == wanted or device["name"] == wanted or (not wanted and device["name"].startswith("iPhone")):
            print(device["udid"])
            sys.exit()
sys.exit("No available iOS simulator matches " + (repr(wanted) if wanted else "an iPhone"))
' "${SIMULATOR:-}")

xcodegen generate --quiet
exec xcodebuild test -project DHD.xcodeproj -scheme DHD -destination "platform=iOS Simulator,id=$udid" "$@"

#!/bin/bash
# Serve the NecroRepo app locally (no build step needed).
set -e
cd "$(dirname "$0")/app"
echo "NecroRepo at http://localhost:8130"
python3 -m http.server 8130

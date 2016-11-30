#!//bin/bash
export SLACK_TOKEN=
export WitToken=
forever --workingDir /src/App/ start /src/App/bot_logic/envoprov.js


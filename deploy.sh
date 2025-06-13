#!/usr/bin/sh
cd C:/Users/Kamil/Desktop/PROJECTS/react-chat-api
npm run build
scp -P 10240 dist/app.bundle.js package.json package-lock.json root@srv23.mikr.us:~/apps/react-chat/backend
ssh root@srv23.mikr.us -p 10240 'sudo systemctl restart react-chat.service'

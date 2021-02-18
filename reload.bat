start /b cmd /c npm install
start /b cmd /c pm2 kill
start /b cmd /c pm2 start ecosystem.config.js
start /b cmd /c pm2 save

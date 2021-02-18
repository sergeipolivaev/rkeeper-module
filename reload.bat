start /b cmd /c npm install
timeout 20 > NUL
start /b cmd /c pm2 delete all
timeout 20 > NUL
start /b cmd /c pm2 start ecosystem.config.js
timeout 20 > NUL
start /b cmd /c pm2 save

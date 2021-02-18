start /b npm install
start /b pm2 kill && pm2 start ecosystem.config.js
start /b pm2 save

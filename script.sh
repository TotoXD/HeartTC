taskkill //F //IM node.exe
read -p "Press enter to continue"
node socketServer.js &
node backend/server.js &
ng serve &
termux-setup-storage && \
pkg update && pkg upgrade -y && \
pkg install git nodejs ffmpeg imagemagick yarn -y && \
cd ~ && \
git clone https://github.com/tiktoksixseven676767-del/chatunity-bot.git && \
cd chatunity-bot && \
yarn install && \
yarn start
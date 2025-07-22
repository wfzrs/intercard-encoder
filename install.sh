cd $HOME
# Install prereqs
sudo apt-get update
sudo apt-get install -y curl gcc g++ make git vim
curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install -y nodejs
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install -y yarn
rm nodesource_setup.sh
git clone https://github.com/wfzrs/intercard-encoder && mv intercard-encoder/ intercard/
echo "Prereqs have finished installing"
echo "Now installing PCSC drivers"
sudo apt-get update && apt-get install libpcsclite1 libpcsclite-dev pcscd -y
echo "Installing NodeJS nfc module"
npm install nfc-pcsc --save
echo "Building stupid NPM package"
cd ${HOME}/intercard && npm install
echo "----------------------------------------------"
echo " DONE! Run program by typing `npm run wahooz`
echo "----------------------------------------------"

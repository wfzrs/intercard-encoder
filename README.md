# Installation
---
## nfc-pcsc

**Requirements:** **at least Node.js 8 or newer** (see [this FAQ](#which-nodejs-versions-are-supported) for more info)

1. **Install NodeJs**

    ```bash
	curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
    sudo bash nodesource_setup.sh
	sudo apt-get install gcc g++ make
	sudo apt-get install -y nodejs
	curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
	echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
	sudo apt-get update && sudo apt-get install yarn
	```

2. **Node Native Modules build tools**

    Because this library (via [pokusew/node-pcsclite](https://github.com/pokusew/node-pcsclite) under the hood) uses Node Native Modules (C++ Addons),
    which are automatically built (using [node-gyp](https://github.com/nodejs/node-gyp))
    when installing via npm or yarn, you need to have installed **C/C++ compiler
    toolchain and some other tools** depending on your OS.
    
    **Please refer to the [node-gyp > Installation](https://github.com/nodejs/node-gyp#installation)**
    for the list of required tools depending on your OS and steps how to install them.

3. **PC/SC API in your OS**

    On **macOS** and **Windows** you **don't have to install** anything,
    **pcsclite API** is provided by the OS.
    
    On Linux/UNIX you'd probably need to install pcsclite library and daemon**.

    > For example, in Debian/Ubuntu:
    > ```bash
    > apt-get install libpcsclite1 libpcsclite-dev
    > ```
    > To run any code you will also need to have installed the pcsc daemon:
    > ```bash
    > apt-get install pcscd
    > ```

4. **Once you have all needed libraries, you can install nfc-pcsc using npm:**

    ```bash
    npm install nfc-pcsc --save
    ```
    
    or using Yarn:
    
    ```bash
    yarn add nfc-pcsc    ```

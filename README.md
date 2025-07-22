# Installation
## EZPZ Install Script

1. **Run the install script from this repo**
 - Clone the repo to a Linux device and put it into a directory named `intercard`
 - `cd` into that directory (usually just type `cd intercard`)
 - Run the following command:
   ```
   chmod +x ubuntu_install.sh
   ```


3. **Node Native Modules build tools**

    Because this library (via [pokusew/node-pcsclite](https://github.com/pokusew/node-pcsclite) under the hood) uses Node Native Modules (C++ Addons),
    which are automatically built (using [node-gyp](https://github.com/nodejs/node-gyp))
    when installing via npm or yarn, you need to have installed **C/C++ compiler
    toolchain and some other tools** depending on your OS.
    
    **Please refer to the [node-gyp > Installation](https://github.com/nodejs/node-gyp#installation)**
    for the list of required tools depending on your OS and steps how to install them.

4. **PC/SC API in your OS**

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

5. **Once you have all needed libraries, you can install nfc-pcsc using npm:**

    ```bash
    npm install nfc-pcsc --save
    ```
    
    or using Yarn:
    
    ```bash
    yarn add nfc-pcsc    ```

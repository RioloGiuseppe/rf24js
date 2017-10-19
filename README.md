# rf24js

![Support Node of LTS](https://img.shields.io/badge/node-LTS-brightgreen.svg?style=plastic) ![npm version](https://img.shields.io/badge/npm-3.5.0-brightgreen.svg?style=plastic) ![Build passing](https://img.shields.io/badge/build-passing_C++-brightgreen.svg?style=plastic) ![Build passing](https://img.shields.io/badge/build-passing%20Typescript-brightgreen.svg?style=plastic) ![Support](https://img.shields.io/badge/support-javascript%20|%20typescript-yellow.svg?style=plastic) ![dependencies rf24 nan](https://img.shields.io/badge/dependencies-RF24_|%20NAN-blue.svg?style=plastic) ![License mit](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic) ![tested](https://img.shields.io/badge/tested%20on-Raspberry%20Pi%20|%20Orange%20Pi-orange.svg?style=plastic)

---

# Description
Module rf24js wants to be a simple wrapper of [RF24C++ library by TMRH20](https://github.com/nRF24/RF24). No logic added, just existing methods wrapped.

# How to use

### Install dependencies:
The only one dependency is the library it wants to wrapper: RF24.
Use the following instructions to compile and install it from sources:
```sh
git clone https://github.com/nRF24/RF24.git
cd RF24 
make
sudo make install
```
### Import in node js
After RF24 is installed, simple run:
```sh
npm install --save rf24js
```

### Use in your project
#### Typescript
```ts
import {radio, PALevel,CRCLength,Datarate} from 'rf24js'
```
#### Javascript
```js
var rf24js = require('rf24js');
var radio = rf24js.radio;
var PALevel = rf24js.PALevel;
var CRCLength = rf24js.CRCLength;
var Datarate = rf24js.Datarate;
```
#### Configure and setup your radio using create(ce, cs) method.
Parameter *ce* is the mini-pc pin number in with is connected radio chip enable pin.<br>
Parameter *cs* is a number (byte) to select SPI device in with is connected the radio. In general this parameter is an integer that represent the id, without dot, of the spi devices you find using command `ls /dev`. Example: for `spidev0.0` CS is 0, for `spidev0.1` CS is 1, for `spidev1.0` CS is 10, ecc

```js
radio.create(2, 10); // OrangePi-Zero 
radio.create(22, 0); // RaspberryPi 1/2/3 
radio.begin();
radio.printDetails(); // Optionally: is used to show radio configuration
```
**Declare and open read and write pipes**
```js
var pipe1 = new Buffer("1Node\0");
var pipe2 = new Buffer("2Node\0");
radio.openWritingPipe(pipe1);
radio.openReadingPipe(1, pipe2);
```
**Read data**
```js
var buffer = null;
if (radio.available())
    buffer = radio.read(4);
```
**Write data**
```js
var buffer = new Buffer(4).fill(0);
buffer.writeUInt32LE(50);
var success = radio.write(buffer, buffer.length);
```

### Note
In some OS like Raspibian yuo need to start node application as **super user**.
"use strict";

import { NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B } from '../src/index';
import pretty from './pretty-logger';

const nfc = new NFC(); // const nfc = new NFC(pretty); // optionally you can pass logger to see internal debug logs
const axios = require('axios');
const TENANT_ID = 15;

function stringToBlock(s) {
  const data = Buffer.allocUnsafe(16);
  for (let index = 0; index < 16; index++) {
    if (s.length > index) {
      data[index] = s.charCodeAt(index);
    } else {
      data[index] = 0;
    }
  }
  return data;
}

function changeEndianness (string) {
  const result = []
  let len = string.length - 2
  while (len >= 0) {
    let stringSub = string.substr(len, 2)
    stringSub = stringSub.toUpperCase()
    result.push(stringSub)
    len -= 2
  }

  return result.join('')
}

nfc.on('reader', async reader => {

  pretty.info(`device attached, Ready to attach wristbands`);

  reader.on('card', async card => {

    const key = 'FFFFFFFFFFFF';
    const keyType = KEY_TYPE_A;

    if (card.type !== TAG_ISO_14443_3) {
      return;
    }

    try {
      await reader.authenticate(4, keyType, key);
    } catch (err) {
      pretty.error(`error when authenticating block 4 within the sector 1`, reader, err);
      return;
    }

    const cardUid = changeEndianness(card.uid);
    const data = {
      uid: cardUid,
      tenant_id: TENANT_ID
    }

    const headers = {
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc5NWUxNDU5NTJhNmJiMTFmYzkyOGEwMjZmMTk1MTRlOWQ3YmU2NmQwNzYxMGM5NTU1M2E2OTA5ZDk2ZjYzMzNiOGJlZjFiODFjMDBlODA2In0.eyJhdWQiOiIxMyIsImp0aSI6Ijc5NWUxNDU5NTJhNmJiMTFmYzkyOGEwMjZmMTk1MTRlOWQ3YmU2NmQwNzYxMGM5NTU1M2E2OTA5ZDk2ZjYzMzNiOGJlZjFiODFjMDBlODA2IiwiaWF0IjoxNjc0NzYxMDE1LCJuYmYiOjE2NzQ3NjEwMTUsImV4cCI6MTcwNjI5NzAxNSwic3ViIjoiMyIsInNjb3BlcyI6WyIqIl19.rUmOI00akzNMQ76qAzNKEk5pK6_FNCWsXrSlOaHPb_jpqizpxypwFRQwJf17G2cP0Pihvrm93pxo7vKtw-2e5dJ2ybMZKUzQtqow1UhE46Q33FyTFvj6Rsyil2kjacYAFGtHnqQessMi5-nj335a0SqRIOzzOwd34pdoi4HR_yMlKLjQBZ8_qTNFAj86nc9bVy6f0r-h2wrd4xqusqqcOev1iOst2XLWHywjMPVqlSU-OFmWVyiUn4g4lMeFbumP9664vX-307NZqmfhXAbDR0iLVZoAwIpnrZ-L5XCOsnbfbZOH0d0c2tp_YSJvY5eVRTEQgH54Vx3Gus15WzIv7k4BiRhX5uhH8dCoBaXA0lC_XBrq2qUxD5tCi8RZYXSgOwQsPrwa45DqiN5j8VCz8t0Ejm9XSifovvYKj9a_n9Ml1jk0RWXPztL6WdDlnAXDkgmUEpz0DlIbozuZjTGrNP4HkJ_3A-v1h-DH7UEdJcjnSMWho7e-MagR4f6W8pJgDCV7IdiN3aLzl6z00VE_f1K_5BWgJOal4eo2cUTsJ8lX1czWyLPKnhJzMV4XROam1bOZ5Y-trjPCw_EY30K1S_SOYR6CG9QW0_BaNewgedcP8vc_JJTxqk5UIHt0v0pt2c4W9rcX7SDH9fMRkEUL33ruqiAUfSr7GX_zOJsvJy0'
    }

    axios.post('https://us.connectngo.com/api/v1/intercard/attach', data, {
        headers: headers
      })
      .then(async res => {
        if (res.status == 204) {
          pretty.info('All wristband attached, no more codes available');
          process.exit(0);
        }
        if (res.status == 200) {
          const data1 = res.data.nfc.substring(0,16);
          const data2 = res.data.nfc.substring(16,32);
          const data3 = res.data.nfc.substring(32,48);
          const block4 = stringToBlock(data1);
          const block5 = stringToBlock(data2);
          const block6 = stringToBlock(data3);

          try {
            await reader.write(4, block4, 16); // blockSize=16 must specified for MIFARE Classic cards
            await reader.write(5, block5, 16); // blockSize=16 must specified for MIFARE Classic cards
            await reader.write(6, block6, 16); // blockSize=16 must specified for MIFARE Classic cards

            console.log("\x07");
            pretty.info(`Success Account ${res.data.account} attach to the wristband ${cardUid}`);

          } catch (err) {
            console.log("\x07\x07\x07");
            pretty.error(`error when writing data, try again`);
          }
        }
      })
      .catch(error => {
        if (error.response?.status == 404) {
          console.log("\x07\x07\x07");
          pretty.error('\x07\x07\x07UID not found in the database');
        } else {
          console.log("\x07\x07\x07");
          console.error('!!!ERROR!!!')
          console.error(error)
        }
      })
  });

  reader.on('error', err => {
    pretty.error(`an error occurred, try again`);
  });

  reader.on('end', () => {
    pretty.info(`device removed`, reader);
  });

});

nfc.on('error', err => {
  pretty.error(`an error occurred, try again`);
});

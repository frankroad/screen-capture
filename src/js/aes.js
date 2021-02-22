import CryptoJS from "crypto-js";
const keys = ["1=", "_", "23", "4a5", "6e7", "qW"];
const originKey = keys[0] + keys[1] + keys[2] + keys[3] + keys[4] + keys[5];
const key = CryptoJS.MD5(originKey);
const iv = "q2" + "3-" + "o6" + "+2" + "1z3" + "4Q6" + "M8";

function getAesString(data, key, iv) {
  key = CryptoJS.enc.Utf8.parse(key);
  iv = CryptoJS.enc.Utf8.parse(iv);
  let encrypted = CryptoJS.AES.encrypt(data,key,
    {
      iv:iv,
      mode:CryptoJS.mode.CBC,
      padding:CryptoJS.pad.Pkcs7
    });
  return encrypted.toString();
}

function getDAesString(encrypted, key, iv) {
  key = CryptoJS.enc.Utf8.parse(key);
  iv = CryptoJS.enc.Utf8.parse(iv);
  let decrypted = CryptoJS.AES.decrypt(encrypted,key,
    {
      iv:iv,
      mode:CryptoJS.mode.CBC,
      padding:CryptoJS.pad.Pkcs7
    });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

function encrypte(data) {
  let encrypted = getAesString(data,key,iv);
  let encrypted1 = CryptoJS.enc.Utf8.parse(encrypted);
  return encrypted;
}

function decrypte(data) {
  let decryptedStr = getDAesString(data,key,iv);
  return decryptedStr;
}

module.exports = {
  encrypte: encrypte,
  decrypte: decrypte
}

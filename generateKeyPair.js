const crypto = require("crypto"),
  fs = require("fs");

function genKeyPair(name) {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    // rsa is the most common algorithm.
    modulusLength: 4096, // RSA bits.
    publicKeyEncoding: {
      type: "pkcs1", // public key cryptography standards 1.
      format: "pem", // most common formatting choice
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  // save public and private on disk.
  fs.writeFileSync(__dirname + "/" + name + "_rsa_pub.pem", keyPair.publicKey);

  fs.writeFileSync(
    __dirname + "/" + name + "_rsa_priv.pem",
    keyPair.privateKey
  );
}

genKeyPair("access_token");
genKeyPair("refresh_token");

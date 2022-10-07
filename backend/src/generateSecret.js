import crypto from "crypto";

const generateSecret = () => {
  return console.log(
    "Your secret token: ",
    crypto.randomBytes(64).toString("hex")
  );
};

generateSecret();

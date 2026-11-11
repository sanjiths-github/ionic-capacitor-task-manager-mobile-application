import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
if (fs.existsSync(".env.signing"))
  throw new Error(
    "Signing configuration already exists; back it up and reuse it.",
  );
fs.mkdirSync(".signing", { recursive: true });
const keystore = path.resolve(".signing/taskflow-release.jks");
if (fs.existsSync(keystore))
  throw new Error("A signing key already exists; refusing to replace it.");
const storePassword = crypto.randomBytes(32).toString("base64url");
const keyPassword = crypto.randomBytes(32).toString("base64url");
const keytool = process.env.JAVA_HOME
  ? path.join(
      process.env.JAVA_HOME,
      "bin",
      process.platform === "win32" ? "keytool.exe" : "keytool",
    )
  : "keytool";
const r = spawnSync(
  keytool,
  [
    "-genkeypair",
    "-v",
    "-keystore",
    keystore,
    "-storetype",
    "JKS",
    "-alias",
    "taskflow",
    "-keyalg",
    "RSA",
    "-keysize",
    "3072",
    "-validity",
    "10000",
    "-dname",
    "CN=TaskFlow, OU=Development, O=TaskFlow, L=Local, ST=Local, C=IN",
    "-storepass:env",
    "KEYSTORE_PASS",
    "-keypass:env",
    "KEY_PASS",
  ],
  {
    env: {
      ...process.env,
      KEYSTORE_PASS: storePassword,
      KEY_PASS: keyPassword,
    },
    stdio: "inherit",
  },
);
if (r.status !== 0) process.exit(r.status || 1);
fs.writeFileSync(
  ".env.signing",
  `ANDROID_KEYSTORE_PATH=${keystore.replaceAll("\\", "/")}\nANDROID_KEYSTORE_PASSWORD=${storePassword}\nANDROID_KEY_ALIAS=taskflow\nANDROID_KEY_PASSWORD=${keyPassword}\n`,
  { mode: 0o600 },
);
console.log(
  "Signing key and ignored local configuration created. Back up both securely before distributing updates.",
);

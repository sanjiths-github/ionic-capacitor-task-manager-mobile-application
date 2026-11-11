import fs from "node:fs";
import { spawnSync } from "node:child_process";
for (const line of fs.readFileSync(".env.signing", "utf8").split(/\r?\n/)) {
  const at = line.indexOf("=");
  if (at > 0) process.env[line.slice(0, at)] = line.slice(at + 1);
}
process.env.APP_VERSION = JSON.parse(
  fs.readFileSync("package.json", "utf8"),
).version;
const [a, b, c] = process.env.APP_VERSION.split(".").map(Number);
process.env.ANDROID_VERSION_CODE = String(a * 10000 + b * 100 + c);
const r = spawnSync(
  process.execPath,
  ["scripts/gradle.mjs", "assembleRelease"],
  { env: process.env, stdio: "inherit" },
);
if(r.error)throw r.error;
process.exit(r.status ?? 1);

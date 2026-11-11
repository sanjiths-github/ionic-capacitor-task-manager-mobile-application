import { spawnSync } from "node:child_process";
const command = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const args = process.argv.slice(2);
const r = spawnSync(command, args, {
  cwd: "android",
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(r.status || 0);

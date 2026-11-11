import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(
  process.env.FRONTEND_OUT || path.join(root, "../frontend/out"),
);
if (!fs.existsSync(path.join(source, "index.html")))
  throw new Error("Build frontend first, or set FRONTEND_OUT.");
fs.cpSync(source, path.join(root, "web"), { recursive: true });
console.log("Shared frontend assets copied.");

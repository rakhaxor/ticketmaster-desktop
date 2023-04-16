import fs from 'fs';

export function log(msg: string) {
  fs.appendFileSync("misc/window/bot/logs.txt", msg + "\n");
}

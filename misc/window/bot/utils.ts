import fs from 'fs';

export function log(msg: string) {
  fs.appendFileSync("./logs.txt", msg + "\n");
}

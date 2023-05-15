import { readFileSync,writeFileSync } from 'fs'
import * as path from 'path'
export const save = (text: string) => {
    writeFileSync(path.resolve("cache/pulled/pixiv.json"),text,{
        encoding: "utf8",
        flag: "w+"
      })
}
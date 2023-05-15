/*
 * @Author: QyInvoLing
 * @Date: 2023-05-15 16:28:26
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-15 17:01:40
 * @FilePath: \michanDaily\src\services\generator\Markdown\main.ts
 * @Description: 
 */
import Generator from "../Generator";
import * as path from "path"
import { read, readFileSync, writeFileSync } from 'fs'
import logger from "@/lib/logger";
import { Illust } from "@/types/Illust";
class Markdown extends Generator {
    //prerequisites = ["Pixiv"]
    loadPixivCache() {
        let json: Record<number, Illust[]> = JSON.parse(readFileSync(path.resolve("cache/pulled/pixiv.json"), { encoding: 'utf8', flag: 'r' }))
        return json
    }
    run() {
        let markdownString = ""
        let pixivCache = this.loadPixivCache()
        Object.keys(pixivCache).forEach((author)=>{
            let illustArray: Illust[] = pixivCache[author]
            illustArray.map(illust=>{
                markdownString+=`![${illust.title.slice(0,10)},PID${illust.id},Author${author}](${illust.source})\n\n`
            })
        })
        save(markdownString)

    }
}
const save = (text: string) => {
    writeFileSync(path.resolve("cache/generated/pixiv_markdown.md"),text,{
        encoding: "utf8",
        flag: "w+"
      })
}
export default Markdown
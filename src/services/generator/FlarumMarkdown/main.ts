/*
 * @Author: QyInvoLing
 * @Date: 2023-05-15 16:28:26
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-16 17:33:04
 * @FilePath: \michanDaily\src\services\generator\FlarumMarkdown\main.ts
 * @Description: 
 */
import Generator from "../Generator";
import * as path from "path"
import { read, readFileSync, writeFileSync } from 'fs'
import logger from "@/lib/logger";
import { Illust } from "@/types/Illust";
class FlarumMarkdown extends Generator {
    //prerequisites = ["Pixiv"]
    loadPixivCache() {
        let json: Record<number, Illust[]> = JSON.parse(readFileSync(path.resolve("cache/pulled/pixiv.json"), { encoding: 'utf8', flag: 'r' }))
        return json
    }
    run() {
        let today = (new Date()).toLocaleDateString()
        let markdownString = `# 米站日报${today}——深渊截止提醒、每日涩图\n\n`
        let abyssNotice = readFileSync(path.resolve("cache/pulled/abyss_notice.md"), { encoding: 'utf8', flag: 'r' })
        markdownString += "### 深渊截止提醒\n"
        markdownString += abyssNotice + "\n"
        //处理pixiv puller生成的内容
        markdownString += "### 每日涩图\n已关注画师数量有限，所以目前数量稀少!\n>!"
        let pixivCache = this.loadPixivCache()
        Object.keys(pixivCache).forEach((author)=>{
            let illustArray: Illust[] = pixivCache[author]
            illustArray.map(illust=>{
                markdownString+=`![${illust.title.slice(0,10)},PID${illust.id},Author${author}](${illust.source})\n`
            })
        })
        markdownString += "\n### 关于米站日报\n\
        米站日报由机器人自动生成并每日推送，推送时，会将昨天的日报回复到本主题内，所以所有的日报都会被存档至本主题的回复下。\n\n\
        \
        "
        save(markdownString)

    }
}
/**
 * 保存到cache
 * @param text 
 */
const save = (text: string) => {
    writeFileSync(path.resolve("cache/generated/pixiv_markdown.md"),text,{
        encoding: "utf8",
        flag: "w+"
      })
}
export default FlarumMarkdown
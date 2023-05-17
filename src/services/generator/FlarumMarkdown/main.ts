/*
 * @Author: QyInvoLing
 * @Date: 2023-05-15 16:28:26
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-17 15:22:19
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
        let template = "" + this.config.template as string
        let abyssNotice = readFileSync(path.resolve("cache/pulled/abyss_notice.md"), { encoding: 'utf8', flag: 'r' })
        //处理pixiv puller生成的内容
        let pixivMarkdown = ""
        let pixivCache = this.loadPixivCache()
        Object.keys(pixivCache).forEach((author) => {
            let illustArray: Illust[] = pixivCache[author]
            illustArray.map(illust => {
                pixivMarkdown += `![${illust.title.slice(0, 10)},PID${illust.id},Author${author}](${illust.source})\n`
            })
        })
        if(pixivMarkdown==""){
            pixivMarkdown = "呃啊,今天所有关注的画师都没有发表新作呢!"
        }
        template = template.replace("{today}", today)
            .replace("{abyssnotice}", abyssNotice)
            .replace("{pixiv}", pixivMarkdown)
        save(template)

    }
}
/**
 * 保存到cache
 * @param text 
 */
const save = (text: string) => {
    writeFileSync(path.resolve("cache/generated/pixiv_markdown.md"), text, {
        encoding: "utf8",
        flag: "w+"
    })
}
export default FlarumMarkdown
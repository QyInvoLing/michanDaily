/*
 * @Author: QyInvoLing
 * @Date: 2023-05-10 15:14:23
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-16 15:09:28
 * @FilePath: \michanDaily\src\services\pusher\Flarum\main.ts
 * @Description: 
 */

import Pusher from "@/services/pusher/Pusher"
import logger from '@/lib/logger'
import FlarumInterface from "./api/flarumApi"
import { readFileSync } from "fs"
import * as path from "path"


class Flarum extends Pusher {
    flarum: FlarumInterface
    constructor() {
        super()

    }
    async run() {
        //新建FlarumInterface实例
        this.flarum = new FlarumInterface(this.config.url as string, this.config.username as string, this.config.password as string)
        await this.flarum.login()
        //读取flarum日报需要的东西
        let markdownText = readFileSync(path.resolve("cache/generated/pixiv_markdown.md"), { encoding: 'utf8', flag: 'r' })


        //要实现的功能：对某一个主题，将主楼内容回复到主题内，然后将新内容覆盖到主楼
        //先获取主题的信息
        let discussionInfo = await this.flarum.getDiscussion(453)
        //主楼内容和所有回复内容都被存在discussionInfo.included这个Array内
        //其中的元素是object，type=posts并且attributes.number=1的就是主楼
        //注意，title不在这个元素内，只有content在
        let postsArray: any[] = discussionInfo.included
        let main = postsArray.filter((item)=>{
            if(item.type=="posts" && item.attributes.number==1){
                return true
            }
            return false
        })[0]
        let title = discussionInfo.data.attributes.title
        let content = main.attributes.content
        logger.info(`Main post found. Content:${content.slice(0,10)+"..."}`)
        //然后，将主楼内容回复到主题内
        await this.flarum.newPost(453,`# ${title}\n\n`+content)
        //然后，修改主楼为生成好的新内容
        await this.flarum.patchDiscussion(453,"测试主题","测试修改内容")

    }
}
export default Flarum
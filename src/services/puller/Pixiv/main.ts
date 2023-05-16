/*
 * @Author: QyInvoLing
 * @Date: 2023-05-10 15:14:23
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-16 09:26:51
 * @FilePath: \michanDaily\src\services\puller\Pixiv\main.ts
 * @Description: 
 */
/*
 * @Author: QyInvoLing
 * @Date: 2023-05-10 15:14:23
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-15 15:38:32
 * @FilePath: \michanDaily\src\services\puller\Pixiv\main.ts
 * @Description: 
 */
import Puller from "@/services/puller/Puller"
import { getMemberIllust } from "./api/hibiApi"
import logger from '@/lib/logger'
import { MemberIllustRaw } from '@/types/MemberIllustRaw';
import { save } from "./utils/save"
import { handleRawIllustJson } from "./utils/rawIllustHandler"

class Pixiv extends Puller {
    followedUsers: Array<number>
    async run() {
        let illustMap: Map<number, any[]> = new Map()
        for (let uid of this.followedUsers) {
            let rawIllustJson: MemberIllustRaw = await getMemberIllust(uid)
            let illustArray = handleRawIllustJson(rawIllustJson)
            let allIllustsStr = (illustArray.map(i => i.title)).join(", ")
            //将插画id添加回去
            let illustIDs: number[] = []
            illustMap.set(uid, illustArray)
            logger.info(`Getting ${uid}'s all illustrations done. ${allIllustsStr == "" ? "No illusts found today." : "Illusts: " + allIllustsStr}`)
        }
        save(JSON.stringify(Object.fromEntries(illustMap)))
    }
    constructor() {//加载配置文件
        super()//父类构造方法会读取配置文件
        this.followedUsers = this.config.followedUsers as number[]
    }
}
export default Pixiv
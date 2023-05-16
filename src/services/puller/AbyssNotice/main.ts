import Puller from "@/services/puller/Puller"

import logger from '@/lib/logger'
import { writeFileSync } from "fs"
import * as path from "path"


/**
 * 保存到cache
 * @param text 
 */
const save = (text: string) => {
    writeFileSync(path.resolve("cache/pulled/abyss_notice.md"), text, {
        encoding: "utf8",
        flag: "w+"
    })
}
const genNotice = {
    honkai3: () => {
        let date = new Date().getDay()
        let dateLeft = 0
        if (date == 0) {//一坨狗屎，但懒得改。获取距离最近的下一个周三/周日还有多少天
            dateLeft = 0
        } else if (date > 3) {
            dateLeft = 7 - date
        } else {
            dateLeft = 3 - date
        }
        return {
            "name": "崩坏三",
            "time": dateLeft
        }
    },
    genshin: () => {
        //获取本月的最后一天
        const currentDate = new Date();
        const date = currentDate.getDate()
        currentDate.setMonth((currentDate.getMonth() + 1) % 12, 1)
        currentDate.setDate(currentDate.getDate() - 1)
        const lastDayOfMonth = currentDate.getDate();
        let dateLeft = 0
        if (date <= 15) {
            dateLeft = 15 - date

        } else {
            dateLeft = lastDayOfMonth - date
        }
        return {
            "name": "原神",
            "time": dateLeft
        }
    },
    sr: () => {
        //崩铁每两周一次深渊，20230515就是打深渊的截止日期
        let start = new Date("2023/05/15")
        const intervalDays = 14;
        const currentDate = new Date();
        const daysSinceLastAbyss = Math.floor((currentDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        const nextAbyss = new Date(start);
        nextAbyss.setDate(start.getDate() + (Math.ceil(daysSinceLastAbyss / intervalDays) * intervalDays));
        return {
            "name": "星穹铁道",
            "time": Math.floor((nextAbyss.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
        }
    }
}
class AbyssNotice extends Puller {
    async run() {
        let notice = []
        Object.keys(genNotice).map((key) => {
            let result = genNotice[key]()
            let noticeStr = `距离${result.name}深渊结算还有${result.time}天!`
            notice.push(noticeStr)
        })
        //logger.info(notice.join("\n"))
        save(notice.join("\n"))
    }
    constructor() {
        super()
    }
}
export default AbyssNotice
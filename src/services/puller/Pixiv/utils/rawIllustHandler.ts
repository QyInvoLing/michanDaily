/*
 * @Author: QyInvoLing
 * @Date: 2023-05-11 15:34:49
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-15 15:41:12
 * @FilePath: \michanDaily\src\services\puller\Pixiv\utils\rawIllustHandler.ts
 * @Description: 
 */
import { MemberIllustRaw, IllustEntity } from "@/types/MemberIllustRaw";
import { Illust } from "@/types/Illust"
/**
 * 将原始json内的IllustEntity转换成Illust
 * @param illustEntity 
 * @returns 
 */
const fillIntoIllust = (illustEntity: IllustEntity) => {
    //进行类型转换，并且替换掉国内无法访问的源
    let illust: Illust = {
        id: illustEntity.id,
        title: illustEntity.title,
        source: illustEntity.image_urls.large.replace("i.pximg.net", "i.pixiv.re"),
        create_date: illustEntity.create_date,
        height: illustEntity.height,
        width: illustEntity.width,
        page_count: illustEntity.page_count
    }
    return illust
}
/**
 * 判断是否为今日图片
 * @param illust 
 * @returns 
 */
const timeFilter = (illust: Illust) => {
    let timeNow = new Date()
    let time = new Date(illust.create_date)
    return true||time.toDateString() == timeNow.toDateString()
}
/**
 * 将fetch得到的原始json解析，返回一个Array
 * @param rawIllustJson 
 * @returns 
 */
export const handleRawIllustJson = (rawIllustJson: MemberIllustRaw) => {
    let illustsArray = rawIllustJson.illusts.map(fillIntoIllust).filter(timeFilter)
    return illustsArray
}
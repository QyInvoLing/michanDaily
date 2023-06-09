/*
 * @Author: QyInvoLing
 * @Date: 2023-05-11 15:34:49
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-17 16:52:48
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
 * 判断是否为昨日图片
 * @param illust 
 * @returns 
 */
const timeFilter = (illust: Illust) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let date = new Date(illust.create_date)
    return date >= yesterday && date < today
}
/**
 * 将fetch得到的原始json解析，返回一个Array
 * @param rawIllustJson 
 * @returns 
 */
export const handleRawIllustJson = (rawIllustJson: MemberIllustRaw) => {
    try{
        let illustsArray = rawIllustJson.illusts.map(fillIntoIllust).filter(timeFilter)
        return illustsArray
    }catch(e){
        return []
    }
    
}
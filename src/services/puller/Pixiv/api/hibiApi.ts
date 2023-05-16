/*
 * @Author: QyInvoLing
 * @Date: 2023-05-11 11:43:03
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-15 15:31:06
 * @FilePath: \michanDaily\src\api\Pixiv\HibiApi.ts
 * @Description: 
 */
//https://api.obfs.dev/api/pixiv/member_illust?id=50944445
//test id:50944445
/**
 * 获取一个用户的所有插画
 * @param id Pixiv用户的数字id
 * @returns 
 */
export const getMemberIllust = async (id: string | number) => {
    const headers = new Headers({
        'Content-Type': 'text/html; charset=UTF-8'
    });
    let jsonResult = await (await fetch(`https://api.obfs.dev/api/pixiv/member_illust?id=${id}`, { headers })).json()
    return jsonResult
}

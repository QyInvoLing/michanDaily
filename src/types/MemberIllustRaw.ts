/*
 * @Author: QyInvoLing
 * @Date: 2023-05-11 15:18:41
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-11 15:31:03
 * @FilePath: \michanDaily\src\types\MemberIllustRaw.ts
 * @Description: 
 */
/*
 * @Author: QyInvoLing
 * @Date: 2023-05-11 15:18:41
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-11 15:20:00
 * @FilePath: \michanDaily\src\types\MemberIllustRaw.ts
 * @Description: 
 */
export type MemberIllustRaw = {
    user: User;
    illusts?: (IllustEntity)[] | null;
    next_url: string;
}
export type User = {
    id: number;
    name: string;
    account: string;
    profile_image_urls: ProfileImageUrls;
    is_followed: boolean;
    is_access_blocking_user: boolean;
}
export type ProfileImageUrls = {
    medium: string;
}
export type IllustEntity = {
    id: number;
    title: string;
    type: string;
    image_urls: ImageUrls;
    caption: string;
    restrict: number;
    user: User;
    tags?: (TagsEntity)[] | null;
    tools?: (string)[] | null;
    create_date: string;
    page_count: number;
    width: number;
    height: number;
    sanity_level: number;
    x_restrict: number;
    series?: null;
    meta_single_page: MetaSinglePage;
    meta_pages?: (MetaPagesEntity | null)[] | null;
    total_view: number;
    total_bookmarks: number;
    is_bookmarked: boolean;
    visible: boolean;
    is_muted: boolean;
    total_comments: number;
    illust_ai_type: number;
    illust_book_style: number;
}
export type ImageUrls = {
    square_medium: string;
    medium: string;
    large: string;
}
export type TagsEntity = {
    name: string;
    translated_name?: string | null;
}
export type MetaSinglePage = {
    original_image_url?: string | null;
}
export type MetaPagesEntity = {
    image_urls: ImageUrls1;
}
export type ImageUrls1 = {
    square_medium: string;
    medium: string;
    large: string;
    original: string;
}

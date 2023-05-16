import logger from "@/lib/logger"

class FlarumInterface {
    //登录之前
    loggedIn: boolean = false
    username: string
    password: string

    url: string
    headers: {
        [key: string]: string | number
    }
    /**
     * 首先登录，POST /api/token
     * @param username 
     * @param password 
     * @returns 
     */
    async login() {
        logger.info("Connecting to flarum......")
        try {
            let response = await fetch(`${this.url}/api/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "identification": this.username,
                    "password": this.password
                })
            }).then(res => res.json())

            this.headers = {
                "Authorization": `Token ${response.token}`
            }
        } catch (e) {
            throw "Cannot connect to Flarum."
        }
        // Flarum 返回的报错
        if (this.headers.hasOwnProperty("errors")) {
            throw "Invalid username or password."
        }
        this.headers["Content-Type"] = "application/json"
        this.loggedIn = true
    }
    /**
     * 填入
     * @param url Flarum地址，形如https://flarum.org
     * @param username 
     * @param password 
     */
    constructor(url: string, username: string, password: string) {
        this.url = url
        this.username = username
        this.password = password
    }
    /**
     * 获取主题信息，返回结构与发布后返回的信息相同
     * GET /api/discussions/:id
     * @param id Discussion 的 id
     */
    async getDiscussion(id: number) {
        let res = await fetch(`${this.url}/api/discussions/${id}`, {
            method: "GET",
            headers: this.headers as HeadersInit,
        }).then(res => res.json())
        return res
    }
    /**
     * 新主题 POST /api/discussions
     * @param content 主题帖内容
     */
    async newDiscussion(title: string, content: string, tags: number[] = [1]) {
        let data = {
            "data": {
                "type": "discussions",
                "attributes": {
                    "title": title,
                    "content": content,
                    "isAnonymous": false
                },
                "relationships": {
                    "tags": {
                        "data": [

                        ]
                    }
                }
            }
        }
        //填充tags
        tags.map(i => {
            data.data.relationships.tags.data.push({
                "type": "tags",
                "id": `${i}`
            })
        })
        let res = await fetch(`${this.url}/api/discussions`, {
            method: "POST",
            headers: this.headers as HeadersInit,
            body: JSON.stringify(data)
        }).then(res => res.json())
        logger.info(`New flarum post id: ${res.data.id}`)
    }
    /**
     * 删除主题 DELETE /api/discussions/:id
     * 普通用户没有权限
     * @param id Discussion 的 id
     */
    async deleteDiscussion(id: number) {
        let data = {
            "data": {
                "type": "discussions",
                "attributes": {
                    "isHidden": true
                },
                "id": `${id}`
            }
        }
        let res = await fetch(`${this.url}/api/discussions/${id}`, {
            method: "DELETE",
            headers: this.headers as HeadersInit,
            body: JSON.stringify(data)
        }).then(res => res.json())
        logger.info(`Removed flarum post . ID: ${JSON.stringify(res)}`)
    }
    /**
     * 修改主题标题和内容，建议显式指定参数
     * @param id Discussion 的 id
     * @param title 
     * @param content 
     */
    async patchDiscussion(id: number, title: string = "", content: string = "") {

        let discussionData = await this.getDiscussion(id)
        let mainPost = this.getMainPost(discussionData)
        let mainPostID = mainPost.id
        logger.info(`Patching discussion ${id}, whose main post id is ${mainPostID}`)
        //先修改标题
        await this.patchDiscussionTitle(id, title)
        //然后修改主楼内容
        let newPostContent = {
            "data": {
                "type": "posts",
                "attributes": {
                    "content": content == "" ? mainPost.attributes.content : content
                },
                "id": `${mainPostID}`
            }
        }
        
        let res = await fetch(`${this.url}/api/posts/${mainPostID}`, {
            method: "PATCH",
            headers: this.headers as HeadersInit,
            body: JSON.stringify(newPostContent)
        }).then(res => res.json())
        logger.info(`Patched flarum post ${mainPostID}'s content.`)
    }
    /**
     * 修改主题标题
     * @param id Discussion 的 ID
     * @param title 
     */
    async patchDiscussionTitle(id: number, title: string) {
        let data = {
            "data": {
                "type": "discussions",
                "attributes": {
                    "title": `${title}`
                },
                "id": `${id}`
            }
        }
        let res = await fetch(`${this.url}/api/discussions/${id}`, {
            method: "PATCH",
            headers: this.headers as HeadersInit,
            body: JSON.stringify(data)
        }).then(res => res.json())
        logger.info(`Patched flarum discussion ${id}'s title to ${title}.`)
    }
    /**
     * 新回复 POST /api/posts
     */
    async newPost(id: number, content: string) {
        let data = {
            "data": {
                "type": "posts",
                "attributes": {
                    "content": content,
                    "isAnonymous": false
                },
                "relationships": {
                    "discussion": {
                        "data": {
                            "type": "discussions",
                            "id": `${id}`
                        }
                    }
                }
            }
        }
        let res = await fetch(`${this.url}/api/posts`, {
            method: "POST",
            headers: this.headers as HeadersInit,
            body: JSON.stringify(data)
        }).then(res => res.json())
        logger.info(`Posted a new reply in discussion id.`)
    }
    /**
     * 删除回复 POST /api/posts
     * @param id  Post 的 id
     */
    delPost(id: number) {

    }

    getMainPost(data: any) {
        let mainPost = data.included.filter((item) => {
            if (item.type == "posts" && item.attributes.number == 1) {
                return true
            }
            return false
        })[0]
        return mainPost
    }
}
export default FlarumInterface

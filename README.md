<!--
 * @Author: QyInvoLing
 * @Date: 2023-05-10 14:41:02
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-16 17:37:57
 * @FilePath: \michanDaily\README.md
 * @Description: 
-->
# michan日报

## 功能
提供日报功能。可以定时/手动/预先产生当日的日报，并且发往各个推送渠道。

日报内含多个自定义栏目，自动化生成。

## 架构
### 内容生成
> 编写了若干个已实现的服务，向服务提供对应的配置即可生成。
#### Pixiv 画师新图服务
> 抓取配置文件内所有画师*昨天*发布的新作
#### B站视频投稿服务

### 推送
> 提供实现好的 Miao-Yunzai 和 Flarum 推送
#### bot 群推送
没实现好，别急
#### Flarum 推送
## 部署
1. clone 本项目
2. 安装 Node.js 和 pnpm
3. 执行如下命令：`pnpm install`
## 使用
在config目录下，复制你需要的*.example.toml并重命名为*.toml。这些是你需要填写的配置文件。

填写好必须的配置文件后，执行`pnpm start`即可开始运行。
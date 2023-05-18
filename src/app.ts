/*
 * @Author: QyInvoLing
 * @Date: 2023-05-10 14:47:07
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-18 16:18:13
 * @FilePath: \michanDaily\src\app.ts
 * @Description: 
 */
//程序入口处必须用cjs的方式引入它，否则tsc之后的程序无法识别相对路径
require('module-alias/register')
// import PixivPuller from "@/services/puller/Pixiv/main"
import logger from './lib/logger';
import * as fs from 'fs';
import * as path from 'path';
import Puller from "./services/puller/Puller";
import Generator from './services/generator/Generator';
import { dir } from 'console';
import Pusher from './services/pusher/Pusher';
import Service from './types/Service';

//首先，让puller全数工作，将结果缓存到cache/pulled中
//然后，让generator全数工作，将结果缓存到cache/generated中
//再接着，让pusher检查cache/generated中有没有pull后generate好的东西，没就调用所需的generator生成并缓存，然后推送
//最后，清空cache下子目录内的所有文件

const runService = async <T extends Service>(name: string) => {
    const servicePath = path.join(__dirname, 'services', `${name.toLowerCase()}`);
    const serviceDirs = fs.readdirSync(servicePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());

    const serviceInstances: T[] = serviceDirs.map(dirent => {
        const serviceName = dirent.name;
        const serviceModulePath = path.join(servicePath, serviceName, 'main');
        const serviceClass = require(serviceModulePath).default;
        return new serviceClass();
    });

    logger.info(`${name} loaded successfully. Total: ${serviceInstances.length}`);
    //运行所有Service的start方法
    await Promise.all(serviceInstances.map(i => i.start()))

}
/**
 * 运行结束，清空cache目录
 */
const clearCache = () => {
    const emptyDirectory = (directoryPath: string) => {

        // 读取目录中的文件列表
        const files = fs.readdirSync(directoryPath);

        // 遍历文件列表并删除每个文件
        files.forEach((file) => {
            const filePath = `${directoryPath}/${file}`;

            // 判断文件是否是目录
            const isDirectory = fs.statSync(filePath).isDirectory();

            if (isDirectory) {
                // 递归清空子目录
                emptyDirectory(filePath);
            } else {
                // 删除文件
                fs.unlinkSync(filePath);
            }
        })
        logger.info(`Cleared cache in ${directoryPath}`)
    }
    const cachePullerPath = path.resolve("cache/pulled")
    const cacheGeneratorPath = path.resolve("cache/generated")
    emptyDirectory(cachePullerPath)
    emptyDirectory(cacheGeneratorPath)
}
const main = async (args: string[]) => {
    const debugMode = args.findIndex(arg => arg === '--debug') != -1;
    await runService(Puller.name)
    await runService(Generator.name)
    await runService(Pusher.name)
    if (!debugMode) {
        clearCache()
    }

}
const args = process.argv.slice(2)
main(args)
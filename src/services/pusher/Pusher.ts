/*
 * @Author: QyInvoLing
 * @Date: 2023-05-16 08:40:21
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-17 15:13:37
 * @FilePath: \michanDaily\src\services\pusher\Pusher.ts
 * @Description: 
 */
import { readFileSync } from 'fs'
import * as TOML from '@ltd/j-toml';
import logger from '@/lib/logger';
import Service from '@/types/Service';
abstract class Pusher extends Service{
    name: string
    enabled: boolean
    config: ReturnType<typeof TOML.parse>
    abstract run(): void
    constructor() {
        super()
        this.name = this.constructor.name
        this.loadConfig()
    }
    loadConfig() {//将配置文件加载到config字段，将启用/禁用加载到enabled字段
        try {
            const rawConfigFile = readFileSync(`@/../config/Pusher/${this.constructor.name}.toml`, 'utf8');
            let toml = TOML.parse(rawConfigFile,'\n')
            this.enabled = toml.enabled as boolean
            this.config = toml
        } catch (err: any) {
            this.enabled = false
            logger.info(`Invalid config for pusher ${this.constructor.name}. Details: ${err}`)
        }
    }
    async start() {
        if (this.enabled) {
            logger.info(`Pusher ${this.constructor.name} starts.`)
            try {
                await this.run()
                logger.info(`Pusher ${this.constructor.name} finished.`)
            } catch (e) {
                logger.info(`Pusher ${this.constructor.name} came across an error:${e}`)
            }
        }else{
            logger.info(`Pusher ${this.constructor.name} is disabled.`)
        }


    }
}
export default Pusher
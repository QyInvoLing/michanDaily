/*
 * @Author: QyInvoLing
 * @Date: 2023-05-10 15:06:05
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-16 15:06:23
 * @FilePath: \michanDaily\src\services\puller\Puller.ts
 * @Description: 
 */
import { readFileSync } from 'fs'
import * as TOML from '@ltd/j-toml';
import logger from '@/lib/logger';
abstract class Puller {
    name: string
    enabled: boolean
    config: ReturnType<typeof TOML.parse>
    abstract run(): void
    constructor() {
        this.name = this.constructor.name
        this.loadConfig()
    }
    loadConfig() {//将配置文件加载到config字段，将启用/禁用加载到enabled字段
        try {
            const rawConfigFile = readFileSync(`@/../config/puller/${this.constructor.name}.toml`, 'utf8');
            let toml = TOML.parse(rawConfigFile)
            this.enabled = toml.enabled as boolean
            this.config = toml
            return "success"
        } catch (err: any) {
            this.enabled = false
            return "invalid_config"
        }
    }
    async start(){
        if (this.enabled) {
            logger.info(`Puller ${this.constructor.name} starts.`)
            try {
                await this.run()
                logger.info(`Puller ${this.constructor.name} finished.`)
            } catch (e) {
                logger.info(`Puller ${this.constructor.name} came across an error:${e}`)
            }
        }else{
            logger.info(`Puller ${this.constructor.name} is disabled.`)
        }
        
    }
}
export default Puller
/*
 * @Author: QyInvoLing
 * @Date: 2023-05-15 16:12:31
 * @LastEditors: QyInvoLing
 * @LastEditTime: 2023-05-18 16:22:07
 * @FilePath: \michanDaily\src\services\generator\Generator.ts
 * @Description: 
 */
import { readFileSync } from 'fs'
import * as TOML from '@ltd/j-toml';
import logger from '@/lib/logger';
import Service from '@/types/Service';
abstract class Generator extends Service{
    name: string
    enabled: boolean
    config: ReturnType<typeof TOML.parse>
    abstract run(): void
    constructor() {
        super()
        this.name = this.constructor.name
        this.loadConfig()
    }
    /**
     * 将配置文件加载到config字段，将启用/禁用加载到enabled字段
     * @returns 
     */
    loadConfig() {
        try {
            const rawConfigFile = readFileSync(`@/../config/generator/${this.constructor.name}.toml`, 'utf8');
            let toml = TOML.parse(rawConfigFile, '\n')
            this.enabled = toml.enabled as boolean
            this.config = toml
        } catch (err: any) {
            this.enabled = false
            logger.info(`Invalid config for generator ${this.constructor.name}. Details: ${err}`)
        }
    }
    async start() {
        if (this.enabled) {
            logger.info(`Generator ${this.constructor.name} starts.`)
            try {
                await this.run()
                logger.info(`Generator ${this.constructor.name} finished.`)
            } catch (e) {
                logger.info(`Generator ${this.constructor.name} came across an error:${e}`)
            }
        } else {
            logger.info(`Generator ${this.constructor.name} is disabled.`)
        }

    }
}
export default Generator
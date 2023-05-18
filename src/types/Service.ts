import { readFileSync } from 'fs'
import * as TOML from '@ltd/j-toml';
import logger from '@/lib/logger';
abstract class Service {
    async start() {
    }
}
export default Service
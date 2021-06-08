/* eslint-disable no-undef */

import { merge } from 'lodash'
import * as devEnv from './dev'
import * as testEnv from './test'


const env = process.env.PORT || 'development'

const baseConfig = {
    env,
    isDev: env === 'development',
    isTest: env === 'testing',
    port: 3002,
    secrets: {
        jwt: process.env.JWT_SECRET,
        jwtExp: '100d',
    },
}

let envConfig = {}

switch (env) {
    case 'dev':
    case 'development':
        envConfig = devEnv.config
        break
    case 'test':
    case 'testing':
        envConfig = testEnv.config
        break
    default:
        envConfig = devEnv.config
}

export default merge(baseConfig, envConfig)

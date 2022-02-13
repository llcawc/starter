// main.js

import { name, version } from '../../../package.json'
import data from './data.json'

console.log('Package name:', name, 'Version:', version)
console.log(data.text, '\ndata.json ...', JSON.stringify(data))

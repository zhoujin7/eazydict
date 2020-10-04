'use strict'

const debug = require('debug')('eazydict:core:lookup')
const filter = require('./lib/filter')
const lookupCli = require('./cli/lookup2')
const online = require("./online");

/**
 * 单词查询
 */

async function lookup(words) {

  /* eslint-disable no-param-reassign */

  words = Array.isArray(words) ? words : [words]
  words = words
    .map(word => word.trim())
    .join(' ')
    .slice(0, 240) // 限制长度


  /* eslint-enable no-param-reassign */

  debug('words: %s', words)

  try {
    const onlineData = await online(words)
    const outputData = filter(onlineData)
    const output = lookupCli(outputData, 1000)

    console.log(output)

  } catch (err) {
    console.error(err)
  }
}

module.exports = lookup

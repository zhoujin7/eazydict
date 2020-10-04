'use strict'

/* eslint-disable max-params */

const stringBreak = require('string-break')
const {pad, icon} = require('../utils')

let windowWidth


/**
 * 高亮关键字
 */

function highlight(str, words) {
  const regexp = new RegExp(words, 'ig')

  return str.replace(regexp, substr => {
    return `<span class="red">${substr}</span>`
  })
}

/**
 * 格式化例句
 */

function formatExample(str, words, firstLineIndent, indent) {
  const exampleWidth = windowWidth - 14

  // 兼容 windows 上 git-bash 等
  if (exampleWidth <= 0) {
    return firstLineIndent + str
  }

  return stringBreak(str, exampleWidth)
    .map((line, index) => {
      let highlightLine = highlight(line, words)

      return index === 0 ? firstLineIndent + highlightLine : indent + highlightLine
    })
    .join('<br>\n')
}

function main(data, width) {
  let result = ['']
  let count = 0

  windowWidth = width

  // 输出翻译信息
  data.forEach(item => {
    const pluginName = item.pluginName
    const url = item.url

    const hasPhonetics = item.phonetics && item.phonetics.length
    const hasTranslates = item.translates && item.translates.length
    const hasExamples = item.examples && item.examples.length

    /**
     * 标题
     */
    if (hasPhonetics || hasTranslates || hasExamples) {
      result.push(`<p class="plugin-name"><span class="bold">${icon.circle}</span>&nbsp;&nbsp;&nbsp;&nbsp;<a class="blue bold" href="${url}"><span>${pluginName}</span></a></p>`)
      count++
    }

    /**
     * 音标
     */
    if (hasPhonetics) {
      let phoneticLine = ''

      item.phonetics.forEach(phonetic => {
        const value = phonetic.value

        if (phonetic.type) {
          const type = phonetic.type
          phoneticLine += `<span class="red">${type}</span> <span class="gray bold">${value}</span>&nbsp;&nbsp;`
        } else {
          phoneticLine += `<span class="bold">${value}</span>&nbsp;&nbsp;`
        }
      })

      result.push(`<p>${phoneticLine}</p>`)
    }

    /**
     * 翻译
     */
    if (hasTranslates) {
      item.translates.forEach(translate => {
        const trans = translate.trans

        if (translate.type) {
          const type = pad(translate.type,  8,'&nbsp;')
          result.push(`<p><span class="yellow">${type}</span> ${trans}</p>`)
        } else {
          result.push(`<p>${trans}</p>`)
        }
      })
    }

    /**
     * 例句
     */
    if (hasExamples) {
      result.push(`<p><span class="green">例句:</span></p>`)

      item.examples.forEach(example => {
        const fromFirstLineIndent = `<span class="yellow bold">+</span> `
        const toFirstLineIndent = `<span class="green bold">-</span> `
        const indent = '&nbsp;&nbsp;'

        const fromStr = formatExample(example.from, item.words, fromFirstLineIndent, indent)
        const toStr = formatExample(example.to, item.words, toFirstLineIndent, indent)

        result.push(`<p>${fromStr}</p>`)
        result.push(`<p>${toStr}</p>`)
      })
    }
  })

  if (!count) {
    result = 'Not Found'
    return result
  }

  const style = `<style type="text/css">
  p {margin-left: 20px;}
  .plugin-name {margin-left: 0;}
  .blue {color:#4472C4;}
  .red {color:#CD0000;}
  .gray {color:#808080;}
  .bold {font-weight:600;}
  .green {color:#00CD00;}
  .yellow {color:#BF8F00;}
</style>`
  return style + result.join('\n')
}

module.exports = main

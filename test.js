var unified = require('unified')
var markdown = require('remark-parse')
var remark2rehype = require('remark-rehype')
var html = require('rehype-stringify')

function tokenizer(eat, value, silent) {
  self = this
  var start = />>>\n/g
  var split = /<<<\n/
  var begin = start.exec(value)
  var close = start.exec(value)
  var split = split.exec(value)
  if (begin && begin["index"] == 0 && close) {
    if (silent) {
      return true
    }
    var enclosed = value.slice(0, close["index"] + close[0].length)
    var lvalue, rvalue
    if (split) {
      lvalue = value.slice(begin[0].length, split["index"])
      rvalue = value.slice(split["index"] + split[0].length, close["index"])
    } else {
      lvalue = value.slice(begin[0].length, close["index"])
      rvalue = ""
    }
    var now = eat.now()
    return eat(enclosed)({
      type: 'twocol',
      data: {
        hName: 'div',
        hProperties: {
          className: "twocol",
        }
      },
      children: [
        {
          type: 'lcol',
          data: {
            hName: 'div',
            hProperties: {
              className: "lcol",
            }
          },
          children: self.tokenizeBlock(lvalue, now)
        },
        {
          type: 'rcol',
          data: {
            hName: 'div',
            hProperties: {
              className: "rcol",
            }
          },
          children: self.tokenizeBlock(rvalue, now)
        },
      ],
    })
  }
}

function twocolPlugin(options = {}) {
  var Parser = this.Parser
  var tokenizers = Parser.prototype.blockTokenizers
  var methods = Parser.prototype.blockMethods
  tokenizers["twocol"] = tokenizer
  // methods.splice(methods.indexOf("newline"), 0, "twocol")
  methods.splice(0, 0, "twocol")
}


var processor = unified()
  .use(markdown, {commonmark: true})
  .use(remark2rehype)
  .use(html)
  .use(twocolPlugin)

tree = processor.processSync(`Independent titletext

>>>

This is not a test
<<<
- 1
- 2
>>>
3`)["contents"]
console.log(tree)
// console.log(tree["children"][1]["children"][1]["children"])

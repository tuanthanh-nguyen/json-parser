import assert from "node:assert"

class JSONParser {
  constructor(jsonString) {
    this.jsonString = jsonString.trim()
    this.index = 0
  }

  parse() {
    return this.parseValue()
  }

  parseValue() {
    const c = this.jsonString.charAt(this.index)
    if (c === "{") {
        return this.parseObject()
    } else if (c === "[") {
        return this.parseArray()
    } else if (c === "\"") {
        return this.parseString()
    } else if (isDigit(this.jsonString.charAt(this.index))) {
      return this.parseNumber()
    } else if ( c === "t" || c === "f") {
        return this.parseBoolean()
    } else if (c === "n") {
      return this.parseNull()
    } else throw new Error("invalid syntax")
  }

  parseObject() {
    this.index++
    const obj = {}
    while(true) {
      this.consumeWhitespace()
      if (this.jsonString.charAt(this.index) === "}") {
        this.index++
        break
      }
      const key = this.parseString()

      this.consumeWhitespace()
      this.consumeColon()
      this.consumeWhitespace()

      const value = this.parseValue()
      obj[key] = value
      this.consumeWhitespace()
      if (this.jsonString.charAt(this.index) === "}") {
        this.index++
        break
      }
      this.consumeSemi()
    }
    return obj
  }

  parseArray() {
    this.index++
    const arr = []

    while(true) {
      this.consumeWhitespace()
      if (this.jsonString.charAt(this.index) === "]") {
        this.index++
        break
      }
      const value = this.parseValue()
      arr.push(value)

      this.consumeWhitespace()
      if (this.jsonString.charAt(this.index) === "]") {
        this.index++
        break
      }
      this.consumeSemi()
    }
    return arr
  }

  parseString() {
    this.index++
    const start = this.index
    while(this.jsonString.charAt(this.index) !== '"') {
      this.index++
    }
    const end = this.index
    this.index++
    const str = this.jsonString.slice(start, end)
    return str
  }

  parseNumber() {
    const start = this.index
    while(isDigit(this.jsonString.charAt(this.index))) {
      this.index++
    }
    const end = this.index
    return Number(this.jsonString.slice(start, end))
  }

  parseBoolean() {
    if (this.jsonString.charAt(this.index) === "t") {
      this.index += 4
      return true
    } else {
      this.index += 5
      return false
    }
  }

  parseNull() {
    this.index += 4
    return null
  }

  consumeWhitespace() {
    while(this.jsonString.charAt(this.index) === " ") {
      this.index++
    }
  }

  consumeSemi() {
    this.index++
  }

  consumeColon() {
    this.index++
  }
}

function isDigit(str) {
  return "0123456789".includes(str)
}

const parser = new JSONParser('{"oo":[12, true, false, [{"bar": {      "baz": [12,23], "fooppp": 12 } }]] }')
const parsed = parser.parse()
console.log(parsed)

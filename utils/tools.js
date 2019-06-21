
export default {
  //处理字数方法
  countLength(str) {
    if (str < 9999) {
      return str + "字"
    } else {
      return Math.round(parseFloat(str / 10000)) + "万字"
    }
  },

  //处理追书人数
  userLeng(str) {
    if (str < 9999) {
      return str + "人"
    } else {
      return parseFloat(str / 10000).toFixed(1) + "万"
    }
  },

  //处理评分的方法
  scores(num) {
    return num.toFixed(1)
  }
}
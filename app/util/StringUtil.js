/**
 * 判断字符串不为空的函数
 * 原因:
 * let img = "";
 console.log( img && (img.length > 0) );
 返回结果是 "" (空白字符串), 等价于 true, 会导致后续代码执行.
 * @param str
 */
export default function notEmpty(str) {
    return (str !== null) && (str !== undefined) && (str.length >= 0);
}
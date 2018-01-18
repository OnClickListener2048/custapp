/**
 * 判断字符串不为空的函数
 * @param str
 */
export default function notEmpty(str) {
    return (str !== null) && (str !== undefined) && (str.length >= 0);
}
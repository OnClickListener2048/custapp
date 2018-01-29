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

/**
 * 判断手机号是否有效的函数, 11, 12之外的基本上都认为是手机号. +86的也是合法输入.
 * 此函数的导入使用方法: import {isMobile} from './util/StringUtil'; 不要使用默认导入!
 * import isMobile from './util/StringUtil'; 实际上运行的是 notEmpty(str).
 * @param str
 * @returns {*|boolean}
 */
export function isMobile(str) {
    let regex = /^((\+)?86|((\+)?86)?)0?1[345789]\d{9}$/;

    // return notEmpty(str) && ((str.match(/^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/)) !== null);
    return notEmpty(str) && regex.test(str);
}
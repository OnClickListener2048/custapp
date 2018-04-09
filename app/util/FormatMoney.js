/**
 * Created by jiaxueting on 2018/4/9.
 * 金额格式化,让数字的千分位用,分隔
 */
export function formatmoney(number) {
    let fmoney = number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');//使用正则替换，每隔三个数加一个','
    return fmoney;
}
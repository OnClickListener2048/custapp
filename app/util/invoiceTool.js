/**
 * Created by zhuangzihao on 2018/3/5.
 */
/**
 * Created by jiaxueting on 2018/1/11.
 * 获取发票类型fplx
 * 增值税专用发票：01
 * 货运运输业增值税专用发票：02
 * 机动车销售统一发票：03
 * 增值税普通发票：04
 * 增值税普通发票（电子）：10
 * 增值税普通发票（卷式）：11
 */
function getReceiptType (code) {
    let subCode = '';
    let type = '99';
    let CODE_MAP = ['144031539110', '131001570151', '133011501118', '111001571071'];

    if (code.length === 12) {
        subCode = code.substring(7, 8);
        for (let i = 0; i < CODE_MAP.length; i++) {
            if (code === CODE_MAP[i]) {
                type = '10';
                break;
            }
        }

        if (type === '99') {  // 增加判断，判断是否为新版电子票
            if (code.charAt(0) === '0' && code.substring(10, 12) === '11') {
                type = '10';
            }
            if (code.charAt(0) === '0' && (code.substring(10, 12) === '06' || code.substring(10, 12) === '07')) {  // 判断是否为卷式发票  第1位为0且第11-12位为06或07
                type = '11';
            }
        }

        if (type === '99') { // 如果还是99，且第8位是2，则是机动车发票
            if (subCode === '2' && code.charAt(0) !== '0') {
                type = '03';
            }
        }
    } else if (code.length === 10) {
        subCode = code.substring(7, 8);
        if (subCode === '1' || subCode === '5') {
            type = '01';

        } else if (subCode === '6' || subCode === '3') {
            type = '04';

        } else if (subCode === '7' || subCode === '2') {
            type = '02';

        }
    }
    return type;
}
function addressAndPhone(str) {
    //地址与电话之间有空格区分
    if(str){
        let arr = str.replace(/\s+/g, ' ').split(" ");
        return{
            address:arr[0]?arr[0]:'',
            phone:arr[1]?arr[1]:''
        }
    }else{
        return {
            address:'',
            phone:''
        }
    }

}
function bankAddressAndAccount(str) {
    if(str){

        let arr = str.match(/([\u4e00-\u9fa5]{0,}\s{0,})(\d{0,})/)
        return{
            address:arr[1],
            account:arr[2]
        }
    }else{
        return{
            address:'',
            account:''
        }
    }
}

function checkStr(str) {

    if(str){
        if (str.length == 0){
            return false
        }
        if (str.replace(/(^s*)|(s*$)/g, "").length ==0){
            return false
        }
        let string = str.trim();
        if (string.length == 0) {
            return false
        }
        return true
    }else{
        return false
    }

}

module.exports = {
    getReceiptType: getReceiptType,
    bankAddressAndAccount:bankAddressAndAccount,
    addressAndPhone:addressAndPhone,
    checkStr:checkStr
}
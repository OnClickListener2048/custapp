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

module.exports = {
    getReceiptType: getReceiptType,
}
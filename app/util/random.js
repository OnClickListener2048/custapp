/**
 * 生成指定位数的随机数
 * @param bits
 */
export default function random(bits) {
    if(bits < 0) {
        bits = 0;
    }

    let rand = '';
    for(let i = 0; i < bits; i++) {
        rand += Math.floor(Math.random() * 10);
    }
    return rand;
}

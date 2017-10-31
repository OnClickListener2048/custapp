/**
 * 对网络层的错误信息进行统一加工.
 */
export default function errorText(e) {
    if(e === null || e === undefined) {
        return null;
    }

    if(e instanceof  Error) {
        return e.message;
    }

    let {msg, code} = e;

    console.log('errorText msg=', msg);
    console.log('errorText code=', code);

    if (msg !== undefined) {
        if (code !== undefined) {
            if(code === '4009') {
                return msg;
            } else {
                return msg;
            }
        }
    }

    return msg;
}
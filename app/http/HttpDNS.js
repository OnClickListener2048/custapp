import './HTTPBase';
export default class HttpDNS extends Object {
    static async parseDNS(host:string):string {
        try {
            let ip = await global.HTTPBase.getRaw("http://119.29.29.29/d", {dn:host});
            if(ip !== null && ip.length > 0) {
                return ip;
            }
        } catch (e) {
            console.log('tencent httpdns failure', e);
            return host;
        }

        return host;
    }
}
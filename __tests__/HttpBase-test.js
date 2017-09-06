import '../app/http/HTTPBase';
import HttpDNS from '../app/http/HttpDNS';
import 'isomorphic-fetch';

it('can fetch httpdns response', async () => {
    let text = await global.HTTPBase.getRaw("http://119.29.29.29/d", {dn:"app.i-counting.cn"});
    expect(text).toEqual("47.94.123.10");
});

it('httpdns parseDNS correct', async () => {
    let text = await HttpDNS.parseDNS("app.i-counting.cn");
    expect(text).toEqual("47.94.123.10");
});
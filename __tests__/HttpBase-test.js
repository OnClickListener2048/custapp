import 'isomorphic-fetch';
import HTTPBase from '../app/http/HTTPBase';
import HttpDNS from '../app/http/HttpDNS';
import * as apis from '../app/apis';

it('can fetch httpdns response', async () => {
    let text = await HTTPBase.getRaw("http://119.29.29.29/d", {dn: "app.i-counting.cn"});
    expect(text).toEqual("47.94.123.10");
});

it('httpdns parseDNS correct', async () => {
    let text = await HttpDNS.parseDNS("app.i-counting.cn");
    expect(text).toEqual("47.94.123.10");
});

it('get test', async () => {
    apis.loadHomeData().then(
        (responseData) => {

            console.log('responseData', responseData)

        },
        (e) => {

            console.log('出错了', e)

        },
    );
});

it('wechatToken test', async () => {
    apis.wechatToken('0').then(
        responseData => {
            console.log('UAA responseData', responseData);
            // Toast.show(responseData);
        },
        e => {
            console.log('出错了', e);
        }
    );
});


it('getVerifyVCodeImage test', async () => {
    apis.getVerifyVCodeImage('13810397064', 1).then(
        data => {
            let picURL = {uri: 'data:image/jpeg;base64,' + response.img};
        },
        e => {

        }
    );
});

it('发送手机验证码 test', async () => {
    apis.sendVerifyCode('13810397064', 1, 'g2vg').then(
        data => {
            console.log(data);
        },
        e => {

        }
    );
});


it('feed test', async () => {


    // const form = new FormData();
    // form.append('tel', 123);
    //
    // fetch('http://localhost:8080', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'multipart/form-data'
    //     },
    //     body: form
    // })
    //     .then((res) => {
    //         res.text().then(
    //             text => console.log(text),
    //             e => console.log(e)
    //         );
    //     });

    // fetch('http://localhost:8080', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     body: `tel=1234`
    // })
    //     .then((res) => {
    //         res.text().then(
    //             text => console.log(text),
    //             e => console.log(e)
    //         );
    //     });

    apis.submitFeedBack('注册公司', '北京','名字','13522807924', 'g2vg').then(
        data => {
            console.log(data);
        },
        e => {

        }
    );
});
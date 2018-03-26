/**
 * 基础的Http功能封装.
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Headers
 * https://developer.mozilla.org/en-US/docs/Web/API/Response
 * node_modules/node-fetch/lib/response.js
 * https://developer.mozilla.org/en-US/docs/Web/API/Request
 * http://www.jianshu.com/p/ccf99a12faf1
 * https://github.com/rebeccahughes/react-native-device-info 设备信息
 *
 * Created by beansoft on 17/5/22.
 */


import {Http} from 'react-native-http';
import HttpAdapterCustApp from './HttpAdapterCustApp';
import TestHttpAdapter from '../../__mocks__/TestHttpAdapter';

if(global._JEST) {
    console.log("JEST 测试模式, Http will use TestHttpAdapter");
    Http.setAdapter(new TestHttpAdapter());
} else {
    Http.setAdapter(new HttpAdapterCustApp());
}

Http.timeout = 10*1000;// 10秒超时
Http.setEnableLog(true, null);

export default Http;

// global.HTTPBase = HTTPBase;// 全局可用
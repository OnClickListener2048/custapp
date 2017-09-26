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

Http.setAdapter(new HttpAdapterCustApp());

export default Http;

// global.HTTPBase = HTTPBase;// 全局可用
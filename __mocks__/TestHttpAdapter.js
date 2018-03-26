import {HttpAdapter} from "react-native-http";
import {RN_VERSION} from "../app/config";
import {Platform} from 'react-native';

export default class TestHttpAdapter extends HttpAdapter {
    static enableLogin = true;// 是否启用登录, 设置为false则不会发送授权头信息
    // 自定义头信息
    async modifyHeaders (headers) : Object {
        let finalHeaders = new Headers();
        finalHeaders.append('userAgent', 'custapp'); // TODO 登录时的头信息, userAgent
        finalHeaders.append('platform', 'app');
        finalHeaders.append('client', Platform.OS);
        try {
            let token = '191c7e2d-b1ea-4956-801f-5cd647884904';
            if (token !== null && TestHttpAdapter.enableLogin){
                finalHeaders.append('Authorization', 'Bearer ' +  token);
            }
        } catch (error) {
        }

        if(headers) {
            // 获取 headers 内所有的 key
            let headersKeyArray = Object.keys(headers);
            // 通过 forEach 方法拿到数组中每个元素,将元素与参数的值进行拼接处理,并且放入 paramsArray 中
            headersKeyArray.forEach(key => finalHeaders.append(key, headers[key]));
        }
        return finalHeaders;
    }

    // 自定义表单参数
    async modifyParams(params): Object {
        let paramsArray = {};


        paramsArray.version = RN_VERSION;
        // 获取 params 内所有的 key
        let paramsKeyArray = Object.keys(params);
        // 通过 forEach 方法拿到数组中每个元素,将元素与参数的值进行拼接处理,并且放入 paramsArray 中
        paramsKeyArray.forEach(key => paramsArray[key] =  params[key] );
        return paramsArray;
    }

    // 通用的处理响应报文的业务方法
    async handleResponse(responseJson): Object {
        if(responseJson !== undefined  &&
            responseJson.hasOwnProperty('code')) {
            if ( responseJson.code === 0) {
                return responseJson;
            } else if ( responseJson.code === 401) {
                return Promise.reject(responseJson);
            }
        }
        console.log("后台响应报文有误");
        return Promise.reject(responseJson);
    }

    /**
     * 处理默认的Http错误信息, 确保msg不为空, 子类可以覆盖此行为.
     * @param response Response对象
     * @returns {{code: *, msg: *}}
     */
    makeErrorMsg (response) : Object {
        let json = super.makeErrorMsg(response);
        let {status, statusText} = response;

        if(status === 401) {
            // 401 转向登录页面
            DeviceEventEmitter.emit('goLoginPage', true);
            return {'code':  401, 'msg':  '登录'};
        }

        if(status === 500) {
            return {'code':  500, 'msg':  '内部错误,请稍后重试'};
        }

        return json;
    }

    isConnected() : boolean {
        return true;
    }
}
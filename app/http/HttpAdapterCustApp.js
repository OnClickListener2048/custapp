import {
    Platform, DeviceEventEmitter
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import '../util/NetInfoSingleton';
import {HttpAdapter} from "react-native-http";

export default class HttpAdapterCustApp extends HttpAdapter {
    // 自定义头信息
    async modifyHeaders (headers) : Object {
        let finalHeaders = new Headers();
        finalHeaders.append('userAgent', 'custapp'); // TODO 登录时的头信息, userAgent
        finalHeaders.append('platform', 'app');
        finalHeaders.append('client', Platform.OS);
        try {
            let token = await UserInfoStore.getUserToken();
            console.log('modifyParams token', token);
            // TODO debug
            // token = '26576795-30a8-43f4-861e-7820d736df30';
            if (token !== null){
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

        // try {
        //     let token = await UserInfoStore.getUserToken();
        //     console.log('modifyParams token', token);
        //     if (token !== null){
        //         paramsArray.token = token;
        //     } else {
        //         paramsArray.token = '0';// 给一个空token
        //     }
        // } catch (error) {
        // }

        paramsArray.version = DeviceInfo.getVersion();
        // paramsArray.deviceType = Platform.OS;
        // paramsArray.deviceId = DeviceInfo.getUniqueID();
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
                // Token无效时自动跳转到登录页
                DeviceEventEmitter.emit('goLoginPage', true);
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
        return NetInfoSingleton.isConnected;
    }
}
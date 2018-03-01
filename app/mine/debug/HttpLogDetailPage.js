/**
 * 调试标签页.
 * Created by liuchangjiong on 2018/1/29.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView, Platform,
    DeviceEventEmitter, PixelRatio
} from 'react-native';
import CommentCell from '../../view/CommenCell'
import SubmitButton from '../../view/SubmitButton'
import clearManager from 'react-native-clear-cache';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-root-toast'
import BComponent from '../../base';
import Alert from "react-native-alert";
import {DEBUG, API_BASE_URL} from '../../config'
import JPushModule from 'jpush-react-native';
import ActionSheet from 'react-native-actionsheet';
import SectionHeader from "../../view/SectionHeader";
import * as WeChat from 'react-native-wechat';
import fs from 'react-native-fs';

const PRIMARY_COLOR = "#3b3b3b";
const SELECT_COLOR = "#FFFF00";
const SEPERATOR_COLOR = "rgb(252, 217, 28)";
const SECONDARY_COLOR = "#FFFFFF";
const TEXT_COLOR = "#D6D6D6";
const LISTVIEW_REF = "listview";

export default class HttpLogDetailPage extends BComponent {

    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };

    constructor(props) {
        super(props);
        this.state = {
            cacheSize: "",
            unit: "",
            logined: false,// 是否已登陆
            updateIcon: this.props.updateIcon,
        };

        this.props.navigator.setButtons({
            leftButtons: [], // see "Adding buttons to the navigator" below for format (optional)
            // rightButtons: [], // see "Adding buttons to the navigator" below for format (optional)
            animated: false // does the change have transition animation or does it happen immediately (optional)
        });

        this._doWechatShare = this._doWechatShare.bind(this);

    }

    componentDidMount() {
    }


    _doWechatShare() {
        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {

                    let rootPath = Platform.OS === 'ios'? fs.DocumentDirectoryPath: fs.ExternalDirectoryPath;

                    // create a path you want to write to
                    let path = rootPath + '/_RNhttpLog.txt';
                    // write the file
                    fs.writeFile(path, HttpLogDetailPage.httpLogToString(this.props.data), 'utf8')
                        .then((success) => {
                            console.log('FILE WRITTEN!');

                            WeChat.shareToSession({
                                type: 'file',
                                title: 'Http请求日志.txt', // WeChat app treat title as file name
                                description: 'Http请求日志分享',
                                mediaTagName: 'txt file',
                                messageAction: undefined,
                                messageExt: undefined,
                                filePath: path,
                                fileExtension: '.txt'
                            });
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });

                    // WeChat.shareToSession({
                    //     type: 'text',
                    //     description: 'hello'
                    // }).catch((error) => {
                    //     Toast.show('分享失败' + error.message);
                    // });
                } else {
                    Toast.show('没有安装微信软件，请您安装微信之后再试')
                }
            });
    }

    static httpLogToString(httpLog) {
        let text = '';
        let resBody = httpLog.text;
        if (httpLog.responseContentType.includes('json')) {
            try {
                resBody = JSON.stringify(JSON.parse(resBody), null, 4);
            } catch (e) {

            }
        }

        if (httpLog) {
            text += 'URL: ' + httpLog.url + "\n";
            text += 'Method: ' + httpLog.method + "\n";
            text += 'Code: ' + httpLog.status + "\n";
            text += '总耗时: ' + httpLog.duration + " 毫秒\n";
            text += 'Content Type: ' + httpLog.responseContentType + " 毫秒\n";
            text += '响应内容长度: ' + httpLog.responseContentLength + " 字节\n";
            if (httpLog.errorMsg) {
                text += '错误信息: ' + httpLog.errorMsg + "\n";
            }
            text += '请求表单参数:\n' + HttpLogDetailPage.objectToString(httpLog.params);
            text += '响应头信息:\n' + httpLog.responseHeaders;
            text += '请求头信息:\n' + httpLog.requestHeaders;
            text += '响应信息:\n' + resBody;
        }

        return text;
    }

    render() {
        let httpLog = this.props.data;
        let color = httpLog.ok ? 'green' : 'red';
        let resBody = httpLog.text;
        if (httpLog.responseContentType.includes('json')) {
            try {
                resBody = JSON.stringify(JSON.parse(resBody), null, 4);
            } catch (e) {

            }
        }

        return (
            <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                <ScrollView>


                    <SubmitButton onPress={this._doWechatShare}
                                  isEnabled={httpLog}
                                  text="分享到微信"
                    />

                    <SectionHeader style={{backgroundColor: '#E8E2D6', marginTop: 10}} text={'概要'}
                                   textStyle={{color: 'black'}}/>

                    {
                        HttpLogDetailPage._renderLine('', httpLog.url, 0, color, 'left')
                    }

                    {
                        HttpLogDetailPage._renderLine('Method:', httpLog.method)
                    }

                    {
                        HttpLogDetailPage._renderLine('Code:', httpLog.status, 1, color)
                    }

                    {
                        HttpLogDetailPage._renderLine('总耗时:', httpLog.duration + ' 毫秒')
                    }

                    {
                        HttpLogDetailPage._renderLine('Content Type:', httpLog.responseContentType)
                    }

                    {
                        HttpLogDetailPage._renderLine('响应内容长度:', httpLog.responseContentLength + ' 字节')
                    }

                    {
                        HttpLogDetailPage._renderLine('错误信息:', httpLog.errorMsg, 1, color)
                    }

                    <SectionHeader style={{backgroundColor: '#E8E2D6'}} text={'请求表单参数'}
                                   textStyle={{color: 'black'}}/>
                    {
                        HttpLogDetailPage._renderLine(null, HttpLogDetailPage.objectToString(httpLog.params), 0, 'black', 'left')
                    }

                    <SectionHeader style={{backgroundColor: '#E8E2D6'}} text={'响应头信息'}
                                   textStyle={{color: 'black'}}/>
                    {
                        HttpLogDetailPage._renderLine(null, httpLog.responseHeaders, 0, 'black', 'left')
                    }

                    <SectionHeader style={{backgroundColor: '#E8E2D6'}} text={'请求头信息'}
                                   textStyle={{color: 'black'}}/>
                    {
                        HttpLogDetailPage._renderLine(null, httpLog.requestHeaders, 0, 'black', 'left')
                    }

                    <SectionHeader style={{backgroundColor: '#E8E2D6'}} text={'响应信息'}
                                   textStyle={{color: 'black'}}/>
                    {
                        HttpLogDetailPage._renderLine(null, resBody, 0, color, 'left')
                    }

                </ScrollView>
            </View>

        )
    }

    /**
     * Render a single line of data
     * @param title nullable
     * @param message nullable
     * @param numberOfLines 0 to unlimit
     * @param color
     * @param textAlign text align
     * @returns {*}
     * @private
     */
    static _renderLine(title, message, numberOfLines = 1, color = 'black', textAlign = 'right') {
        if (!message) return null;
        return (
            <View style={{
                flexDirection: "row",
                flex: 1,
                marginBottom: title ? 4 : 10,
                marginRight: 4,
                marginLeft: 4
            }}>
                <Text style={{marginRight: 5, fontWeight: 'bold'}}>{title}</Text>
                <Text
                    style={[
                        styles.logRowMessage,
                        styles.logRowMessageMain,
                        {
                            color: color,
                            textAlign: textAlign
                        },
                    ]}

                    numberOfLines={numberOfLines}>
                    {message}
                </Text>
            </View>
        )
    }

    /**
     * 将单层Object的信息转换为字符串.
     * @param obj
     * @returns {string}
     */
    static objectToString(obj: Object): string {
        let headerStr = '';

        if (obj) {
            // 获取 headers 内所有的 key
            let headersKeyArray = Object.keys(obj);
            // 通过 forEach 方法拿到数组中每个元素,将元素与参数的值进行拼接处理,并且放入 paramsArray 中
            headersKeyArray.forEach(key => {
                headerStr += (key + '=' + obj[key] + '\n');
            });
        } else {
            headerStr = '<无>';
        }

        return headerStr;
    }


    _httpLogView() {
        this.push({
            screen: 'HttpLogView',
            title: '查看HTTP接口请求日志',
            backButtonHidden: false, // 是否隐藏返回按钮 (可选)
            passProps: {
                updateIcon: this.state.updateIcon,
                //回调!
                callback: this._updateOpenOrClose,
            }
        });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: SECONDARY_COLOR,
        paddingTop: 5,
    },
    toolBar: {
        backgroundColor: SECONDARY_COLOR,
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 2,
        borderColor: PRIMARY_COLOR,
    },
    toolbarButton: {
        padding: 7,
        borderWidth: 2,
        borderRadius: 7,
        borderColor: PRIMARY_COLOR,
    },
    centerColumn: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    titleText: {
        fontWeight: "bold",
        fontFamily: "System",
        fontSize: 16,
        alignSelf: "center",
        textAlign: "center",
    },
    toolbarButtonText: {
        color: '#006FFF',
    },
    listContainer: {
        flex: 1,
    },
    debugRowContainer: {
        padding: 5,
        flex: 1,
        flexDirection: "row",
        backgroundColor: SECONDARY_COLOR,
        borderStyle: "solid",
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: PRIMARY_COLOR,
    },
    debugRowContainerButton: {
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
    },
    logRowMessage: {
        color: TEXT_COLOR,
        // fontFamily: "System",
        // fontSize: 12,
        // paddingHorizontal: 5,
        // lineHeight: 20,
    },
    logRowMessageBold: {
        fontWeight: "bold",
    },
    logRowLevelLabel: {
        minWidth: 80,
        fontWeight: "bold",
    },
    logRowMessageSeperator: {
        fontSize: 11,
        fontWeight: "bold",
        textAlign: "center",
        color: SEPERATOR_COLOR,
    },
    seperator: {
        fontSize: 18,
        color: SEPERATOR_COLOR,
    },
    logRowMessageMain: {
        flex: 1,
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    },
});
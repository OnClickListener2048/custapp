/**
 * Created by jinglan on 2017/6/28.
 */
import React, { Component,PropTypes } from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    WebView
} from 'react-native';
import BComponent from '../base';

export default class SystemMessagePage extends BComponent{
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };

    constructor(props) {
        super(props);
        this.stepsArr = [];
    }

    static propTypes = {
        contentJson: PropTypes.string
    };



    render() {
        // const contentJson = '<!DOCTYPE html>\n' +
        // '<html>\n' +
        // '<head>\n' +
        // '    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0" />\n' +
        // '</head>\n' +
        // '<body style="padding:15px;">\n' +
        // '    <div style="line-height:35px;">王小二：</div>\n' +
        // '    <div style="line-height:35px;text-indent: 2em;">你好！</div>\n' +
        // '    <div style="line-height:35px;width:100%;word-break: break-all; word-wrap:break-word;text-indent: 2em;"> 你在2017年07月20日的<u style="color:red;text-decoration:solid;">测试测试1公司</u>的<u style="color:red;text-decoration:solid;">通办任务2任务</u> 由<u style="color:red;text-decoration:solid;">腰围</u>取消，交由<u style="color:red;text-decoration:solid;">小风</u>处理，如有任何问题，请联系<u style="color:red;text-decoration:solid;">15010672217</u>！</div>\n' +
        // '</body>\n' +
        // '</html>' ;//this.props;
        const {contentJson} = this.props;

        let isHtml = contentJson.includes("html");// 判断是否包含HTML标签, 包含就显示网页, 否则显示旧的文本内容

        console.log('contentJson=' + contentJson);

        let callback = this.props.callback;
        if(callback) {
            callback();
        }


        return(
            <View style={styles.sysContainer}>

                {isHtml &&
                    <WebView bounces={false}
                    scalesPageToFit={true}
                    source={{html: contentJson}}
                    style={{flex: 1}}
                    >
                    </WebView>
                }
                {!isHtml &&
                    <Text
                    textAlign='left'
                    style={[{
                    fontSize: 15,
                    marginTop: 15,
                    marginLeft: 15,
                    marginRight: 15,
                    color: '#323232'
                }]}>{contentJson}</Text>
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    sysContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },

    // companyInfoRowSubViewStyle: {
    //     maxWidth: SCREEN_WIDTH/2 - 15,
    //     width: SCREEN_WIDTH/2 - 15,
    //     height: 30,
    //     marginLeft : 0,
    //     marginRight : 0,
    //     flexDirection: 'row',
    // },
    // companyInfoRowPhoneStyle: {
    //     maxWidth: SCREEN_WIDTH/2 - 15,
    //     width: SCREEN_WIDTH/2 - 15,
    //     height: 30,
    //     marginLeft : 0,
    //     marginRight : 0,
    //     flexDirection: 'row',
    //     justifyContent:'flex-end'
    //
    // }

});
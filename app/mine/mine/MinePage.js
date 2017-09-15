/**
 * Created by liufei on 2017/9/15.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
export default class MinePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[]
        };
    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#FFFFFF'}}>
                <View style={styles.login_wrapper}>
                    <Image style={styles.head_img} source={require('../../img/head_img.png')}/>
                    <View style={styles.login_title_wrapper}>
                        <Text style={styles.login}>
                            注册/登录
                        </Text>
                        <Text style={styles.company}>
                            请立即注册或登录
                        </Text>
                    </View>
                    <Image style={styles.left_bu} source={require('../../img/left_button.png')}/>


                </View>

            </View>
        )
    }
    login(){
        loginJumpSingleton.goToLogin(this.props.navigator);
    }
}

const styles = StyleSheet.create({
    login_wrapper:{
        flexDirection:'row',
        width:SCREEN_WIDTH,
        marginHorizontal:20,
        marginTop:80,
    },
    head_img:{
        resizeMode: "contain",
    },
    login_title_wrapper:{
        marginTop:15,
        marginLeft:10
    },
    login:{
        fontSize:18,
        color:'#333333',
    },
    company:{
        fontSize:14,
        color:'#999999'
    },
    left_bu:{
        resizeMode: "contain",
        marginTop:20,
        marginLeft:145
    },
    line:{
        height:1,
        width:SCREEN_WIDTH,
        borderBottomColor:'#ececec',
        borderBottomWidth:0.5 ,
        backgroundColor:'transparent',
        marginLeft:10,
        marginRight:10,
        marginTop:5
    },

})
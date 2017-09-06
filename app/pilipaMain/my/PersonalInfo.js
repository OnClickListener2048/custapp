/**
个人资料
 */

import React from 'react';

import {Alert, StyleSheet, Text, View,} from 'react-native';
import {SCREEN_WIDTH as width} from '../../config';
import BComponent from '../../base';

export default class PLPMine extends BComponent {
    static navigatorStyle = {
        tabBarHidden: true, // 隐藏默认的顶部导航栏
        navBarHidden: false, // 隐藏默认的顶部导航栏
    };

    constructor(props) {
        super(props);
        this.state = {
            userName: '-',     // 用户名
            phone: '', //手机号
        };


    }

    componentWillMount() {
        UserInfoStore.getUserInfo().then(
            (user) => {
                if (user !== null) {
                    this.setState({userName: user.name, phone: user.phone});
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.lineView}>
                    <Text style={styles.nameTextStyle}>
                        姓名:
                    </Text>
                    <Text style= {[styles.nameTextStyle,
                        {marginLeft: 5}]}>
                        {this.state.userName}
                    </Text>
                </View>
                <View style={styles.divider}/>

                <View style={styles.lineView}>

                    <Text style={styles.nameTextStyle}>
                        手机:
                    </Text>
                    <Text style= {[styles.nameTextStyle,
                        {marginLeft: 5}]}>
                        {this.state.phone}
                    </Text>
                </View>
                <View style={styles.divider}/>

            </View>
        );
    }

    // 登出
    _doLogout() {
        Alert.alert('确定退出', '',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: '确定',
                    onPress: () => {},
                },]
            , {cancelable: false});
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F9FF',
        flex: 1,
    },

    lineView: {
        height: 50,
        width: width,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
        alignItems: 'center'
    },

    divider: {
        backgroundColor: '#dedede',
        marginLeft: 15,
        marginRight: 15,
        height: 0.5,
    },

    nameTextStyle: {
        fontSize: 15,
        color: '#323232',
        textAlign: 'left',
        marginLeft: 0,
    },

});




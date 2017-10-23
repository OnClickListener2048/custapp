/**
 *
 * 个人资料
 * Created by jiaxueting on 2017/9/27.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    SectionList,
    Dimensions,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import BComponent from '../../base';

const deviceWidth = Dimensions.get('window').width;
export default class HomePage extends BComponent {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = {
            userName: '-',     // 用户名
            phone: '', //手机号
            avatar: require('../../img/head_img.png'),// 头像
        };
    }

    componentWillMount() {
        UserInfoStore.isLogined().then(
            logined => {
                console.log('MinePage logined', logined);
                this.setState({logined: logined});
                if (!logined) {
                    this.reset();
                } else {
                    UserInfoStore.getUserInfo().then(
                        (user) => {
                            if (user !== null) {
                                this.setState({userName: user.name, phone: user.mobilePhone});

                                if (user.avatar !== null) {
                                    console.log('MinePage', user.avatar);
                                    this.setState({avatar: {uri: user.avatar}});
                                }
                            } else {
                                this.reset();
                            }
                        },
                        (e) => {
                            console.log("读取信息错误:", e);
                            this.reset();
                        },
                    );

                    UserInfoStore.getCompany().then(
                        (company) => {
                            console.log('company', company);
                            if (company && company.infos && company.infos[0] && company.infos[0].value) {
                                this.setState({company: company.infos[0].value});
                            } else {
                                this.setState({company: ''});
                            }
                        },
                        (e) => {
                            console.log("读取信息错误:", e);
                        },
                    );
                }
            },
            e => {
                console.log("读取登陆状态错误:", e);
                this.reset();
            }
        );
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event);
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.headportrait}>
                    <Text style={styles.textstyle}>
                        头像
                    </Text>
                    <Image source={this.state.avatar} style={styles.imageCircle}/>
                </View>

                <View style={styles.contentlist}>
                    <Text style={styles.textstyle}>
                        手机号
                    </Text>
                    <Text style={styles.textContentStyle}>
                        {this.state.phone}
                    </Text>
                </View>

                <View style={{height: 0.5, backgroundColor: '#ECECEC'}}/>

                <View style={{
                    width: deviceWidth,
                    height: 50.5,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={[styles.contentlist, {marginTop: 0}]}>
                        <Text style={styles.textstyle}>
                            公司名称
                        </Text>
                        <Text style={styles.textContentStyle}>
                            {this.state.company}
                        </Text>
                    </View>
                </View>

                <View style={[styles.contentlist]}>
                    <Text style={styles.textstyle}>
                        微信号
                    </Text>
                    <Text style={styles.textContentStyle}>
                        {this.state.userName}
                    </Text>
                </View>

            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        flexDirection: 'column'
    },
    headportrait: {
        height: 96,
        width: deviceWidth,
        backgroundColor: 'white',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textstyle: {
        fontSize: 16,
        color: '#333333',
        marginLeft: 15,
        marginRight: 5,
    },
    textContentStyle: {
        fontSize: 16,
        color: '#999999',
        marginRight: 15,
    },
    contentlist: {
        height: 50.5,
        width: deviceWidth,
        backgroundColor: 'white',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    imageCircle: {
        width: 60,
        height: 60,
        marginRight: 15,
        borderRadius: 30,
    },
});
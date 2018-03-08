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
import {SCREEN_HEIGHT,SCREEN_WIDTH,PRIMARY_YELLOW} from '../../config';
import YellowNavigatorBar from '../setting/YellowNavigatorBar';
import CommenCell from "../../view/CommenCell";

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

    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden:true
    };

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
            <View style={[styles.container,{flex:1,position:'relative'}]}>
                <YellowNavigatorBar isSecondLevel = {true}  navigator={this.props.navigator} title="个人资料" />


                <View>
                    <Image style={styles.headportrait} source={require('../../img/Rectangle.png')}>

                        <View style={{width:SCREEN_WIDTH,height:60, flexDirection:'row',alignItems:'center',justifyContent: 'space-between'}}>
                            <Text style={[styles.textstyle,{color:'#ffffff'}]}>
                                头像
                            </Text>
                            <Image source={this.state.avatar} style={styles.imageCircle}/>
                        </View>

                    </Image>
                </View>

                <CommenCell
                    leftText='手机号'
                    rightText={this.state.phone}
                    style={{marginTop:10}}
                    onPress={ () => {
                        this.props.navigator.push({
                        screen: 'BindPhonePage',
                        title:'更改手机号'
                    });}}
                />

                <CommenCell
                    leftText='微信号'
                    rightText={this.state.userName}
                    closeRightIcon={true}
                    underLine={false}
                />



            </View>

        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F1F1',
        flexDirection: 'column'
    },
    headportrait: {
        height: 157/375*SCREEN_WIDTH,
        width: deviceWidth,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        paddingTop:157/375*SCREEN_WIDTH - 90,


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
/**
 * 账号与安全
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';
import CommenCell from '../../view/CommenCell'
import BComponent from '../../base/BComponent'

export default class AccountAndSecurity extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            phone:null,
        };
    }

    componentDidMount(){
        UserInfoStore.getUserInfo().then(
            (user) => {
                if (user !== null) {
                    this.setState({phone: user.mobilePhone});

                } else {
                    this.reset();
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
                this.reset();
            },
        );

    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F9F9F9'}}>
                <ScrollView
                    contentContainerStyle={{backgroundColor:'#F9F9F9'}}
                >
                    <CommenCell
                        leftText={'更改手机号    '+this.state.phone}
                        style={{marginTop:10}}
                        onPress={this._goto.bind(this,'BindPhonePage','')}
                    />
                </ScrollView>
            </View>

        )
    }

    _goto(screen, title){
        if(screen === '')return;

        this.props.navigator.push({
            screen: screen,
            title:title
        });
    }

}
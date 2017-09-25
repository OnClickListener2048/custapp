/**
 * Created by liufei on 2017/9/25.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image

} from 'react-native';

import {
    Header,
    AccountingTreatment ,
    ClearCard,
    CopyTaxes,
    PayTaxes,
    SendBill
} from './view'
import BComponent from '../../base';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';

export default class ServicePage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };

    render(){
        return(
            <View style={{flex:1,backgroundColor:'white'}}>
                <Image style={{resizeMode : "contain"}} source={require('../../img/service_demo_bg.png')}/>
                <View style={styles.wrapper1}>
                    <View style={[styles.line,{width:30}]}/>
                    <Text style={{fontSize:24,color:'#e13238',marginHorizontal:10}}>
                        本月进度
                    </Text>
                    <View style={[styles.line,{width:30}]}/>
                </View>



                {this.renderBody()}
            </View>
        )
    }
    renderBody(index){
        switch (index){
            case 0:
                return <CopyTaxes />
                break
            case 1:
                return <SendBill />
                break
            case 2:
                return <AccountingTreatment />
                break
            case 3:
                return <PayTaxes />
                break
            case 4:
                return <ClearCard />
                break
        }
    }
}

const styles = StyleSheet.create({
    wrapper1:{
        width:SCREEN_WIDTH,
        flexDirection:'row',
        marginTop:30,
        alignItems:'center',
        justifyContent:'center'

    },
    line:{
        height:1,
        width:SCREEN_WIDTH,
        borderBottomColor:'#e13238',
        borderBottomWidth:1 ,
        backgroundColor:'transparent'
    },

});
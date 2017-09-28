/**
 * Created by zhuangzihao on 2017/9/27.
 */
import React from 'react';
import {StyleSheet, View, Text, Image, } from 'react-native';

class Notification extends React.Component {

    render() {
        return (
            <View style={{width:DeviceInfo.width,height:50,backgroundColor:'rgba(76,76,76,1)',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <Image source={require('../img/no_net_tip.png')}/>
                <Text style={{fontSize:16,color:'white',marginLeft:10}}>网络请求失败,请检查您的网络</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});

export default Notification;
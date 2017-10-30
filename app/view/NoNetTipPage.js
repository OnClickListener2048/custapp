/**
 * Created by zhuangzihao on 2017/9/20.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView
} from 'react-native';
import { Navigation } from 'react-native-navigation';

export default class NoNetTipPage extends Component {
    static navigatorButtons = {
        leftButtons: [
            {
                icon: require('../img/left.png'), // for icon button, provide the local image asset name
                id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                disableIconTint:true
            }
        ]
    };
    constructor(props) {
        super(props);
        // if you want to listen on navigator events, set this up
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses

            if (event.id == 'back') {
                Navigation.dismissModal({
                    animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
                });
            }
        }
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'white'}}>
                <ScrollView >
                    <View style={{padding:20,paddingRight:15,paddingLeft:15,borderBottomWidth:DeviceInfo.onePR,borderBottomColor:'#999999'}}>
                        <Text style={{color:'#333333',fontSize:18}}>请设置你的网络</Text>
                        <Text style={{fontSize:16,color:'#999999',marginTop:20,lineHeight:25}}>1.打开设备的"系统设置">"无线和网络">"移动网络".</Text>
                        <Text style={{fontSize:16,color:'#999999',marginTop:5, lineHeight:25}}>2.打开设备的"系统设置">"WLAN","启动WLAN"后从中选择一个可以用的</Text>
                    </View>
                    <View style={{padding:30,paddingRight:15,paddingLeft:15}}>
                        <Text style={{color:'#333333',fontSize:18}}>如果你已经连接Wi-Fi网络</Text>
                        <Text style={{fontSize:16,color:'#999999',marginTop:20,lineHeight:25}}>请确认你所接入Wi-Fi网络已经连入互联网，或者确认你的设备是否被允许访问该热点。</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
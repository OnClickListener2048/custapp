/**
 * Created by zhuangzihao on 2017/9/27.
 */
import React from 'react';
import { View, Text, Image, TouchableOpacity,DeviceEventEmitter} from 'react-native';
import { Navigation } from 'react-native-navigation';

class Notification extends React.Component {

    render() {
        return (
            <TouchableOpacity onPress={()=>this._goto()}>
                <View style={{width:DeviceInfo.width,height:50,backgroundColor:'rgba(76,76,76,1)',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../img/no_net_tip.png')}/>
                    <Text style={{fontSize:16,color:'white',marginLeft:10}}>网络请求失败,请检查您的网络</Text>
                </View>
            </TouchableOpacity>
        );
    }
    _goto(){
        Navigation.showModal({
            screen: 'NoNetTipPage',
            title:'无网络连接',
        });
    }
}



export default Notification;
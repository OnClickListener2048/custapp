/**
 * Created by zhuangzihao on 2017/12/19.
 */
import React from 'react';
import {Platform, View, Text,Image,TouchableOpacity,
    NativeModules} from 'react-native';
import CommenCell from '../view/CommenCell'
import BComponent from '../base/BComponent'
import {deviceHeight,deviceWidth} from "../util/ScreenUtil";
const contentwidth = deviceWidth*0.7
class UpdateLightBox extends BComponent {

    constructor(props) {
        super(props);

    }
    static defaultProps = {
        version:'',//版本号
        dataArr:[],//更新说明
        isForce:false,//是否强制更新
        apkUrl:'',//apk下载地址
    };

    render() {
        return (
            <View style={{justifyContent:'center',alignItems:'center'}}>
                <View style={[{borderRadius:7}, Platform.OS === 'ios'?{marginTop:-contentwidth*0.25}:{}] }>
                    <View style={{position:'relative',zIndex:9999}}>
                        <Image resizeMode="contain" style={{width:contentwidth,height:contentwidth*0.5,marginTop:contentwidth*0.25}} source={require('../img/updatebox_header.png')} />
                        <Image resizeMode="contain"   style={{position:'absolute',top:0,left:(contentwidth-(contentwidth*0.5))/2,width:contentwidth*0.5,height:contentwidth*0.5}} source={require('../img/update_new.png')} />
                        <View style={{width:contentwidth,height:contentwidth*0.25,position:'absolute',left:0,top:contentwidth*0.5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'white',fontSize:25,fontWeight:'bold'}}>发现<Text style={{fontSize:30}}>新</Text></Text>
                            <View style={{marginLeft:5}}>
                                <Text style={{fontSize:17, color:'white'}}>
                                    版本
                                </Text>
                                <View style={{backgroundColor:'white',width:40,height:14,borderRadius:8,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{color:'rgba(252,117,28,1)',backgroundColor:'transparent',fontSize:12}}>{this.props.version}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{zIndex:999,backgroundColor:'white',width:contentwidth,justifyContent:'center', alignItems:'center',marginTop:-5,padding:10,borderRadius:5,paddingBottom:32}}>
                        <View style={{width:contentwidth-80}}>
                            {
                                this.props.dataArr.map((item,index)=>{
                                    return(
                                        <Text style={{color:'rgba(153,153,153,1)',marginTop:10}}>
                                            {item}
                                        </Text>
                                    )
                                })
                            }
                        </View>
                        <TouchableOpacity onPress={()=>{this._upDate()}}>
                            <View style={{width:contentwidth-80,height:40,borderRadius:20,backgroundColor:'rgba(252,117,28,1)',marginTop:25,justifyContent:'center',
                                alignItems:
                                    'center'}}>
                                <Text style={{color:'white',fontSize:18}}>立即升级</Text>
                            </View>
                        </TouchableOpacity>
                        {
                            this.props.isForce?null:<TouchableOpacity onPress={()=>{this._cancle()}}><View style={{width:contentwidth-80,height:40,borderRadius:20,backgroundColor:'white',marginTop:20,justifyContent:'center',
                                alignItems:'center',borderWidth:1,borderColor:'rgba(153,153,153,1)'}}>
                                <Text style={{color:'rgba(153,153,153,1)',fontSize:18}}>立即取消</Text>
                            </View></TouchableOpacity>
                        }

                    </View>
                </View>
            </View>
        );
    }

    //立即升级
    _upDate(){
        this.props.navigator.dismissLightBox()
        if(Platform.OS === 'ios'){

            NativeModules.upgrade.upgrade('1300062750',(msg) =>{
                if('YES' == msg) {
                    //跳转到APP Stroe
                    NativeModules.upgrade.openAPPStore('1300062750');
                } else {
                    Toast.show('当前为最新版本');
                }
            })

            //跳转到APP Stroe
            // NativeModules.upgrade.openAPPStore('1300062750');
        }else{

            // 下载最新Apk
            // NativeModules.upgrade.upgrade(this.state.apkUrl);
            NativeModules.upgrade.upgrade('https://www.pgyer.com/sKdC');
        }
    }

    //立即取消
    _cancle(){
        this.props.navigator.dismissLightBox()
    }
}



export default UpdateLightBox;
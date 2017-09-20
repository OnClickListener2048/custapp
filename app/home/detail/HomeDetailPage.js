/**
 * Created by zhuangzihao on 2017/9/11.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Linking,
    TextInput
} from 'react-native';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'
import WebTab from './WebVIew'
import Modal from 'react-native-modalbox';
import BComponent from '../../base';

export default class HomeDetailPage extends BComponent {

    static defaultProps = {
        detailArr:[]
    };
    _call(){
        Linking.openURL('tel:18519107704')
    }
    _consultation(){
        this.refs.modal3.open()
    }
    render(){
        return(
            <View style={{flex:1,position:'relative'}}>
                <View style={{width:DeviceInfo.width,height:150,backgroundColor:'gray'}}>
                    <Text>我是图片</Text>
                </View>
                <ScrollableTabView
                    renderTabBar={() => <ScrollableTabBar />}
                >
                    {
                        this.props.detailArr.map((item,index)=>{
                            return(
                                <WebTab key={index} tabLabel={item.title} url={item.url}/>
                            )
                        })
                    }
                </ScrollableTabView>
                <View style={{position:'absolute',top:230,right:30,width:50,height:50,backgroundColor:'red'}}></View>
                <View style={{position:'absolute',bottom:0,left:0,width:DeviceInfo.width,height:44,flexDirection:'row'}}>
                    <TouchableOpacity style={{flex:1}} onPress = {this._call.bind(this)}>
                        <View style={{flex:1,justifyContent:'center',alignItems:"center",backgroundColor:'green'}}>
                            <Text style={{color:'white',fontWeight:'bold'}}>免费咨询</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1}} onPress = {this._consultation.bind(this)}>
                        <View style={{flex:1,justifyContent:'center',alignItems:"center",backgroundColor:'red'}}>
                            <Text style={{color:'white',fontWeight:'bold'}}>在线留言</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Modal style={ { height: 200,width: 300,justifyContent:'center',alignItems:'center',marginTop:-50}} position={"center"} ref={"modal3"} >
                    <TextInput placeholder='服务区域'/>
                    <TextInput placeholder='您的称呼'/>
                    <TextInput placeholder='联系电话'/>
                    <TextInput placeholder='客户留言'/>
                </Modal>
            </View>
        )
    }
}
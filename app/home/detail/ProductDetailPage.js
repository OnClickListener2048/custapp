/**
 * Created by zhuangzihao on 2017/9/11.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    WebView,
    Platform,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import WebTab from './WebVIew'
import BComponent from '../../base';
const window = Dimensions.get('window');
export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;
export default class ProductDetailPage extends BComponent {

    static defaultProps = {
        item:{}
    };

    callPhone(){
    }
    onlineMessage(){
    //在线留言
    }
    // #E13238
    render(){
        return(
            <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
                <Image style={{width:DeviceInfo.width,height:DeviceInfo.width*0.4}} source={{uri:this.props.item.img}}/>
                <WebTab url={this.props.item.desc_url}/>
                <View style={styles.tabViewContainer}>
                    <TouchableOpacity
                        style={{flexDirection: 'row',height:50,width:(SCREEN_WIDTH - 4)/2}}
                        onPress={() => {
                            this.callPhone()
                        }}>
                    <View style={{flexDirection: 'row',justifyContent:'center',flex:1,alignItems:'center',backgroundColor:'#E13238'}}>
                    <Text style={{fontSize:16,textAlign:'center',color:'#ffffff'}}>{'免费咨询'}</Text>
                    </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{flexDirection: 'row',height:50,width:(SCREEN_WIDTH - 4)/2}}
                        onPress={() => {
                                          this.onlineMessage()
                                      }}>
                    <View  style={{flexDirection: 'row',justifyContent:'center',flex:1,alignItems:'center',backgroundColor:'#E19F0E'}}>
                        <Text style={{fontSize:16,textAlign:'center',color:'#ffffff'}}>{'在线留言'}</Text>
                    </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}



const styles = StyleSheet.create({


    tabViewContainer: {
        height: 50,
        width: SCREEN_WIDTH,
        backgroundColor: '#FFFFFF',
        justifyContent:'space-between',
        flexDirection: 'row',
    },



});
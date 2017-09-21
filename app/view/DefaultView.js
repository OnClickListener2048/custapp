/**
 * Created by zhuangzihao on 2017/9/21.
 */
import React, { Component } from 'react';
import {

    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,

} from 'react-native';
export default class DefaultView extends Component {

    static defaultProps = {
        type:'',// no-data 无数据 no-net无网 error加载失败
        image:null,
        text:'',
        onPress:function () {

        }
    };

    render(){
        return(
            <View style={[styles.container,{width:DeviceInfo.width, height:DeviceInfo.OS==='ios'?DeviceInfo.height-108:DeviceInfo.height-88}]}>
                {this.renderImageAndText()}
            </View>
        )
    }
    renderImageAndText(){
        if (this.props.type == 'no-data'){
            //无数据
            return(
                <TouchableOpacity style={styles.box} onPress={()=>this.props.onPress()}>
                    <Image source={require('../img/no_message.png')}/>
                    <Text style={styles.text}>暂无消息</Text>
                </TouchableOpacity>
            )
        }else if(this.props.type == 'no-net'){
            //无网
            return(
                <TouchableOpacity style={styles.box} onPress={()=>this.props.onPress()}>
                    <Image source={require('../img/network_error.png')}/>
                    <Text style={styles.text}>网络错误,点击重新开始</Text>
                </TouchableOpacity>
            )
        }else if (this.props.type == 'error'){
            //服务器错误
            return(
                <TouchableOpacity style={styles.box} onPress={()=>this.props.onPress()}>
                    <Image source={require('../img/load_failed.png')}/>
                    <Text style={styles.text}>加载失败，点击重试</Text>
                </TouchableOpacity>
            )
        }else{
            //自定义
            return(
                <TouchableOpacity style={styles.box} onPress={()=>this.props.onPress()}>
                    <Image source={this.props.image}/>
                    <Text style={styles.text}>{this.props.text}</Text>
                </TouchableOpacity>
            )
        }
    }

}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#f9f9f9',
        justifyContent:'center',
        alignItems:'center',

    },
    text: {
        fontSize: 18,
        marginTop:20,
        color:'#969696',
    },
    box:{
        alignItems:'center'
    }
});
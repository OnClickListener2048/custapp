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
import Spinner from 'react-native-spinkit';
export default class DefaultView extends Component {

    static defaultProps = {
        type:'',// no-data 无数据 no-net无网 error加载失败 loading加载中
        image:null,
        text:'',
        onPress:function () {

        }
    };

    render(){
        return(
            <View style={[styles.container,{width:DeviceInfo.width, height:DeviceInfo.OS==='ios'?DeviceInfo.height-44-64:DeviceInfo.height-88}]}>
                {this.renderImageAndText()}
            </View>
        )
    }
    renderImageAndText() {
        // if(this.props.type == 'loading'){
        //     //加载中
        //     return(
        //         <View style={styles.box} >
        //             <Spinner  isVisible={true} style={{marginLeft:DeviceInfo.OS==='ios'?-20:0}}  type={'FadingCircleAlt'} size={80} color={'#C8C8C8'}/>
        //
        //             {/*<Image source={require('../img/loading.png')}/>*/}
        //             <Text style={{fontSize:18,color:'#999999',marginTop:70}}>玩命加载中~</Text>
        //         </View>
        //     )
        // }else
            if (this.props.type == 'no-data'){
            //无数据
            return(
                <TouchableOpacity style={styles.box} onPress={()=>this.props.onPress()}>
                    <Image source={require('../img/no_message.png')}/>
                    <Text style={{fontSize:15,color:'#999999',marginTop:50}}>您还没有任何相关数据</Text>
                </TouchableOpacity>
            )
        }else if (this.props.type == 'no-MessageData'){
            //无数据 故意第一版添加的无消息 其他页面不要用
            return(
                <TouchableOpacity style={styles.box} onPress={()=>this.props.onPress()}>
                    <Image source={require('../img/no_message.png')}/>
                    <Text style={{fontSize:15,color:'#999999',marginTop:50}}>您目前没有任何消息</Text>
                </TouchableOpacity>
            )
        } else if (this.props.type == 'no-ProgressData'){
                //进度详情页无数据  其他页面不要用
                return(
                    <TouchableOpacity style={styles.box} onPress={()=>this.props.onPress()}>
                        <Image source={require('../img/no_message.png')}/>
                        <Text style={{fontSize:15,color:'#999999',marginTop:50}}>您的订单正在处理中，请稍后查看</Text>
                    </TouchableOpacity>
                )
        } else if(this.props.type == 'no-net'){
            //无网
            return(
                <TouchableOpacity style={styles.box} onPress={()=>this.props.onPress()}>
                    <Image source={require('../img/network_error.png')}/>
                    <Text style={{fontSize:18,color:'#999999',marginTop:50}}>网络请求失败</Text>
                    <Text style={{fontSize:18,color:'#999999',marginTop:5}}>请检查您的网络</Text>
                </TouchableOpacity>
            )
        }else if (this.props.type == 'error'){
            //服务器错误
            return(
                <View style={styles.box} onPress={()=>this.props.onPress()}>
                    <Image source={require('../img/no_message.png')}/>
                    <Text style={{fontSize:18,color:'#999999',marginTop:50}}>请求失败</Text>
                    <Text style={{fontSize:18,color:'#999999',marginTop:5}}>请稍候重试</Text>
                    <TouchableOpacity onPress={()=>this.props.onPress()}>
                        <View style={{width:DeviceInfo.width-50,height:50,borderRadius:25,backgroundColor:'red',marginTop:35,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'white',fontSize:18}}>重新加载</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
        backgroundColor:'#F1F1F1',
        justifyContent:'center',
        alignItems:'center',
        flex:1

    },
    text: {
        fontSize: 18,
        marginTop:20,
        color:'#969696',
    },
    box:{
        alignItems:'center',
        marginTop:-64
    }
});
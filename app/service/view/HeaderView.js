/**
 * Created by liufei on 2017/9/26.
 */

import React, {Component,PropTypes} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    TouchableWithoutFeedback
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';

export default class HeaderView extends Component {

    constructor(props){
        super(props)
        this._renderTop=this._renderTop.bind(this);
    }

    static defaultProps = {
        hasTop:true,//是否有顶部的view
        hasBottom:true,//是否有底部view
        topDes:'',//顶部文字描述
        topNum:'',//顶部数值
        leftDes:'',//左边文字描述
        leftNum:'',//左边数值
        rightDes:'',
        rightNum:''
    }


    render(){
        const {hasTop,hasBottom} = this.props
        return(
            <Image style={styles.wrapper}
                   source={hasTop&&hasBottom?require('../../img/service_bg.png'):require('../../img/service_receive_bg.png')}>
                <TouchableWithoutFeedback  activeOpacity={1} onPress={()=>{this.props._showTimer&&this.props._showTimer()}}>
                    <View style={[{width:DeviceInfo.width,flexDirection:'row',padding:15,paddingLeft:24,paddingRight:24,
                        justifyContent:'space-between',borderBottomColor:'rgba(255,255,255,0.15)',borderBottomWidth:DeviceInfo.onePR,backgroundColor:'transparent',position:'absolute',top:0,left:0}]}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={[{fontSize:setSpText(20)},{color:'white'}]}>{this.props.month}月</Text>
                            <Text style={[{fontSize:setSpText(14),alignSelf:'flex-end'},{color:'white'}]}>{this.props.year}</Text>
                            <Image style={{alignSelf:'flex-end',margin:3}} source={require('../../img/triangle.png')}/>
                        </View>
                        <Image source={require('../../img/today_white.png')}/>
                    </View>
                </TouchableWithoutFeedback>
                {this._renderTop()}
                {this._renderBottom()}
            </Image>
        )
    }
    _renderBottom(){
        const {leftDes,leftNum,rightDes,rightNum,hasBottom} = this.props

        if(hasBottom){
            return(
                <View style={styles.wrapper2}>
                    <View style={styles.wrapper3}>
                        <Text style={styles.te3}>
                            {leftDes}
                        </Text>
                        <Text style={styles.te4}>
                            {leftNum}
                        </Text>
                    </View>
                    <View style={styles.wrapper3}>
                        <Text style={styles.te3}>
                            {rightDes}
                        </Text>
                        <Text style={styles.te4}>
                            {rightNum}
                        </Text>
                    </View>
                </View>
            )
        }
    }
    _renderTop(){
        const {hasTop, topDes,topNum} = this.props
        if(hasTop) {
            return (
                <View style={styles.wrapper1}>
                    <Text style={styles.te1}>
                        {topDes}
                    </Text>
                    <Text style={styles.te2}>
                        {topNum}
                    </Text>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    wrapper:{
        width:SCREEN_WIDTH,

    },
    wrapper1:{
        marginTop:65,
        justifyContent:'center',
        alignItems:'center',
    },
    te1:{
        fontSize:16,
        color:'#ffffff',
        backgroundColor:'transparent'
    },
    te2:{
        fontSize:32,
        color:"#ffffff",
        backgroundColor:'transparent',
        marginTop:5
    },
    wrapper2:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:20,
        position:'absolute',
        bottom:20,
        left:0,
        width:SCREEN_WIDTH-40
    },
    wrapper3:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:Platform.OS==='ios'?30:15
    },
    te3:{
        fontSize:12,
        color:'#FFFFFF',
        backgroundColor:'transparent',
    },
    te4:{
        fontSize:18,
        color:'#ffffff',
        backgroundColor:'transparent',
        marginTop:5
    }
});
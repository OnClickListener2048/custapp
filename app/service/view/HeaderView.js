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
    TouchableWithoutFeedback,
    ScrollView,
    InteractionManager
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
const monthWidth = SCREEN_WIDTH/5
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
                            {leftDes}(元)
                        </Text>
                        <Text style={styles.te4}>
                            {leftNum}
                        </Text>
                    </View>
                    <View style={[styles.wrapper3,{width:DeviceInfo.onePR,height:30,backgroundColor:'rgba(255, 255, 255, 0.3)',marginTop:35}]}/>
                    <View style={styles.wrapper3}>
                        <Text style={styles.te3}>
                            {rightDes}(元)
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
                        {topDes}(元)
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
        marginTop:setSpText(25),
        justifyContent:'center',
        alignItems:'center',
    },
    te1:{
        fontSize:setSpText(14),
        color:'rgba(255, 255, 255, 0.7)',
        backgroundColor:'transparent'
    },
    te2:{
        fontSize:setSpText(32),
        color:'rgba(255, 255, 255,1)',
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
        width:SCREEN_WIDTH-40,
    },
    wrapper3:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:Platform.OS==='ios'?30:15
    },
    te3:{
        fontSize:setSpText(12),
        color:'rgba(255, 255, 255, 0.7)',
        backgroundColor:'transparent',
    },
    te4:{
        fontSize:setSpText(18),
        color:'rgba(255, 255, 255,1)',
        backgroundColor:'transparent',
        marginTop:5
    }
});
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
        isService:false,//是否是
        hasTop:true,//是否有顶部的view
        hasBottom:true,//是否有底部view
        topDes:'',//顶部文字描述
        topNum:'',//顶部数值
        leftDes:'',//左边文字描述
        leftNum:'',//左边数值
        rightDes:'',
        rightNum:'',
        supporButton:false,//是否有技术支持按钮

        supportBtnOnPress:function() {}, //按钮点击事件

    }

    render(){
        const {hasTop,hasBottom,isService} = this.props
        return(
            <Image style={styles.wrapper}
                   source={hasTop&&hasBottom?isService?require('../../img/service_hight_bg.png'):require('../../img/service_bg.png'):require('../../img/service_receive_bg.png')}>

                {this._renderTop()}
                {this._renderBottom()}
            </Image>
        )
    }


    _renderBottom(){
        const {leftDes,leftNum,rightDes,rightNum,hasBottom,isService} = this.props

        if(hasBottom){
            return(
                <View style={[styles.wrapper2,isService?{bottom:30}:{}]}>
                    <View style={isService?styles.wrapper3_service:styles.wrapper3}>
                        <Text style={styles.te4}>
                            {leftNum}
                        </Text>
                        <Text style={styles.te3}>
                            {leftDes}(元)
                        </Text>
                    </View>
                    <View style={[isService?styles.wrapper3_service:styles.wrapper3,{width:DeviceInfo.onePR,height:30,backgroundColor:'rgba(255, 255, 255, 0.3)',marginTop:35}]}/>
                    <View style={isService?styles.wrapper3_service:styles.wrapper3}>
                        <Text style={styles.te4}>
                            {rightNum}
                        </Text>
                        <Text style={styles.te3}>
                            {rightDes}(元)
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
                <View >
                <View style={styles.wrapper1}>
                    <Text style={styles.te2}>
                        {topNum}
                    </Text>
                    <Text style={styles.te1}>
                        {topDes}(元)
                    </Text>
                </View>
                    {this.props.supporButton &&
                    <TouchableOpacity onPress={() => {
                        this.props.supportBtnOnPress()
                    }}
                                      style={{
                                          position: 'absolute',
                                          top: 20,
                                          left: DeviceInfo.width - 55,
                                          width: DeviceInfo.width,
                                          height: 200,
                                      }}>
                        <Image style={{resizeMode: "contain"}}
                               source={require('../../img/support_questions.png')}
                        />
                    </TouchableOpacity>
                    }

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
        marginTop:setSpText(20),
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
    wrapper3_service:{
        justifyContent:'center',
        // alignItems:'center',
    },
    wrapper3:{
        justifyContent:'center',
        // alignItems:'center',
        marginTop:Platform.OS==='ios'?30:15,

    },
    te3:{
        fontSize:setSpText(12),
        color:'rgba(255, 255, 255, 0.7)',
        backgroundColor:'transparent',
        marginTop:5,
    },
    te4:{
        fontSize:setSpText(18),
        color:'rgba(255, 255, 255,1)',
        backgroundColor:'transparent',
    }
});
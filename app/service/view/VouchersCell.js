/**
 * Created by jiaxueting on 2018/4/3.
 * 我的凭证列表项
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
const itemWidth = (SCREEN_WIDTH-setSpText(33))/4
export default class VouchersCell extends Component {
    constructor(props){
        super(props)
        this.state={
            _id:'',
        }
    }

    static defaultProps = {
        // onPress:function() {//点击事件
        //
        // },
        item:{}
    }
    onPress(item){
        this.props._goVoucherDetail(item)
    }
    render(){
        return(
            <View>
                {
                    this.props.item.subjectDetails.map((item, i) => {
                        return(
                            <TouchableOpacity onPress = {() => {this.props.onPress(item)}} >

                            <View style = {styles.ViewStyle}>
                    <View style = {[styles.itemStyle]}>
                        <View style = {{flexDirection:'column-reverse',}}>
                            <Text style={{fontSize:12,color:'#999999'}} numberOfLines={1}>{this.props.item.relateDate}</Text>
                            <Text style={{fontSize:14,color:'#333333'}} numberOfLines={1}>{this.props.item.voucherWord}</Text>
                        </View>
                    </View>
                    <View style = {[styles.itemStyle,{width:itemWidth*2}]}>
                        <Text style={styles.digestStyle} numberOfLines={3}>{item.subject_Abstract}</Text>

                    </View>
                    <View style = {[styles.itemStyle,{borderRightWidth:0}]}>
                        <Text style={styles.digestStyle}  numberOfLines={1}>{item.debitMoney}</Text>

                    </View>
                    <Image resizeMode = "contain" style = {styles.rightImgStyle} source={require('../../img/left_button.png')} />

                </View>
                            </TouchableOpacity>

                        )
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ViewStyle:{
        flexDirection:'row',
        // 侧轴居中
        alignItems:'center',
        height:setSpText(76),
        width:SCREEN_WIDTH,
        backgroundColor:'white',
        borderBottomWidth:setSpText(0.5),
        borderBottomColor:'#D1D1D1',
        paddingLeft:setSpText(7),
        paddingRight:setSpText(18),
    },
    rightImgStyle:{ // 左边的图片
        width:setSpText(8)
        // 圆角
    },
    itemStyle:{
        borderRightWidth:setSpText(0.5),
        borderRightColor:'#D1D1D1',
        width:itemWidth,
        height:setSpText(45),
        paddingLeft:setSpText(10),
        paddingRight:setSpText(10),
        flexDirection:'row',
        // 侧轴居中
        alignItems:'center',
    },
    digestStyle:{
        fontSize:12,
        color:'#333333',
    }
});
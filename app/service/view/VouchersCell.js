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

    }

    static defaultProps = {
        //     voucherCode:'',//凭证字号
        //     digest:'',//摘要
        //     voucherDate:'',//日期
        //     voucherAmount:'',//金额
        // onPress:function() {//点击事件
        //
        // },
        item:{}
    }

    // render(){
    //     return(
    //         <TouchableOpacity onPress = {() => {this.props.onPress()}} >
    //
    //             <View style = {styles.ViewStyle}>
    //                 <View style = {[styles.itemStyle]}>
    //                     <View style = {{flexDirection:'column-reverse',}}>
    //                         <Text style={{fontSize:12,color:'#999999'}}>{this.props.item.voucherDate}</Text>
    //                         <Text style={{fontSize:14,color:'#333333'}} numberOfLines={1}>{this.props.item.voucherCode}</Text>
    //                     </View>
    //                 </View>
    //                 <View style = {[styles.itemStyle,{width:itemWidth*2}]}>
    //                     <Text style={styles.digestStyle} numberOfLines={3}>{this.props.digest}</Text>
    //
    //                 </View>
    //                 <View style = {[styles.itemStyle,{borderRightWidth:0}]}>
    //                     <Text style={styles.digestStyle}  numberOfLines={1}>{this.props.item.voucherAmount}</Text>
    //
    //                 </View>
    //                 <Image resizeMode = "contain" style = {styles.rightImgStyle} source={require('../../img/left_button.png')} />
    //
    //             </View>
    //         </TouchableOpacity>
    //     )
    // }
    render(){
        console.log(this.props.item)
        return(
            <View>
                {
                    this.props.item.subjectDetails.map((item, i) => {
                        return(
                            <View style={{width:DeviceInfo.width,flexDirection:'row'}}>
                                <Text>{this.props.item.voucherWord}</Text>
                                <Text>{item.subjectName}</Text>
                            </View>
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
        paddingLeft:setSpText(16),
        paddingRight:setSpText(16),
        flexDirection:'row',
        // 侧轴居中
        alignItems:'center',
    },
    digestStyle:{
        fontSize:12,
        color:'#333333',
    }
});
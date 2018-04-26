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
import {formatmoney} from '../../util/FormatMoney';
const itemWidth = (SCREEN_WIDTH-setSpText(33))/4
export default class VouchersCell extends Component {
    constructor(props){
        super(props)
    }

    static defaultProps = {
        onPress:function() {//点击事件

        },
        item:{},
        isclick:true,//列表可点击
    }

    renderItem(relateDate,debitMoney,subject_Abstract){
        return(
            <View style = {styles.ViewStyle}>
                <View style = {[styles.itemStyle]}>
                    <View style = {{flexDirection:'column-reverse',}}>
                        <Text style={{fontSize:12,color:'#999999'}} numberOfLines={1}>{relateDate}</Text>
                        <Text style={{fontSize:14,color:'#333333'}} numberOfLines={1}>{this.props.item.voucherWord}</Text>
                    </View>
                </View>
                <View style = {[styles.itemStyle,{width:itemWidth*2}]}>
                    <Text style={styles.digestStyle} numberOfLines={2}>{subject_Abstract+'...'}</Text>

                </View>
                <View style = {[styles.itemStyle,{borderRightWidth:0}]}>
                    <Text style={styles.digestStyle}  numberOfLines={1}>{'查看明细'}</Text>

                </View>
                <Image resizeMode = "contain" style = {styles.rightImgStyle} source={require('../../img/left_button.png')} />

            </View>
        )
    }

    render(){

        var strDate = this.props.item.relateDate.substring(0,10);
        var dateFormat = strDate.replace(/-/g, '.');
        var debitMoneyAll = 0;
        var _Abstract = "";
        this.props.item.subjectDetails&&this.props.item.subjectDetails.map((item, i) => {
            debitMoneyAll+=item.debitMoney;
            console.log("打印金额之和="+item.debitMoney+",,,"+debitMoneyAll);
            if(i===0){
                _Abstract=item.subject_Abstract;
            }
        })
        if(this.props.isclick){
            return(
                <TouchableOpacity onPress = {() => {this.props.onPress()}}>
                    <View>
                        {this.renderItem(dateFormat,formatmoney(debitMoneyAll),_Abstract)}
                    </View>
                </TouchableOpacity>

            )
        }else{
            return(
                <View>
                    {this.renderItem(dateFormat,formatmoney(debitMoneyAll),_Abstract)}
                </View>
            )

        }

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
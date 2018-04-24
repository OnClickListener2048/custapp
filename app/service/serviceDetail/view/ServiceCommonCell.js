/**
 * Created by jiaxueting on 2018/4/24.
 * 资产负债表
 * 现金流量表
 * 利润表
 */

import React, {Component,PropTypes} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../../config';
import {formatmoney} from '../../../util/FormatMoney';
const itemWidth = (SCREEN_WIDTH-setSpText(28))/3
export default class ServiceCommonCell extends Component {
    constructor(props){
        super(props)
    }

    static defaultProps = {
        onPress:function() {//点击事件

        },
        projectName:'',//资产、负债和所有者（或股东）权益、项目
        endMonthSum:'',//期末数、本月金额、
        endYearSum:'',//年初数、本年累计金额
        endMonth:'',//名称类型：期末数、本月金额、
        endYear:'',//名称类型：年初数、本年累计金额
        isclick:true,//列表可点击
    }

    renderItem(){
        return(
            <View style = {styles.ViewStyle}>
                <View style={[styles.centerCellStyle,{justifyContent:'flex-start',marginTop:setSpText(17),marginBottom:setSpText(11)}]}>
                    <Text style={[styles.blackStyle,{fontWeight:'bold'}]} numberOfLines={1}>
                        {this.props.projectName}
                    </Text>
                </View>
                <View style={[styles.centerCellStyle,{marginBottom:setSpText(3)}]}>
                    <Text  style={styles.blackStyle}  numberOfLines={1}>
                        {formatmoney(this.props.endMonthSum)}
                    </Text>
                    <Text  style={styles.blackStyle}  numberOfLines={1}>
                        {formatmoney(this.props.endYearSum)}
                    </Text>
                </View>
                <View style={[styles.centerCellStyle,{marginBottom:setSpText(16)}]}>
                    <Text  style={styles.greyStyle}  numberOfLines={1}>
                        {this.props.endMonth}
                    </Text>
                    <Text  style={styles.greyStyle}  numberOfLines={1}>
                        {this.props.endYear}
                    </Text>
                </View>
            </View>
        )
    }

    render(){

        if(this.props.isclick){
            return(
                <TouchableOpacity onPress = {() => {this.props.onPress()}}>
                    <View>
                        {this.renderItem()}
                    </View>
                </TouchableOpacity>

            )
        }else{
            return(
                <View>
                    {this.renderItem()}
                </View>
            )

        }

    }
}

const styles = StyleSheet.create({
    ViewStyle:{
        flexDirection:'column',
        // 侧轴居中
        alignItems:'center',
        justifyContent:'space-between',
        height:setSpText(111),
        width:SCREEN_WIDTH,
        backgroundColor:'white',
        paddingLeft:setSpText(14),
        paddingRight:setSpText(14),
        borderBottomColor:'#D1D1D1',
        borderBottomWidth:setSpText(0.5)
    },
    centerCellStyle:{
        flexDirection:'row',
        width:SCREEN_WIDTH-setSpText(28),
        // 侧轴居中
        alignItems:'center',
        justifyContent:'space-between',
    },
    blackStyle:{
        fontSize:16,
        color:'#333333'
    },
    greyStyle:{
        fontSize:14,
        color:'#999999'
    }
});

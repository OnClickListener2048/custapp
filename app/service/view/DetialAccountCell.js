/**
 * Created by jiaxueting on 2018/4/16.
 * 明细表详情列表项
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
const itemWidth = (SCREEN_WIDTH-setSpText(28))/3
export default class DetialAccountCell extends Component {
    constructor(props){
        super(props)
    }

    static defaultProps = {
        onPress:function() {//点击事件

        },
        item:{},
        detailsSubject:'',//方向：借、贷
        isclick:true,//列表可点击
    }

    renderItemHeader(){
        return(
            <View style = {styles.ViewHeaderStyle}>
                <Text style = {styles.headertext} numberOfLines={1}>{this.props.item.voucher}</Text>
                <View style = {{flexDirection:'row',}}>
                    <Text style = {{fontSize:14,color:'#999999',alignSelf:'center',marginRight:setSpText(7)}}>{this.props.item.relateDate}</Text>
                    <Image resizeMode = "contain" style = {styles.rightImgStyle} source={require('../../img/left_button.png')} />
                </View>
            </View>
            )

    }

    renderItem(){
        return(
            <View style = {styles.ViewStyle}>
                <View style = {[styles.itemStyle,{alignItems:'flex-start'}]}>
                    <Text style={[styles.digestStyle,{marginRight:setSpText(22)}]} numberOfLines={3}>{this.props.item.abstract}</Text>
                    <Text style={[styles.digestStyle,{paddingBottom:0}]}>方向：{this.props.detailsSubject}</Text>
                </View>
                <View style = {styles.itemStyle}>
                    <Text style={styles.digestStyle}>借方</Text>
                    <Text style={styles.digestStyle}>贷方</Text>
                    <Text style={[styles.digestStyle,{color:'#CEAF72',paddingBottom:0}]}>余额</Text>
                </View>
                <View style = {[styles.itemStyle,{alignItems:'flex-end'}]}>
                    <Text style={styles.digestStyle} numberOfLines={1}>{formatmoney(this.props.item.deb)}</Text>
                    <Text style={styles.digestStyle} numberOfLines={1}>{formatmoney(this.props.item.cre)}</Text>
                    <Text style={[styles.digestStyle,{color:'#CEAF72',paddingBottom:0}]} numberOfLines={1}>{formatmoney(this.props.item.balance)}</Text>
                </View>
            </View>
        )
    }

    render(){
        console.log("item数据="+this.props.item.voucher)

        if(this.props.item.voucher){
            return(
                <TouchableOpacity onPress = {() => {this.props.onPress()}}>
                    <View style = {styles.viewcontainer}>
                        {this.renderItemHeader()}
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
    viewcontainer:{
        flexDirection:'column',
        flex:1,
        alignItems:'center',
        backgroundColor:'transparent'
    },
    ViewStyle:{
        flexDirection:'row',
        // 侧轴居中
        alignItems:'center',
        justifyContent:'space-between',
        height:setSpText(105),
        width:SCREEN_WIDTH,
        backgroundColor:'white',
        paddingLeft:setSpText(14),
        paddingRight:setSpText(14),
        marginBottom:setSpText(10)
    },
    ViewHeaderStyle:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'white',
        height:setSpText(40),
        width:SCREEN_WIDTH,
        paddingLeft:setSpText(14),
        paddingRight:setSpText(14),
        // 侧轴居中
        alignItems:'center',
        marginBottom:setSpText(1)
    },
    headertext:{
        fontSize:14,
        color:'#333333',
        alignSelf:'center',
    },
    rightImgStyle:{ // 左边的图片
        width:setSpText(8),
        alignSelf:'center',
    },
    itemStyle:{
        width:itemWidth,
        height:setSpText(105),
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    digestStyle:{
        fontSize:12,
        color:'#999999',
        paddingBottom:setSpText(11),
    }
});
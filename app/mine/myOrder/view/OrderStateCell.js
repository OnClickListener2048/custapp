/**
 * Created by liufei on 2017/9/19.
 */
import React, {Component,PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    ScrollView
} from 'react-native';

export default class OrderStateCell extends Component {

    constructor(props){
        super(props)
        this._typeView=this._typeView.bind(this)
        this.state = {
            isPushing: false,// 是否跳转中
        };
    }


    _toDetail(orderId,orderState,money,id,statusW,orderItem){
        if (this.state.isPushing === true) {
            console.log("休息一下吧, 您的手速太快了");
            return;
        }

        this.props.navigator.push({
            screen: 'ProgressDetailPage',
            title:'进度详情',
            passProps: {
                orderId:orderId,
                orderState:orderState,
                money:money,
                id:id,
                statusW:statusW,
                orderItem:orderItem
            }
        });

        this.state.isPushing = true;

        this._timer = setTimeout(()=>{
            this.setState({isPushing:false})//0.5秒后可点击
            clearTimeout(this._timer);
        },500);


    }

    render(){
        const {orderId,orderState,time,money,id,order_type,statusW,orderItem} = this.props
        return(
        <View style={styles.container} >
            <View style={styles.wrapper1}>
                <Text style={styles.orderstateTe}>
                    订单状态
                </Text>
                <Text style={styles.orderstate}>
                    {orderState}
                </Text>
            </View>
            <View style={[styles.wrapper1,{marginTop:15}]}>
                <Text style={styles.orderstateTe}>
                    订单号:{orderId}
                </Text>
                <Text style={styles.orderstate}>
                    {money}
                </Text>
            </View>
            <View style={[styles.wrapper1,{marginTop:15}]}>
                <Text style={styles.time}>
                    {time}
                </Text>
                {this._typeView(order_type,orderId,orderState,money,id,statusW,orderItem)}
            </View>

        </View>
        )
    }

    _typeView(order_type,orderId,orderState,money,id,statusW,orderItem){
        if(order_type==1) {
            return (
                <TouchableOpacity onPress={this._toDetail.bind(this, orderId, orderState, money,id,statusW,orderItem)}>
                    <Image style={styles.img}
                           source={require('../../../img/myorder_progress.png')}>
                        <Text style={styles.progressTe}>
                            进度详情
                        </Text>
                    </Image>
                </TouchableOpacity>
            );
        }
    }



}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#FFFFFF',
        paddingBottom:20,
        paddingTop:20,
        marginTop:10

    },
    wrapper1:{
        paddingLeft:15,
        paddingRight:15,
        alignItems:'center',
        backgroundColor:'#FFFFFF',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    orderstateTe:{
        fontSize:16,
        color:'#333333'
    },
    orderstate:{
        fontSize:14,
        color:'#333333'
    },
    time:{
        fontSize:14,
        color:'#999999'
    },
    img:{
        resizeMode:'contain',
        alignItems:'center',
        justifyContent:'center'
    },
    progressTe:{
        fontSize:12,
        color:'#E13238',
        alignItems:'center',
    }
});



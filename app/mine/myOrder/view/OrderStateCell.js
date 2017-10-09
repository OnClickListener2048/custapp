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
import CommenCell from "../../../view/CommenCell";
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../../config';

export default class OrderStateCell extends Component {

    constructor(props){
        super(props)
    }

    static propTypes = {
        orderId: PropTypes.string,
        orderState: PropTypes.string,
        time: PropTypes.string,
        money: PropTypes.string

    };

    _toDetail(orderId,orderState,time,money){
        this.props.navigator.push({
            screen: 'ProgressDetailPage',
            title:'进度详情',
            passProps: {
                orderId:orderId,
                orderState:orderState,
                time:time,
                money:money
            }
        });
    }

    render(){
        const {orderId,orderState,time,money} = this.props
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
                <TouchableOpacity onPress={this._toDetail.bind(this)}>
                <Image style={styles.img}
                       source={require('../../../img/myorder_progress.png')}>
                    <Text style={styles.progressTe}>
                        进度详情
                    </Text>
                </Image>
                </TouchableOpacity>
            </View>

        </View>
        )
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



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
        headImg: PropTypes.number,
        orderId: PropTypes.string,
        orderState: PropTypes.string,
        name: PropTypes.string,//注册公司
        money: PropTypes.string

    };

    _toDetail(headImg, orderId,orderState,name,money){
        this.props.navigator.push({
            screen: 'ProgressDetailPage',
            backButtonTitle: '返回', // 返回按钮的文字 (可选)
            backButtonHidden: false, // 是否隐藏返回按钮 (可选)
            passProps: {
                headImg:headImg,
                orderId:orderId,
                orderState:orderState,
                name:name,
                money:money
            }
        });
    }

    render(){
        const {headImg, orderId,orderState,name,money} = this.props
        return(
        <View style={styles.container} >
            <CommenCell
                style={{marginTop:10}}
                isClick={false}
                leftText={"订单号："+orderId}
                rightText={orderState}
                rightTextStyle={{color:'#e13238',fontSize:16}}
                />
            <View style={styles.wrapper1}>
                <Image style={styles.head_img} source={headImg}/>
                <View style={styles.wrapper2}>
                    <Text style={styles.company_title}>
                        {name}
                    </Text>
                    <View style={styles.wrapper3}>
                        <Text style={styles.money_te}>
                            金额：
                        </Text>
                        <Text style={styles.money_symbol}>
                            ¥
                        </Text>
                        <Text style={styles.money}>
                            {money}
                        </Text>
                    </View>
                </View>

            </View>
            <CommenCell
                style={{marginTop:10}}
                leftText="2017-9-19 11:31"
                rightText="进度详情"
                rightTextStyle={{color:'#999999',fontSize:14}}
                leftTextStyle={{color:'#999999',fontSize:14}}
                onPress={this._toDetail.bind(this,headImg, orderId,orderState,name,money)}
            />
        </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F9F9F9'
    },
    wrapper1:{
        flexDirection:'row',
        width:SCREEN_WIDTH,
        marginLeft:14,
        marginTop:12
    },
    head_img:{
        resizeMode: "contain",
    },
    wrapper2:{
       marginLeft:8,
        marginTop:5
    },
    company_title:{
        fontSize:18,
        color:'#333333'
    },
    wrapper3:{
        flexDirection:'row',
        marginTop:10

    },
    money_te:{
        fontSize:14,
        color:'#999999',
        marginTop:3
    },
    money_symbol:{
        fontSize:14,
        color:'#E13238',
        marginTop:3
    },
    money:{
        fontSize:18,
        color:'#E13238'

    }



});
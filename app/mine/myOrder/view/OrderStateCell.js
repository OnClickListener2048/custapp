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
import styles from '../css/OrderStateCellStyle'

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
            title:'进度详情',
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
            <TouchableOpacity style={styles.wrapper4} onPress={this._toDetail.bind(this,headImg, orderId,orderState,name,money)}>
                <Text style={{color:'#999999',fontSize:14}}>
                    2017-9-19 11:31
                </Text>
                <View style={styles.wrapper5}>
                    <Text style={{color:'#999999',fontSize:14}}>
                        进度详情
                    </Text>
                    <Image style={styles.right_img}
                           source={require('../../../img/left_button.png')}/>

                </View>
            </TouchableOpacity>

        </View>
        )
    }

}



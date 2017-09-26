/**
 * Created by liufei on 2017/9/26.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../../config';

export default class SendBill extends Component {
    render(){
        return(
            <View style={styles.wrapper}>
                <View>
                    <Text style={styles.te}>本月票据尚未发送，为避免延误报税，请本月3日前发快递。</Text>
                    <Text style={styles.te}>收件地址：无</Text>
                    <Text style={styles.te}>收件人：无</Text>
                    <Text style={styles.te}>联系电话：无</Text>
                </View>
                <View style={styles.line}/>

                <View>
                    <Text style={styles.te}>1.银行流水、银行回单（打印纸质）！</Text>
                    <Text style={styles.te}>2.开票明细汇总明细表、上月全部已开发票</Text>
                    <Text style={styles.te}>3.工资表（内含员工身份证号）！</Text>
                    <Text style={styles.te}>
                        4、费用票：交通费（打车费、充值一卡通费用、火车票、汽车票等）、办公费、车辆费（单位名下的汽车过路费、停车费、汽油费、汽车维修、汽车保养及保险）、劳保用品、通讯费、公司租金发票、物业费、差旅费（住宿费、出行费等差旅发生的费用发票）、适当的餐饮费、为员工花费的福利性支出费用、研发产品所发生的费用、开办活动发生的费用发票等。
                    </Text>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper:{
        backgroundColor:'#fafafa',
        paddingVertical:20,
        paddingHorizontal:10,
        marginTop:20,
        marginHorizontal:15

    },
    te:{
        fontSize:14,
        color:'#666666',
        lineHeight:18,
        marginTop:3
    },
    line:{
        height:1,
        width:SCREEN_WIDTH,
        borderBottomColor:'#f0f0f0',
        borderBottomWidth:1 ,
        backgroundColor:'transparent',
        marginTop:15,
        marginBottom:12

    }


});
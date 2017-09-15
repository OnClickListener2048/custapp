/**
 * Created by zhuangzihao on 2017/9/14.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';


export default class SendBill extends Component {
    render(){
        return(
            <View style={{flex:1,position:'relative'}}>
                <View>
                    <Text>本月票据尚未发送，为避免延误报税，请本月3日前发快递</Text>
                    <Text>收件地址：无</Text>
                    <Text>收件人：无</Text>
                    <Text>联系电话：无</Text>
                </View>
                <View>
                    <Text>1.银行流水，银行回单（打印纸质）！</Text>
                    <Text>2.开票明细汇总明细表，上月全部已开发票</Text>
                    <Text>3.工资表（内含员工身份证号）！</Text>
                    <Text>4.费用票，交通分（打车费，充值一卡通费用，火车票，汽车票等）
                    办公费，车辆费（单位名下的汽车过路费，停车费，汽油费，汽车维修，汽车保养及保险）
                        劳保用品，通讯费，公司租金发票，物业费，差旅费（住宿费，出行等差旅发生的费用发票）
                        ，适当的餐饮费，为员工话费的福利性支出费用，研发产品所发生的费用，
                        开办活动发生的费用发票
                    </Text>
                </View>
                <View style={{position:'absolute',bottom:0,left:0,width:DeviceInfo.width,height:150,backgroundColor:'rgba(52, 52, 52, 0.3)' ,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                    <View>
                        <Text style={{color:'white'}}>
                            以上为演示数据
                        </Text>
                        <Text style={{color:'white'}}>
                            您还没有购买公司的服务
                        </Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={{color:'red'}}>立即购买</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
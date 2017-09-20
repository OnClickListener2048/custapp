/**
 * Created by liufei on 2017/9/19.
 */
import React, {Component} from 'react';
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

    render(){
        return(
        <View style={styles.container} >
            <CommenCell
                style={{marginTop:10}}
                isClick={false}
                leftText="订单号：20170919"
                rightText="待分配"
                rightTextStyle={{color:'#e13238',fontSize:16}}
                />
            <View style={styles.wrapper1}>
                <Image style={styles.head_img} source={require('../../../img/head_img.png')}/>
                <View style={styles.wrapper2}>
                    <Text style={styles.company_title}>
                        注册公司
                    </Text>
                    <View style={styles.wrapper3}>
                        <Text style={styles.money_te}>
                            金额：
                        </Text>
                        <Text style={styles.money_symbol}>
                            ¥
                        </Text>
                        <Text style={styles.money}>
                            200
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
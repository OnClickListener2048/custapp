/**
 * Created by liufei on 2017/9/19.
 */
import React, {Component} from 'react';
import BComponent from '../../base/BComponent'
import styles from './css/OrderStateCellStyle'
import {
    View,
    StyleSheet,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import CommenCell from '../../view/CommenCell'
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';

export default class ProgressDetailPage extends BComponent {

    render(){
        return(

        <View style={styles.container} >
            <CommenCell
                style={{marginTop:10}}
                isClick={false}
                leftText={"订单号："+this.props.orderId}
                rightText={this.props.orderState}
                rightTextStyle={{color:'#e13238',fontSize:16}}
            />
            <View style={styles.wrapper1}>
                <Image style={styles.head_img} source={this.props.headImg}/>
                <View style={styles.wrapper2}>
                    <Text style={styles.company_title}>
                        {this.props.name}
                    </Text>
                    <View style={styles.wrapper3}>
                        <Text style={styles.money_te}>
                            金额：
                        </Text>
                        <Text style={styles.money_symbol}>
                            ¥
                        </Text>
                        <Text style={styles.money}>
                            {this.props.money}
                        </Text>
                    </View>
                </View>

            </View>
            <View style={styles.wrapper4} >
                <Text style={{color:'#333333',fontSize:16}}>
                    进度详情
                </Text>
                <Image style={[styles.right_img,{marginRight:10}]}
                       source={require('../../img/detailp.png')}/>
            </View>
            <View style={progressStyles.line}/>
        </View>

        );
    }
}

const progressStyles = StyleSheet.create({
    line:{
        height:1,
        width:SCREEN_WIDTH,
        borderBottomColor:'#ececec',
        borderBottomWidth:1 ,
        backgroundColor:'transparent'
    },

});
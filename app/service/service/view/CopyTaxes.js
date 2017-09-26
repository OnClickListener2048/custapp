/**
 * Created by liufei on 2017/9/25
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';


export default class CopyTaxes extends Component {
    render(){
        return(
            <View style={styles.wrapper}>
                <Text style={styles.te}>
                    手里有税控的老板，每月1日开始一定要进行抄税处理或者上报汇总操作！否则无法纳税申报！！！
                </Text>
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
        lineHeight:18
    }


});
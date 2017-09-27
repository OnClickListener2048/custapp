/**
 * Created by liufei on 2017/9/25.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../../config';

export default class AccountingTreatment extends Component {

    constructor(props){
        super(props)
        this._goto=this._goto.bind(this);

    }

    render(){

        return(
            <View style={styles.wrapper}>
               <View style={styles.wrapper1}>
                   <TouchableOpacity onPress={()=>{this._goto(0)}}>
                   <Image style={styles.img} source={require('../../../img/service_cash_img.png')}>
                       <Text style={styles.text}>
                           现金流
                       </Text>
                   </Image>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={()=>{this._goto(1)}}>
                   <Image style={[styles.img,{marginLeft:20}]} source={require('../../../img/service_profit_img.png')}>
                       <Text style={styles.text}>
                           利润表
                       </Text>
                   </Image>
                   </TouchableOpacity>
               </View>
                <View style={[styles.wrapper1,{marginTop:20}]}>
                    <TouchableOpacity onPress={()=>{this._goto(2)}}>
                        <Image style={styles.img} source={require('../../../img/service_receive_img.png')}>
                            <Text style={styles.text}>
                                应收账款
                            </Text>
                        </Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this._goto(3)}}>
                        <Image style={[styles.img,{marginLeft:20}]} source={require('../../../img/service_cope_img.png')}>
                            <Text style={styles.text}>
                                应付账款
                            </Text>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _goto(index){
        switch (index){
            case 0:
                this.props.navigator.push({
                    screen: 'CashFlowPage',
                    title:'现金流',
                })
                break;
            case 1:
                this.props.navigator.push({
                    screen: 'ProfitStatementPage',
                    title:'利润表',
                })
                break;
            case 2:
                this.props.navigator.push({
                    screen: 'AccountsReceivablePage',
                    title:'应收账款',
                })
                break;
            case 3:
                this.props.navigator.push({
                    screen: 'AccountsPayablePage',
                    title:'应付账款',
                })
                break;
            default:
                break;
        }

    }
}

const styles = StyleSheet.create({
    wrapper:{
       marginHorizontal:20,
        marginTop:30,
        marginBottom:10

    },
    wrapper1:{
        flexDirection:'row',

    },
    img:{
        justifyContent:'center',
        alignItems:'center',
        width:(SCREEN_WIDTH-20-40)/2,
        resizeMode:'contain'
    },
    text:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'transparent',
        fontSize:24,
        color:"#ffffff"

    }


});
/**
 * Created by liufei on 2017/9/25.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
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

                   <TouchableOpacity onPress={()=>{this._goto(0)}}>
                   <Image style={styles.img} source={require('../../../img/service_cash_img.png')}>
                       <Text style={styles.text}>
                           现金流
                       </Text>
                   </Image>
                   </TouchableOpacity>

                   <TouchableOpacity  onPress={()=>{this._goto(1)}}>
                   <Image style={[styles.img]} source={require('../../../img/service_profit_img.png')}>
                       <Text style={styles.text}>
                           利润表
                       </Text>
                   </Image>
                   </TouchableOpacity>

                    <TouchableOpacity style={{marginTop:10}} onPress={()=>{this._goto(2)}}>
                        <Image style={styles.img} source={require('../../../img/service_receive_img.png')}>
                            <Text style={styles.text}>
                                应收账款
                            </Text>
                        </Image>
                    </TouchableOpacity>

                    <TouchableOpacity style={{marginTop:10}}  onPress={()=>{this._goto(3)}}>
                        <Image style={[styles.img]} source={require('../../../img/service_cope_img.png')}>
                            <Text style={styles.text}>
                                应付账款
                            </Text>
                        </Image>
                    </TouchableOpacity>
            </View>
        )
    }

    _goto(index){
        let eventArr = ['s_cash','s_ profit','s_finance','s_receivable','s_payable'];
        UMTool.onEvent(eventArr[index])
        switch (index){
            case 0:
                this.props.push({
                    screen: 'CashFlowPage',
                    title:'现金流',
                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    passProps:{
                        year:this.props.year,
                        month:this.props.month,
                        callback:this.props.callback,
                        companyid:this.props.companyid,
                        is_demo:this.props.is_demo
                    }
                })
                break;
            case 1:
                this.props.push({
                    screen: 'ProfitStatementPage',
                    title:'利润表',
                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    passProps:{
                        year:this.props.year,
                        month:this.props.month,
                        callback:this.props.callback,
                        companyid:this.props.companyid,
                        is_demo:this.props.is_demo
                    }
                })
                break;
            case 2:
                this.props.push({
                    screen: 'AccountsReceivablePage',
                    title:'应收账款',
                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    passProps:{
                        year:this.props.year,
                        month:this.props.month,
                        callback:this.props.callback,
                        companyid:this.props.companyid,
                        is_demo:this.props.is_demo
                    }
                })
                break;
            case 3:
                this.props.push({
                    screen: 'AccountsPayablePage',
                    title:'应付账款',
                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    passProps:{
                        year:this.props.year,
                        month:this.props.month,
                        callback:this.props.callback,
                        companyid:this.props.companyid,
                        is_demo:this.props.is_demo
                    }
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
        marginBottom:10,
        flexDirection:'row',
        justifyContent:'space-between',
        flexWrap:'wrap',
    },

    img:{
        justifyContent:'center',
        alignItems:'center',
        width:(SCREEN_WIDTH-20-40)/2,
        height:(SCREEN_WIDTH-20-40)*0.5/2,
        resizeMode:'contain'
    },
    text:{

        backgroundColor:'transparent',
        fontSize:24,
        color:"#ffffff"

    }


});
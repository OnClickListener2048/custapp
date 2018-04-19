/**
 * Created by jinglan on 2018/4/17.
 */

import React, {PropTypes,Component} from 'react';
import {View, Text,Platform,Image,Dimensions,StyleSheet,TouchableOpacity} from 'react-native';
const window = Dimensions.get('window');

export const SCREEN_WIDTH = window.width;
import {formatmoney} from '../../../util/FormatMoney';

export default class BalanceSheetCell extends Component {

    constructor(props) {
        super(props)
    }

    static propTypes = {
        subjectNO: PropTypes.string,
        messageTitle: PropTypes.string,
        secArr: PropTypes.array,
        banceCellPress:function(){}, //按钮点击事件

    };


        render() {
        const {messageTitle,secArr} = this.props

        return (
            <View style={styles.rowStyle}>
                {!isNaN(this.props.subjectNO) &&  <TouchableOpacity onPress={() => {this.props.banceCellPress(this.props.subjectNO,this.props.messageTitle)}}>
                    <View style={[styles.timeRowStyle]}>
                        <Text
                            textAlign='center'
                            numberOfLines={1}
                            style={[{fontSize: 14,marginLeft:14,marginRight :24 , color : '#333333'}] }>{messageTitle}</Text>
                        <Image source={require('../../../img/left_button.png')} style={[{width: 10,height:15,marginRight:14}]}/>
                    </View>
                </TouchableOpacity>}

                {isNaN(this.props.subjectNO) &&
                    <View style={[styles.timeRowStyle]}>
                        <Text
                            textAlign='center'
                            numberOfLines={1}
                            style={[{fontSize: 14,marginLeft:14,marginRight :24 , color : '#333333'}] }>{messageTitle}</Text>
                    </View>
                }

                <View style={styles.topRowStyle}>
                    <Text style={[{marginLeft:52,fontSize: 12 ,flex:1, color : '#999999',textAlign:"right"}] }>{"借方"}</Text>
                    <Text style={[{marginLeft:10,fontSize: 12 ,flex:1, color : '#999999',textAlign:"right"}] }>{"贷方"}</Text>
                </View>

                {secArr != null &&
                <View style={{flexDirection:'column',width:SCREEN_WIDTH - 28,
                    marginLeft:14,backgroundColor:'white'}}>
                    {
                        secArr.map((item, i) => {
                            return(
                                <View style={[styles.itemViewStyle]}>
                                    <Text style={[{fontSize: 12 ,marginLeft:0,width:52, color : '#999999'}] }>{item.abstract}</Text>
                                    <Text style={[{fontSize: 12 ,flex:1, color : '#333333',textAlign:"right"}] }>{formatmoney(item.sumDebit + 0.0)}</Text>
                                    <Text style={[{marginLeft:10,fontSize: 12 ,flex:1, color : '#333333',textAlign:"right"}] }>{formatmoney(item.sumCredit + 0.0)}</Text>
                                </View>
                            )
                        })
                    }
                </View>
                }

            </View>
        )
    }
}


const styles = StyleSheet.create({

    rowStyle: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        width: SCREEN_WIDTH,
    },

    topRowStyle: {
        flexDirection: 'row',
        alignItems:'center',
        width: SCREEN_WIDTH - 28,
        // backgroundColor:"orange",
        height:40,
        marginLeft:14
    },

    timeRowStyle: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:"space-between",
        width:SCREEN_WIDTH,
        height:40,
        borderBottomColor:"#D1D1D1",
        borderBottomWidth:0.5
    },

    buttonStyle: {
        backgroundColor: 'transparent',
        marginLeft: 14,
        borderRadius: 2,
        borderColor: '#CEAF72',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 28,
        width: 76,
    },

    buttonTextStyle: {
        fontSize: 12,
        color: '#CEAF72',
        textAlign: 'center'
    },

    grayBtnStyle: {
        backgroundColor: '#D8D8D8',
        marginLeft: 12,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 28,
        width: 76,
    },

    grayBtnTextStyle: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center'
    },

    itemViewStyle: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems:'center',
        height:36
    },
});
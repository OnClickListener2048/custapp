/**
 * Created by jinglan on 2018/4/13.
 */
import React, {PropTypes,Component} from 'react';
import {View, Text,Platform,Image,Dimensions,StyleSheet,ScrollView,TouchableOpacity} from 'react-native';
const window = Dimensions.get('window');

export const SCREEN_WIDTH = window.width;
import {formatmoney} from '../../../util/FormatMoney';

const cellWidth = SCREEN_WIDTH + 100;

export default class GeneralLedgerCell extends Component {

    constructor(props) {
        super(props)

    }

    static propTypes = {
        subjectNO: PropTypes.string,
        messageTitle: PropTypes.string,
        messageTime: PropTypes.string,
        secArr: PropTypes.array,
        generaLedgerCellPress:function(){}, //按钮点击事件
    };


    render() {
        const {messageTitle,messageTime,secArr} = this.props;
        return (
                <View style={styles.rowStyle}>


                    {!isNaN(this.props.subjectNO) &&
                    <TouchableOpacity onPress={() => {this.props.generaLedgerCellPress(this.props.subjectNO,this.props.messageTitle)}}>

                        <View style={[styles.timeRowStyle]}>
                            <Text
                                textAlign='center'
                                numberOfLines={1}
                                style={[{fontSize: 14,marginLeft:14,width :SCREEN_WIDTH - 140 , color : '#333333'}] }>{messageTitle}</Text>

                            <View style={{height:25,width:100,marginRight :14,flexDirection: 'row-reverse', alignItems:'center'}}>
                                <Image
                                    source={require('../../../img/left_button.png')}
                                    style={[{width: 10,height:15}]}/>
                                <Text style={[{fontSize: 14,marginRight :6 , color : '#999999'}] }>{messageTime}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>}

                    {isNaN(this.props.subjectNO) &&
                    <View style={[styles.timeRowStyle,{justifyContent:"space-between"}]}>
                        <Text
                            textAlign='left'
                            numberOfLines={1}
                            style={[{fontSize: 14,marginLeft:14 , color : '#333333'}] }>{messageTitle}</Text>
                        <Text style={[{fontSize: 14,marginRight :14 , color : '#999999'}] }>{messageTime}</Text>

                    </View>
                    }





                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.scrollViewStyle}>

                        <View style={styles.topRowStyle}>
                            <Text style={[{fontSize: 12 ,flex:1, marginLeft:60, color : '#999999',textAlign:"right"}] }>{"借方"}</Text>
                            <Text style={[{fontSize: 12 ,flex:1, marginLeft:10, color : '#999999',textAlign:"right"}] }>{"贷方"}</Text>
                            <Text style={[{fontSize: 12 ,flex:1.2, marginLeft:10, color : '#999999',textAlign:"right"}] }>{"余额"}</Text>
                        </View>

                        <View style={{flexDirection:'column',width:cellWidth - 28,
                            marginLeft:14,backgroundColor:'white'}}>
                            {
                                secArr.map((item, i) => {
                                    return(
                                        <View style={[styles.itemViewStyle]}>
                                            <Text style={[{fontSize: 12 ,marginLeft:0,width:60, color : '#999999'}] }>{item.abstract}</Text>
                                            <Text style={[{fontSize: 12 ,flex:1, color : '#333333',textAlign:"right"}] }>{formatmoney(item.debit + 0.0)}</Text>
                                            <Text style={[{fontSize: 12 ,flex:1, marginLeft:10, color : '#333333',textAlign:"right"}] }>{formatmoney(item.credit + 0.0)}</Text>

                                            <View style={{height:36,flex:1.2, marginRight :14,flexDirection: 'row-reverse', alignItems:'center'}}>
                                                <Text style={[{fontSize: 12 ,flex:1, color : '#333333',textAlign:"right"}] }>{formatmoney(item.balance + 0.0)}</Text>

                                                <Text style={[{fontSize: 12 ,flex:0.2,width:14, marginLeft:10 , color : '#CEAF72',textAlign:"center"}] }>{item.direct}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>

                        </View>

                    </ScrollView>

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
    scrollViewStyle: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        width: cellWidth,


    },
    topRowStyle: {
        flexDirection: 'row',
        alignItems:'center',
        width: cellWidth - 28,
        // backgroundColor:"orange",
        height:40,
        marginLeft:14

    },

    timeRowStyle: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems:'center',
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
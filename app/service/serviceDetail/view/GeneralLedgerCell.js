/**
 * Created by jinglan on 2018/4/13.
 */
import React, {PropTypes,Component} from 'react';
import {View, Text,Platform,Image,Dimensions,StyleSheet} from 'react-native';
const window = Dimensions.get('window');

export const SCREEN_WIDTH = window.width;

export default class GeneralLedgerCell extends Component {

    constructor(props) {
        super(props)

    }

    static propTypes = {
        isRead: PropTypes.isRead,
        messageTitle: PropTypes.string,
        messageTime: PropTypes.string,
        secArr: PropTypes.array

    };
// ,{backgroundColor:"orange"}


    render() {
        // const { style} = this.props
        const {messageTitle,messageTime,secArr} = this.props

        return (
            <View style={styles.rowStyle}>

                <View style={[styles.timeRowStyle]}>

                    <Text
                        textAlign='center'
                        numberOfLines={1}
                        style={[{fontSize: 14,marginLeft:14,marginRight :120 , color : '#333333'}] }>{messageTitle}</Text>

                    <View style={{height:25,marginRight :14,flexDirection: 'row-reverse', alignItems:'center'}}>
                        <Image
                            source={require('../../../img/left_button.png')}
                            style={[{width: 10,height:15}]}/>
                        <Text style={[{fontSize: 14,marginRight :6 , color : '#999999'}] }>{messageTime}</Text>
                    </View>

                </View>


                <View style={styles.topRowStyle}>
                    <View style={{width:0.5,marginTop:18,marginLeft:52,height:22,backgroundColor:"#D1D1D1"}}/>
                    <Text style={[{fontSize: 12 ,flex:1, color : '#999999',textAlign:"right"}] }>{"借方"}</Text>
                    <Text style={[{fontSize: 12 ,flex:1, color : '#999999',textAlign:"right"}] }>{"贷方"}</Text>
                    <Text style={[{fontSize: 12 ,flex:1.1, color : '#999999',textAlign:"right"}] }>{"余额"}</Text>
                </View>

                <View style={{flexDirection:'column',width:SCREEN_WIDTH - 28,
                    marginLeft:14,backgroundColor:'white',borderTopWidth:0.5,borderTopColor:'#D1D1D1'}}>
                    {
                        secArr.map((item, i) => {


                            return(
                                <View style={[styles.itemViewStyle]}>
                                    <Text style={[{fontSize: 12 ,marginLeft:0,width:51, color : '#999999',textAlign:"right"}] }>{item.abstract}</Text>
                                    <View style={{width:0.5,marginLeft:1,height:36,backgroundColor:"#D1D1D1"}}/>
                                    <Text style={[{fontSize: 12 ,flex:1, color : '#333333',textAlign:"right"}] }>{item.debit == 0 ? "-" : item.debit}</Text>
                                    <Text style={[{fontSize: 12 ,flex:1, color : '#333333',textAlign:"right"}] }>{item.credit == 0 ? "-" : item.credit}</Text>
                                    <Text style={[{fontSize: 12 ,width:14, color : '#CEAF72',textAlign:"center"}] }>{item.direct}</Text>
                                    <Text style={[{fontSize: 12 ,flex:1.1, color : '#333333',textAlign:"right"}] }>{item.balance == 0 ? "-" : item.balance}</Text>
                                </View>
                            )
                        })
                    }
                </View>

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
        backgroundColor: '#F1F1F1',
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:"space-between",
        width:SCREEN_WIDTH,
        height:40
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
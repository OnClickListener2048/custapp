/**
 * 多行输入框
 */

import React, {Component,PropTypes} from 'react';
import {Text, TextInput, View, Platform, Image,StyleSheet,Dimensions} from "react-native";
import styles from "../css/GetLicenseStyle";
import px2dp from '../../../util/index'
import {SCREEN_WIDTH as width} from '../../../config';
const window = Dimensions.get('window');

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

export default class MultiTextInputView extends Component {

    constructor(props) {
        super(props);
        this.state = { content: this.props.content,
        textName:this.props.textName};
        this.setBiz = this.setBiz.bind(this);

    }

    static propTypes = {
        //style: PropTypes.object,
        textName: PropTypes.string,
        content:PropTypes.string,
    };

    setBiz(bizRange) {
        this.setState({content : bizRange});
    }

    render(){
        return(
            <View style={stylesMulti.container}>
                <View style={stylesMulti.registerNumStyle}>
                    <Text style={[{
                        marginLeft : 15,fontSize:15,color:'#323232',width:85}]}>{this.props.textName}</Text>
                <View style={stylesMulti.inputArea}>
                        <Text  multiline={true}
                                   numberOfLines={3}
                               style={stylesMulti.textInputMultiLine}
                        >{this.state.content}</Text>
                </View>
                </View>
            </View>

        )};

}

const stylesMulti = StyleSheet.create({

    container: {
        flex:1,
        backgroundColor: 'white',
        flexDirection: 'column'
    },

    registerNumStyle: {
        width: SCREEN_WIDTH - 15,
        flex: 1,
        flexDirection: 'row',
        justifyContent:'space-between',
    },

    inputArea: {
        flex:1,
        width: width - 115,
        height:px2dp(110),
        justifyContent: 'flex-end',
        marginLeft: 0,
        marginTop: 0,
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 0.5,
    },
    textInputMultiLine: {
        marginLeft: px2dp(0),
        padding: 0,
        fontSize: px2dp(30),
        textAlign: 'left',
        color:'#323232',
        backgroundColor:'white',
    },
});
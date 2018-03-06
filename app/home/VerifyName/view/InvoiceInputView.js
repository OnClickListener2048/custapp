/**
 * Created by jiaxueting on 2017/9/26.
 */

import React, {Component,PropTypes} from 'react';
import {Text, TextInput, View, Platform, Image,} from "react-native";

export default class InvoiceInputView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentType:this.props.contentType,
            content: this.props.content,
            textName:this.props.textName,
            keyboardType:this.props.keyboardType,
            textEditable:this.props.textEditable,
            maxLength:this.props.maxLength};

    }

    static propTypes = {
        //style: PropTypes.object,
        contentType:PropTypes.string,
        textName: PropTypes.string,
        content:PropTypes.string,
        keyboardType:PropTypes.string,
        textEditable:PropTypes.bool,
        maxLength:PropTypes.number,
    };


    _clearTextInput(){
        this.refs.invoiceInputText.clear();
    }



    render(){
        return(
            <View style={styles.container}>
                <View style={styles.registerNumStyle}>
                <View style={styles.textInputContainer}>
                    <View style={[styles.textInputWrapper]}>
                        <TextInput
                                   ref = {"invoiceInputText"}
                                   underlineColorAndroid='transparent'
                                   value={this.state.content}
                                   editable={this.props.textEditable}
                                   maxLength = {this.props.maxLength}
                                   keyboardType={this.props.keyboardType}
                                   style={styles.textInput} placeholder={this.props.textName} placeholderTextColor={'#999999'} returnKeyType='next'
                                   onChangeText={
                                       (legalPerson) => {
                                           this.props.callback(this.props.contentType,legalPerson);
                                           this.setState({content:legalPerson});
                                       }
                                   }/>
                    </View>
                </View>
                </View>

            </View>

        )};

}

import {StyleSheet, Dimensions} from 'react-native';
const window = Dimensions.get('window');

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    // phone input box
    textInputContainer: {
        height: 50,
        // width: SCREEN_WIDTH,
        // backgroundColor: '#FFDDFF',
        flexDirection: 'row',
    },

    // phone input box
    textInputWrapper: {
        minHeight: 50,
        maxHeight:50,
        width: SCREEN_WIDTH-30-90,
        backgroundColor: 'transparent',
        // position: 'relative',
        marginRight: 15,
        flexDirection: 'row',
    },

    textInput: {
        flex: 1,
        width: SCREEN_WIDTH-30-90,
        padding: 0,
        color:'#333333',
        fontSize: 17,
    },

    registerNumStyle: {
        width: SCREEN_WIDTH - 30-90,
        // flex: 1,
        height: 50,
        flexDirection: 'row',
        justifyContent:'space-between'
    },


});
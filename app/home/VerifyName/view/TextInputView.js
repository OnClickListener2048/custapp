/**
 * Created by jiaxueting on 2017/9/26.
 */

import React, {Component,PropTypes} from 'react';
import {Text, TextInput, View, Platform, Image,} from "react-native";

export default class TextInputView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentType:this.props.contentType,
            content: this.props.content,
        textName:this.props.textName,
            textEditable:this.props.textEditable};

    }

    static propTypes = {
        //style: PropTypes.object,
        contentType:PropTypes.string,
        textName: PropTypes.string,
        content:PropTypes.string,
        textEditable:PropTypes.bool,
    };



    render(){
        return(
            <View style={styles.container}>
                <View style={styles.registerNumStyle}>
                <View style={styles.textInputContainer}>
                    <View style={[styles.textInputWrapper]}>
                        <TextInput underlineColorAndroid='transparent'
                                   value={this.state.content}
                                   editable={this.props.textEditable}
                                   style={styles.textInput} placeholder={this.props.textName} returnKeyType='next'
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
        width: SCREEN_WIDTH-30,
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 0.5,
        backgroundColor: 'transparent',
        // position: 'relative',
        marginRight: 15,
        marginLeft: 15,
        flexDirection: 'row',
    },

    textInput: {
        flex: 1,
        width: SCREEN_WIDTH-30,
        padding: 0,
        color:'#333333',
        fontSize: 16,
    },

    registerNumStyle: {
        marginTop : 5,
        width: SCREEN_WIDTH - 30,
        // flex: 1,
        height: 50,
        flexDirection: 'row',
        justifyContent:'space-between'
    },


});
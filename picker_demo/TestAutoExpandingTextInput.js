import React, {Component,PropTypes} from 'react';
import {Text, TextInput, View, Platform, Image,StyleSheet} from "react-native";

export default class AwesomeProject extends Component {
    _onChangeText(newText) {
        console.log('inputed text:' + newText);
    }

    render() {
        return (
            <View style={styles.container}>
                <AutoExpandingTextInput
                    style={styles.textInputStyle}
                    onChangeText={this._onChangeText}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInputStyle: { //文本输入组件样式
        width: 300,
        height: 50,
        fontSize: 20,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "grey"
    }
});
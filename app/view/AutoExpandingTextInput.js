/**
 * 自动调整高度的文本框.
 * http://www.jianshu.com/p/f7519fe2f9ef
 * 用法:
 import AutoExpandingTextInput from './AutoExpandingTextInput';

 class AwesomeProject extends Component {
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
 * Created by beansoft on 2017/6/27.
 */
import React, {Component} from 'react';
import {AppRegistry, TextInput, StyleSheet} from 'react-native';

export default class AutoExpandingTextInput extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            text: '',
            height: 0
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        console.log(event.nativeEvent);
        this.setState({
            text: event.nativeEvent.text,
            height:event.nativeEvent.contentSize.height
        });
    }
    onContentSizeChange(params){
        console.log(params);
    }
    render() {
        return (
            <TextInput {...this.props}  //将组件定义的属性交给TextInput
                       multiline={true}
                       onChange={this.onChange}
                       onContentSizeChange={this.onContentSizeChange}
                       style={[styles.textInputStyle,{height:Math.max(35,this.state.height)}]}
                       value={this.state.text}
            />
        );
    }
}

const styles = StyleSheet.create({
    textInputStyle: { //文本输入组件样式
        width: 300,
        height: 30,
        fontSize: 20,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "grey"
    }
});
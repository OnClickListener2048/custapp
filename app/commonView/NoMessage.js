/**
 * 统一，暂无消息页面
 * Created by jiaxueting on 2017/6/15.
 */


import React,{Component,PropTypes}from 'react';
import {Image, Text, View,StyleSheet} from "react-native";

export default class NoMessage extends Component{
    constructor(props) {
        super(props)
        this.state=
        {
            textContent:this.props.textContent,
            active :this.props.active,
        }
    }

    static propTypes = {
        textContent: PropTypes.string,
        active:PropTypes.number,
    };

    render() {
        //提交测试
        return(
               <View style={styles.noMessageContainer}>
                    <Image style={styles.noMessageImg}
                           source={this.props.active}/>
                    <Text style={styles.welcome}>
                        {this.props.textContent}
                    </Text>
                </View>
                )
    }
}

const styles = StyleSheet.create({
    noMessageContainer:{
        justifyContent:'center',
        alignItems:'center',
    },
    welcome: {
        fontSize: 18,
        marginTop:20,
        color:'#969696',
    },
    noMessageImg:{
        marginTop:160,

    }
});
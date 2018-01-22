import React, {Component} from "react";
import {Text, View} from "react-native";
import Toast from 'react-native-root-toast';
import {QRScannerView} from './code';
import BComponent from '../base'
export default class QRCodeScreenPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            Recognize:false
        };
    }

    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    render() {
        return (

            < QRScannerView
                bottomMenuStyle={{height: 0, backgroundColor: '#393A3F', opacity: 1}}
                hintTextPosition={120}
                hintTextStyle={{color:'#C0C0C0'}}
                maskColor={'#0000004D'}
                borderWidth={0}
                iscorneroffset={false}
                cornerOffsetSize={0}
                scanBarAnimateTime={3000}
                onScanResultReceived={this.barcodeReceived.bind(this)}

                renderTopBarView={() => {
                    return null
                }}

                renderBottomMenuView={() => {
                    return null
                }}
            />
        )
    }

    barcodeReceived(e) {

        if(this.state.Recognize) return
        this.props.navigator.pop()
        let _this = this;
        this.setState({Recognize:true},()=>{
            _this.props.callback && this.props.callback(e)
        })
    }
}
/**
 * Created by liufei on 2018/1/22.
 */


import SubmitButtonWithIcon from "../../view/SubmitButtonWithIcon";
import SubmitButton from "../../view/SubmitButton";

import React, {Component,PropTypes} from 'react';
import {

    StyleSheet,
    Text,
    View,
    Image

} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';

export default class InvoiceMainPage extends Component {

    constructor(props){
        super(props)
        this.scan=this.scan.bind(this);
        this.check=this.scan.bind(this);
    }

    //开始扫描
    scan(){

    }

    //手工录入查验
    check(){

    }

    render(){
        return(
            <View>
                <View style={{alignItems:'center'}}>
                    <Image
                        source={require('../../img/invoice_home_icon.png')}
                        style={{marginTop:50,}}
                    />
                    <Text style={{fontSize:18,color:'#333333',marginTop:30}}>
                        扫描二维码查验
                    </Text>
                </View>



                <View style={{marginTop:50}}>
                    <SubmitButtonWithIcon
                        isEnabled={true}
                        text="开始扫描"
                        img={require('../../img/scan_icon.png')}
                        buttonStyle={{width:SCREEN_WIDTH-40}}
                        textStyle={{ marginLeft: 10}}
                        onPress={() => {
                            this.scan()
                        }}
                    />
                    <SubmitButton
                        isEnabled={false}
                        text="手工录入查验"
                        buttonStyle={{width:335}}
                        onPress={() => {
                            this.check()
                        }}

                    />
                </View>
            </View>
        )
    }
}








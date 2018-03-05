/**
 * Created by liufei on 2018/3/5.
 */

import React from 'react';
import BComponent from '../../base/BComponent';
import {StyleSheet,Button,ScrollView,View,FlatList,Text,TouchableOpacity,Image,TouchableWithoutFeedback} from 'react-native';
import SubmitButtonWithIcon from "../../view/SubmitButtonWithIcon";
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import SubmitButton from "../../view/SubmitButton";
import Alert from "react-native-alert";
import * as apis from '../../apis';

export default class CheckInvoiceTitlePage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    //编辑
    edit(){

    }

    //删除
    del(){

    }



    render(){
        return(

            <ScrollView style={styles.container}>
                <View style={styles.wrp}>
                    <Text style={styles.text_title}>
                        名  称：
                    </Text>
                    <Text style={styles.text_context}>
                        北京爱康定
                    </Text>
                    <View style={[styles.line,{marginLeft:20}]}/>
                </View>
                <View style={styles.wrp}>
                    <Text style={styles.text_title}>
                        税  号：
                    </Text>
                    <Text style={styles.text_context}>
                        1998899388
                    </Text>
                    <View style={[styles.line,{marginLeft:20}]}/>
                </View>
                <View style={styles.wrp}>
                    <Text style={styles.text_title}>
                       单位地址：
                    </Text>
                    <Text style={styles.text_context}>
                        北京市朝阳区
                    </Text>
                    <View style={[styles.line,{marginLeft:20}]}/>
                </View>
                <View style={styles.wrp}>
                    <Text style={styles.text_title}>
                        电话号码：
                    </Text>
                    <Text style={styles.text_context}>
                        0108893893
                    </Text>
                    <View style={[styles.line,{marginLeft:20}]}/>
                </View>
                <View style={styles.wrp}>
                    <Text style={styles.text_title}>
                        开户银行：
                    </Text>
                    <Text style={styles.text_context}>
                        中国银行
                    </Text>
                    <View style={[styles.line,{marginLeft:20}]}/>
                </View>
                <View style={styles.wrp}>
                    <Text style={styles.text_title}>
                        银行账户：
                    </Text>
                    <Text style={styles.text_context}>
                        62267788778
                    </Text>
                </View>

                <View style={{marginTop:50}}>
                    <SubmitButton
                        isEnabled={true}
                        text="编辑"
                        buttonStyle={{width:SCREEN_WIDTH-30,height:50}}
                        onPress={() => {
                            this.edit()
                        }}
                    />
                    <SubmitButton
                        isEnabled={false}
                        text="删除"
                        buttonStyle={{width:SCREEN_WIDTH-30,height:50}}
                        onPress={() => {
                            this.del()
                        }}

                    />
                </View>
            </ScrollView>
        )
    }





}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F9F9F9',
        flex: 1,
    },
    wrp:{
        backgroundColor:'#FFFFFF',
        flexDirection:'row',
        width:SCREEN_WIDTH,
        height:50,
        paddingLeft:20
    },
    text_title:{
        color:'#000000',
        fontSize:14,
    },
    text_context:{
        color:'#333333',
        fontSize:14,
        marginLeft:30
    },
    line:{
        height:1,
        width:SCREEN_WIDTH,
        borderBottomColor:'#ececec',
        borderBottomWidth:0.5 ,
        backgroundColor:'transparent'
    },


})



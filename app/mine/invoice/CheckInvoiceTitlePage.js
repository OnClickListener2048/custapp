/**
 * Created by liufei on 2018/3/5.
 */

import React from 'react';
import BComponent from '../../base/BComponent';
import {StyleSheet,Button,ScrollView,View,FlatList,Text,TouchableOpacity,Image,TouchableWithoutFeedback} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import SubmitButton from "../../view/SubmitButton";
import Alert from "react-native-alert";
import Toast from 'react-native-root-toast';

import * as apis from '../../apis';

export default class CheckInvoiceTitlePage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            _id:'',//发票抬头id
            company:'',//公司名称
            taxID:'',//税号
            address:'',//公司地址
            mobile:'',//公司电话
            bank:'',//开户银行
            account:'',//银行账户

        };
    }


    componentWillMount() {

        apis.loadInvoiceDetialData(this.props.id).then(
            (responseData) => {

                if (responseData.code === 0) {
                    this.setState({
                        _id:responseData.data._id,
                        company:responseData.data.company,
                        taxID:responseData.data.taxID,
                        address:responseData.data.address,
                        mobile:responseData.data.mobile,
                        bank:responseData.data.bank,
                        account:responseData.data.account
                        }
                    )

                }else{
                    Toast.show("数据请求失败");
                }
            },
            (e) => {
                Toast.show("数据请求失败");
            },
        )
    }

    //编辑
    edit(){
        this.push({
            screen: 'AddInvoiceTitlePage',
            title:'编辑',
            passProps: {
                _id: this.state._id,
                company:this.state.company,
                taxID:this.state.taxID,
                address:this.state.address,
                mobile:this.state.mobile,
                bank:this.state.bank,
                account:this.state.account,
            }
        });
    }

    //删除
    del(){
        Alert.alert('', '删除成功', [{
            text: "确定",
            onPress: ()=>{
                Toast.show("删除成功"); ;
            },
            color:'#C6A567'
        },
        ]);
    }



    render(){
        return(

            <ScrollView style={styles.container}>
                <View style={[styles.wrp,{paddingTop:20}]}>
                    <Text style={styles.text_title}>
                        名        称：
                    </Text>
                    <Text style={styles.text_context}>
                        {this.state.company}
                    </Text>

                </View>
                <View style={[styles.line,{marginLeft:20}]}/>
                <View style={styles.wrp}>
                    <Text style={styles.text_title}>
                        税        号：
                    </Text>
                    <Text style={styles.text_context}>
                        {this.state.taxID}
                    </Text>
                </View>
                <View style={[styles.line,{marginLeft:20}]}/>
                <View style={styles.wrp}>
                    <Text style={styles.text_title}>
                       单位地址：
                    </Text>
                    <Text style={styles.text_context}>
                        {this.state.address}
                    </Text>
                </View>
                <View style={[styles.line,{marginLeft:20}]}/>
                <View style={styles.wrp}>
                    <Text style={styles.text_title}>
                        电话号码：
                    </Text>
                    <Text style={styles.text_context}>
                        {this.state.mobile}
                    </Text>
                </View>
                <View style={[styles.line,{marginLeft:20}]}/>
                <View style={styles.wrp}>
                    <Text style={styles.text_title}>
                        开户银行：
                    </Text>
                    <Text style={styles.text_context}>
                        {this.state.bank}
                    </Text>
                </View>
                <View style={[styles.line,{marginLeft:20}]}/>
                <View style={styles.wrp}>
                    <Text style={styles.text_title}>
                        银行账户：
                    </Text>
                    <Text style={styles.text_context}>
                        {this.state.account}
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
        paddingLeft:20,
        alignItems:'center'
    },
    text_title:{
        color:'#000000',
        fontSize:16,
    },
    text_context:{
        color:'#333333',
        fontSize:16,
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



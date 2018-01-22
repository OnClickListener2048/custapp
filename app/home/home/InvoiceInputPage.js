/**
 * Created by jiaxueting on 2018/1/22.
 */
import React from 'react';
import BComponent from '../../base/BComponent';
import InvoiceInputView from "../VerifyName/view/InvoiceInputView";
import {StyleSheet,Button,ScrollView,View,FlatList,Text,TouchableOpacity,Image,TouchableWithoutFeedback} from 'react-native';
import SinglePickerView from "../VerifyName/view/SinglePickerView";

export default class TestPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            dataline:'--',//页面显示的日期2018-01-22
            isPickerOpen:false,
            dataPush:'',//接口上传的日期20180122
        };
    }

    //输入框子组件
    rendercheckCodeInput(textType,textName,textContent,maxLength){
        return(
            <InvoiceInputView
                callback={this._isNotEmpty}
                contentType={textType}
                textName={textName}
                content={textContent}
                maxLength={maxLength}
                textEditable={true}/>
        )

    }

    renderNumberInput(textType,textName,textContent,maxLength){
        return(
            <InvoiceInputView
                callback={this._isNotEmpty}
                contentType={textType}
                textName={textName}
                content={textContent}
                maxLength={maxLength}
                keyboardType="number-pad"
                textEditable={true}/>
        )

    }

    _isNotEmpty(contentType,content){

    }

    //获取日期数据信息
    _corpTypeBtnClick(){
        this.setState({
            isPickerOpen : this.refs.datapicker.state.isPickerOpen,
            dataline:this.refs.datapicker.state.valueFormat,
            dataPush:this.refs.datapicker.state.value,
        })
    }

    render(){
        return(
            <ScrollView style={styles.container}>
                <View style={styles.invoiceCheck_wrp}>
                    <Text style={styles.text_name} >发票代码：</Text>
                    {this.renderNumberInput('codeInputValue','请输入发票代码','',12)}
                </View>

                <View style={styles.invoiceCheck_wrp}>
                    <Text style={styles.text_name} >发票号码：</Text>
                    {this.renderNumberInput('numberInputValue','请输入发票号码','',8)}
                </View>


                <View style={styles.invoiceCheck_wrp}>
                    <Text style={styles.text_name} >开票日期:</Text>
                    <SinglePickerView valueFormat={'2018-01-22'}
                                      ref="datapicker"
                                      callback={this._corpTypeBtnClick.bind(this)}/>
                </View>

                <View style={styles.invoiceCheck_wrp}>
                    <Text style={styles.text_name} >校验码：</Text>
                    {this.rendercheckCodeInput('checkCodeInputValue','请输入后六位校验码','',6)}

                </View>

                <Button style={styles.buttonStyle} title="查验" ></Button>
        <Button style={styles.whiteButtonStyle} title="重置"></Button>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F9F9F9',
        flex: 1,
    },
    invoiceCheck_wrp:{
        flexDirection:'row',
        marginTop:10,
        paddingLeft:15,
        height:60,
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#FFFFFF',
    },
    text_name:{
        color: '#333333',
        fontSize:17,
    },
    text_picker:{
        color: '#333333',
    },
    buttonStyle: {
        color: '#FFFFFF',
    },
    whiteButtonStyle: {
        color: '#CEAF72',

    }
})


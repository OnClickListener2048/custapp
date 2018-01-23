/**
 * Created by jiaxueting on 2018/1/22.
 */
import React from 'react';
import BComponent from '../../base/BComponent';
import InvoiceInputView from "../VerifyName/view/InvoiceInputView";
import {StyleSheet,Button,ScrollView,View,FlatList,Text,TouchableOpacity,Image,TouchableWithoutFeedback} from 'react-native';
import SinglePickerView from "../VerifyName/view/SinglePickerView";
import SubmitButtonWithIcon from "../../view/SubmitButtonWithIcon";
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import SubmitButton from "../../view/SubmitButton";

export default class TestPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            isPickerOpen:false,
            result:'',//二维码返回code
            codeInputValue: '',//发票代码
            numberInputValue: '',//发票号码
            dateTime:'--',//开票日期
            dateFormat:'',//纯数字日期
            invoiceType:'',//发票类型
            amount:'',//金额
            checkCodeInputValue: '',//校验码
            textContent:'校验码：',//校验码or金额
            inputContent:'请输入校验码后六位',//输入框提示信息
        };
        this._verifyTap = this._verifyTap.bind(this);
        this._resetTap = this._resetTap.bind(this);

    }

    componentWillMount() {
        function formatTime(date) {
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()
            return [year, month, day].map(formatNumber).join('-')
        }
        function formatNumber(n) {
            n = n.toString()
            return n[1] ? n : '0' + n
        }

        this.setState({
            dateTime:formatTime(new Date()),
            dateFormat:formatTime(new Date()).replace(/-/g, "")
        })

        console.log("dateTime="+formatTime(new Date())+"dateFormat="+formatTime(new Date()).replace(/-/g, ""))
    }

    //输入框子组件
    rendercheckCodeInput(textType,textName,textContent,maxLength){
        return(
            <InvoiceInputView
                ref = {textType}
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
                ref = {textType}
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
            dateTime:this.refs.datapicker.state.valueFormat,
            dateFormat:this.refs.datapicker.state.value,
        })
    }

    //点击查验
    _verifyTap(){
        this.push({
            title: '发票信息',
            screen: 'InvoiceInfoPage',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps:{
            }
        });
    }

    //点击重置
    _resetTap(){
        console.log("重置");
        function nowTime(date) {
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()
            return [year, month, day].map(nowNumber).join('-')
        }
        function nowNumber(n) {
            n = n.toString()
            return n[1] ? n : '0' + n
        }
        this.setState({
            dateTime:nowTime(new Date()),
            dateFormat:nowTime(new Date()).replace(/-/g, ""),
            codeInputValue:'',
            numberInputValue:'',
            checkCodeInputValue:'',
            amount:'',
            invoiceType:'04',
        })

        this.refs.codeInputValue._clearTextInput()
        this.refs.numberInputValue._clearTextInput()
        this.refs.checkCodeInputValue._clearTextInput()

    }

    render(){
        console.log("刷新数据。页面"+this.state.reset);
            return(
            <ScrollView style={styles.container}>
                <View>
                    <View style={styles.invoiceCheck_wrp}>
                        <Text style={styles.text_name} >发票代码：</Text>
                        {this.renderNumberInput('codeInputValue','请输入发票代码',this.state.codeInputValue,12)}
                    </View>

                    <View style={styles.invoiceCheck_wrp}>
                        <Text style={styles.text_name} >发票号码：</Text>
                        {this.renderNumberInput('numberInputValue','请输入发票号码',this.state.numberInputValue,8)}
                    </View>


                    <View style={styles.invoiceCheck_wrp}>
                        <Text style={styles.text_name} >开票日期:</Text>
                        <SinglePickerView dateTime={this.state.dateTime}
                                          ref="datapicker"
                                          callback={this._corpTypeBtnClick.bind(this)}/>
                    </View>

                    <View style={styles.invoiceCheck_wrp}>
                        <Text style={styles.text_name} >校验码：</Text>
                        {this.rendercheckCodeInput('checkCodeInputValue','请输入后六位校验码',this.state.checkCodeInputValue,6)}

                    </View>

                    <View style={{marginTop:50}}>
                        <SubmitButton
                            isEnabled={true}
                            text="查验"
                            buttonStyle={{width:SCREEN_WIDTH-40,height:50}}
                            onPress={() => {
                                this._verifyTap()
                            }}
                        />
                        <SubmitButton
                            isEnabled={false}
                            text="重置"
                            buttonStyle={{width:SCREEN_WIDTH-30}}
                            onPress={() => {
                                this._resetTap()
                            }}

                        />
                    </View>
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


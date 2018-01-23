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
import Alert from "react-native-alert";
import InvoiceType from "../../view/invoiceType"

export default class TestPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            result:'',//二维码扫描信息
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
            textType:'0',//0为校验码 1为金额
        };
        this._verifyTap = this._verifyTap.bind(this);
        this._resetTap = this._resetTap.bind(this);
        this._isNotEmpty = this._isNotEmpty.bind(this);

    }

    componentWillMount() {
        if(this.props.result){
            //解析，读取展示二维码信息
            const arr=this.props.result.split(",");
            //格式化日期
            for(var i=0;i<arr[5].length;i++){
                var str = arr[5].split('');
                for (var i = 0; i < str.length; i++){
                    if(i===3||i===5)
                        str[i] += '-';
                }
            }
            this.setState({
                codeInputValue:arr[2],
                numberInputValue:arr[3],
                checkCodeInputValue:arr[6]>6?arr[6].substring(arr[6].length-6,arr[6].length):arr[6],
                dateTime:str.join(''),
                dateFormat:arr[5],
                invoiceType:arr[1],
                amount:arr[4]
            })

            if(this.invoiceType==='01'||this.invoiceType==='02'||this.invoiceType==='03'){//金额
                this.setState({textType:'1'})

            }else if(this.invoiceType==='04'||this.invoiceType==='10'||this.invoiceType==='11'){//校验码
                this.setState({textType:'0'})

            }else{
                this.setState({textType:'0'})

            }
        }else {
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
                dateTime: formatTime(new Date()),
                dateFormat: formatTime(new Date()).replace(/-/g, "")
            })
        }

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
        switch(contentType){
            case 'codeInputValue':
                this.setState({codeInputValue:content})
                if(content.length===10||content.length===12){
                    console.log("显示发票号码："+content);
                    this.setState({invoiceType:InvoiceType.getReceiptType(content)})
                    if(this.state.invoiceType==='01'||this.state.invoiceType==='02'||this.state.invoiceType==='03'){//金额
                        if(this.state.textType!=="1"){
                            this.setState({
                                checkCodeInputValue:'',
                                amount:''
                            })
                        }

                        this.setState({textType:'1'})

                    }else {//校验码if(this.state.invoiceType==='04'||this.state.invoiceType==='10'||this.state.invoiceType==='11')
                        if(this.state.textType!=="0"){
                            this.setState({
                                checkCodeInputValue:'',
                                amount:''
                            })
                        }
                        this.setState({textType:'0'})

                    }
                }
                break;
            case 'numberInputValue':
                this.setState({numberInputValue:content})
                break;
            case 'checkCodeInputValue':
                this.setState({checkCodeInputValue:content})
                break;
            case 'amount':
                this.setState({amount:content})
                break;
        }
    }

    //获取日期数据信息
    _corpTypeBtnClick(){
        this.setState({
            isPickerOpen : this.refs.datapicker.state.isPickerOpen,
            dateTime:this.refs.datapicker.state.dateTime,
            dateFormat:this.refs.datapicker.state.dateFormat,
        })
    }

    //错误信息提示框
    _AlertErrorMsg(content,){
        Alert.alert(content, '', [
            {
                text: "确定",
                onPress: () => console.log('Cancel Pressed'),
                color: "#ef0c35", // 可选, 可以不设置
                style: 'cancel',
            }]);
    }

    //点击查验
    _verifyTap(){
        console.log(this.state.codeInputValue+","+this.state.codeInputValue.length+",,"+this.state.numberInputValue+","+this.state.numberInputValue+","+this.state.dateFormat);
        function formatTime(date) {
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()
            return [year, month, day].map(formatNumber).join('')
        }
        function formatNumber(n) {
            n = n.toString()
            return n[1] ? n : '0' + n
        }
        const nowData = formatTime(new Date());
        if(this.state.codeInputValue.length!==10&&this.state.codeInputValue.length!==12){//发票代码为10或12位
            this._AlertErrorMsg('发票代码书写错误');

        }else if(this.state.numberInputValue.length!==8){//发票号码为8位
            this._AlertErrorMsg('发票号码书写错误');

        }else if(this.state.dateFormat===nowData){//当日发票次日可查验
            this._AlertErrorMsg('当日发票次日可查验');

        }else if(parseInt(this.state.dateFormat)>parseInt(nowData)){//当日发票次日可查验
            this._AlertErrorMsg('发票日期输入错误');

        }else if(parseInt(nowData)-parseInt(this.state.dateFormat)>10000||this.state.dateTime==='--'){//只支持一年内发票查验
            this._AlertErrorMsg('只支持一年内发票查验');

        }else if((this.state.invoiceType==='04'||this.state.invoiceType==='10'||this.state.invoiceType==='11')&&this.state.checkCodeInputValue.length!==6){//后六位校验码
            this._AlertErrorMsg('请输入校验码后六位');

        }else if((this.state.invoiceType==='01'||this.state.invoiceType==='02'||this.state.invoiceType==='03')&&this.state.amount.length===0){//金额
            this._AlertErrorMsg('请输入不含税金额');

        }else{//全部符合条件跳转
            this.push({
                title: '发票信息',
                screen: 'InvoiceInfoPage',
                backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                passProps:{
                    status:false,
                    codeInputValue:this.state.codeInputValue,
                    numberInputValue:this.state.numberInputValue,
                    checkCodeInputValue:this.state.checkCodeInputValue,
                    dateTime:this.state.dateTime,
                    invoiceType:this.state.invoiceType,
                    amount:this.state.amount,
                    step:2,
                }
            });
        }

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
            textType:'0'
        })

        this.refs.codeInputValue._clearTextInput();
        this.refs.numberInputValue._clearTextInput();
        if(this.state.textType==='1')
            this.refs.amount._clearTextInput();
        else
            this.refs.checkCodeInputValue._clearTextInput();
        this.refs.datapicker.setDateTime(nowTime(new Date()));

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

                    {this.state.textType==='1'?<View style={styles.invoiceCheck_wrp}>
                        <Text style={styles.text_name} >金额：</Text>
                        {this.renderNumberInput('amount','请输入不含税金额',this.state.amount,20)}

                    </View>:<View style={styles.invoiceCheck_wrp}>
                        <Text style={styles.text_name} >校验码：</Text>
                        {this.rendercheckCodeInput('checkCodeInputValue','请输入校验码后六位',this.state.checkCodeInputValue,6)}

                    </View>}


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


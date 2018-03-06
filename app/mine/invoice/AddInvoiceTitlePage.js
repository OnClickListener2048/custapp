/**
 * 添加、修改发票抬头
 * Created by jiaxueting on 2018/3/1.
 */

import React from 'react';
import BComponent from '../../base/BComponent';
import InvoiceInputView from "../../home/VerifyName/view/InvoiceInputView";
import {StyleSheet,Button,ScrollView,View,FlatList,Text,TouchableOpacity,Image,DeviceEventEmitter} from 'react-native';
import SinglePickerView from "../../home/VerifyName/view/SinglePickerView";
import SubmitButtonWithIcon from "../../view/SubmitButtonWithIcon";
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import SubmitButton from "../../view/SubmitButton";
import Alert from "react-native-alert";
import InvoiceType from "../../view/invoiceType"
import SectionHeader from "../../view/SectionHeader";
import * as apis from '../../apis/home';


export default class AddInvoiceTitlePage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            _id:'',
            companyName:'',
            dutyParagraph:'',
            companyAddress:'',
            phoneNumber:'',
            depositBank:'',
            bankAccount:'',

        };
        this.rendercheckCodeInput = this.rendercheckCodeInput.bind(this);
        this.renderNumberInput = this.renderNumberInput.bind(this);
        this._verifyTap = this._verifyTap.bind(this);
        this._isNotEmpty = this._isNotEmpty.bind(this);
    }

    componentWillMount() {
        if(this.props._id){
            this.setState({
                _id:this.props._id,
                companyName:this.props.company,
                dutyParagraph:this.props.taxID,
                companyAddress:this.props.address,
                phoneNumber:this.props.mobile,
                depositBank:this.props.bank,
                bankAccount:this.props.account,

            })

        }else{
            if(this.props.company)
                this.setState({companyName:this.props.company})

            if(this.props.taxID)
                this.setState({dutyParagraph:this.props.taxID})

            if(this.props.address)
                this.setState({companyAddress:this.props.address})

            if(this.props.mobile)
                this.setState({phoneNumber:this.props.mobile})

            if(this.props.bank)
                this.setState({depositBank:this.props.bank})

            if(this.props.account)
                this.setState({bankAccount:this.props.account})

        }
    }


        //点击保存
    _verifyTap(){
        if(!this.state.companyName){//公司名称为空
            this._AlertErrorMsg('公司名称不能为空');

        }else if(!this.state.dutyParagraph){//税号为空
            this._AlertErrorMsg('税号不能为空');

        }else if(this.state.dutyParagraph.length<15||this.state.dutyParagraph.length>20){//税号为空
            this._AlertErrorMsg('请输入15-20位税号');

        }else {//保存数据并跳转详情
            let loading = SActivityIndicator.show(true, "加载中...");

            let params = {
                company:this.state.companyName,//公司名称 (必填)
                taxID:this.state.dutyParagraph,//税号 (必填)
            }
            if(this.state.companyAddress){
                params.address = this.state.companyAddress
            }
            if(this.state.phoneNumber){
                params.mobile = this.state.phoneNumber
            }
            if(this.state.depositBank){
                params.bank = this.state.depositBank
            }
            if(this.state.bankAccount){
                params.account = this.state.bankAccount
            }
            let id = '';
            let company= '';//公司名称
            let taxID= '';//税号
            let address = '';//地址
            let mobile = '';//手机号
            let bank = '';//开户行
            let account = '';//银行账号

            if(this.state._id) {//修改数据提交
                apis.updateInvoiceInfo(this.state._id,params).then((res)=>{
                    SActivityIndicator.hide(loading);
                    if(res.code == 0){
                        id = this.state._id;
                        company= res.company;//公司名称
                        taxID= res.taxID;//税号
                        address = res.address;//地址
                        mobile = res.mobile;//手机号
                        bank = res.bank;//开户行
                        account = res.account;//银行账号
                        // let callback = this.props.callback;
                        // if(callback) {
                        //     callback();
                        // }
                        DeviceEventEmitter.emit('ReloadInvoiceTitleState');
                        this.props.navigator.pop();

                    }else{
                        this._AlertErrorMsg(res.msg?res.msg:'保存失败');

                    }
                },(e)=>{
                    SActivityIndicator.hide(loading);
                    this._AlertErrorMsg(e.msg?e.msg:'保存失败');

                })
            }else{//添加保存
                UserInfoStore.getUserInfo().then(
                    (user) => {
                        if(user){
                            params.username = user.username
                            apis.addInvoiceInfo(params).then((res)=>{
                                SActivityIndicator.hide(loading);
                                if(res.code == 0){
                                    id = res._id;
                                    company= res.company;//公司名称
                                    taxID= res.taxID;//税号
                                    address = res.address;//地址
                                    mobile = res.mobile;//手机号
                                    bank = res.bank;//开户行
                                    account = res.account;//银行账号
                                    //回调刷新
                                    // let callback = this.props.callback;
                                    // if(callback) {
                                    //     callback();
                                    // }
                                    DeviceEventEmitter.emit('ReloadInvoiceTitleState');

                                    this.props.navigator.pop();

                                    this._timer = setTimeout(() => {
                                        this.push({
                                            screen:'CheckInvoiceTitlePage',
                                            title:'我的抬头',
                                            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                                            passProps:{
                                                id,
                                                company,
                                                taxID,
                                                address,
                                                mobile,
                                                bank,
                                                account,
                                            }
                                        })
                                            clearTimeout(this._timer);
                                    }, 700);
                                }else{
                                    this._AlertErrorMsg(res.msg?res.msg:'保存失败');

                                }
                            },(e)=>{
                                SActivityIndicator.hide(loading);
                                this._AlertErrorMsg(e.msg?e.msg:'保存失败');

                            })
                        }else{


                        }

                    },
                    (e) => {

                    }
                );
            }
        }
    }

    //错误信息提示框
    _AlertErrorMsg(content){
        Alert.alert(content, '', [
            {
                text: "确定",
                onPress: () => console.log('Cancel Pressed'),
                color: "#ef0c35", // 可选, 可以不设置
                style: 'cancel',
            }]);
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
                keyboardType="numeric"
                textEditable={true}/>
        )

    }

    _isNotEmpty(contentType,content){
        switch(contentType){
            case 'companyName':
                this.setState({companyName:content})
                break;
            case 'dutyParagraph':
                this.setState({dutyParagraph:content})
                break;
            case 'companyAddress':
                this.setState({companyAddress:content})
                break;
            case 'phoneNumber':
                this.setState({phoneNumber:content})
                break;
            case 'depositBank':
                this.setState({depositBank:content})
                break;
            case 'bankAccount':
                this.setState({bankAccount:content})
                break;
        }
    }

    render(){
        console.log("刷新数据。页面"+this.state.reset);
        return(

            <ScrollView style={styles.container}>
                <View style={styles.invoiceCheck_wrp}>
                    <Text style={styles.text_name} >名&#12288;&#12288;称：</Text>
                    {this.rendercheckCodeInput('companyName','公司名称（必填）',this.state.companyName,)}
                </View>

                <View style={styles.invoiceCheck_wrp}>
                    <Text style={styles.text_name} >税&#12288;&#12288;号：</Text>
                    {this.rendercheckCodeInput('dutyParagraph','15-20位（企业报销时必填）',this.state.dutyParagraph,20)}
                </View>

                <View style={styles.invoiceCheck_wrp}>
                    <Text style={styles.text_name} >单位地址：</Text>
                    {this.rendercheckCodeInput('companyAddress','公司地址',this.state.companyAddress,)}
                </View>

                <View style={styles.invoiceCheck_wrp}>
                    <Text style={styles.text_name} >电话号码：</Text>
                    {this.renderNumberInput('phoneNumber','公司电话',this.state.phoneNumber,)}
                </View>

                <View style={styles.invoiceCheck_wrp}>
                    <Text style={styles.text_name} >开户银行：</Text>
                    {this.rendercheckCodeInput('depositBank','开户银行',this.state.depositBank,20)}
                </View>

                <View style={styles.invoiceCheck_wrp}>
                    <Text style={styles.text_name} >银行账号：</Text>
                    {this.renderNumberInput('bankAccount','银行账号',this.state.bankAccount,)}
                </View>

                <View style={{marginTop:50,marginBottom:50}}>
                    <SubmitButton
                        isEnabled={true}
                        text="保存"
                        buttonStyle={{width:SCREEN_WIDTH-40,height:50}}
                        onPress={() => {
                            this._verifyTap()
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
    invoiceCheck_wrp:{
        flexDirection:'row',
        marginTop:10,
        paddingLeft:15,
        paddingRight:15,
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


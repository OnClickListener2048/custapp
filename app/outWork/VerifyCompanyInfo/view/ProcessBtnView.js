/**
 * Created by jinglan on 2017/6/19.
 */
import React, {PropTypes,Component} from 'react';
import {View, Text,Image,Dimensions,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,} from 'react-native';
import Alert from "react-native-alert";
const window = Dimensions.get('window');
import SActivityIndicator from '../../../modules/react-native-sww-activity-indicator/index';
import * as apis from '../../../apis/index';
import Toast from 'react-native-root-toast';
import errorText from '../../../util/ErrorMsg';

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;

// import AlertCeshi from  'react-native-alert'

class ProcessBtnView extends Component{
    constructor(props) {
        super(props)
        this.state = {
            finished : this.props.finished,
            inProgress : this.props.inProgress,
            materialConfirm : this.props.materialConfirm,
            allowEdit : this.props.allowEdit,
            titleArr :['确认材料','完成','完成'],
            currentNum: 0,
            stepId:this.props.stepId,          //步骤 ID
            taskId:this.props.taskId,          //步骤 ID
            currentName : '',
            isSave:this.props.isSave,

        }
        this.setProcessInfo = this.setProcessInfo.bind(this);

        this.btnClick = this.btnClick.bind(this);


    }

    static propTypes = {
        finished : PropTypes.bool,
        inProgress : PropTypes.bool,
        materialConfirm : PropTypes.bool,
        stepId : PropTypes.number,
        taskId : PropTypes.number,
        allowEdit : PropTypes.bool,
    };



    submitData() {
        // 使用原始的DOM API来聚焦输入框。
        let loading = SActivityIndicator.show(true, "加载中...");

        // console.log("inProgresshaha" , this.state.inProgress);
        // console.log("materialConfirmhaha" , this.state.materialConfirm);

        apis.loadOutSourceTaskStepChange(this.state.materialConfirm ? true : false,false,true ,this.state.stepId,this.state.taskId).then(

            (responseData) => {
                SActivityIndicator.hide(loading);

                this.setState({

                    finished : responseData.data.finished === "true",
                    // inProgress : responseData.data.inProgress=== "true",
                    materialConfirm : responseData.data.materialConfirm === "true",
                    currentNum : (responseData.data.finished === 'true') ? 2  : (responseData.data.materialConfirm === 'true') ? 1 : 0,
                });
                this.props.callback(this.state.currentNum);


            },
            (e) => {
                console.log("获取失败" , e);
                Toast.show(errorText( e ));
                SActivityIndicator.hide(loading);
            },
        );
    }

    setProcessInfo(isSave) {
        console.log("获取是否现实了保存按钮"+isSave);
        this.setState({
            isSave:isSave,

        });
    }


    btnClick() {
        console.log("点击="+this.props.isSave+",,"+this.state.isSave);
        if(this.state.isSave===true){
            Toast.show('请保存客户基本信息');
        }else{
            Alert.alert(this.state.currentNum === 0 ?  '确认材料齐全' : '确认任务完成', '',
                [
                    {text: '取消', onPress: () => console.log('Cancel'), style: 'cancel'},
                    {
                        text: '确定',
                        onPress: () => this.submitData(),
                    },]
                , {cancelable: false}
            );
        }

    }


    renderBtnView() {

        if (this.state.allowEdit){
            if (this.state.currentNum == this.state.titleArr.length - 1) {      // 无数据
                return(
                    <View  style={{marginRight: 15,height:40,
                        width:90,marginTop: 20,borderRadius:2.5 ,alignItems:'center', backgroundColor:'#e6e6e6', justifyContent:'center'}}>
                        <Text style={{fontSize:15,width:80, textAlign:'center', justifyContent: 'center',color:'#FFFFFF'}}>
                            {this.state.titleArr[this.state.currentNum]}</Text>
                    </View>
                );
            }

            if (this.state.currentNum < this.state.titleArr.length) {      // 无数据
                return(
                    <TouchableOpacity onPress={this.btnClick}>
                        <View  style={{marginRight: 15,height:40,
                            width:90,marginTop: 20,borderRadius:2.5 ,alignItems:'center', backgroundColor:'#e5151b', justifyContent:'center'}}>
                            <Text style={{fontSize:15,width:80, textAlign:'center', justifyContent: 'center',color:'#FFFFFF'}}>
                                {this.state.titleArr[this.state.currentNum]}</Text>
                        </View>
                    </TouchableOpacity>
                );
            }
        }else {
            return(
                <View  style={{marginRight: 15,height:40,
                    width:90,marginTop: 20,borderRadius:2.5 ,alignItems:'center', backgroundColor:'#e6e6e6', justifyContent:'center'}}>
                    <Text style={{fontSize:15,width:80, textAlign:'center', justifyContent: 'center',color:'#FFFFFF'}}>
                        {this.state.titleArr[this.state.currentNum]}</Text>
                </View>
            );

        }



    }


    render(){
        const {finished,inProgress,materialConfirm,allowEdit,stepId,taskId} = this.state
        this.state.finished = finished;
        this.state.inProgress = inProgress;
        this.state.materialConfirm = materialConfirm;
        this.state.currentNum = this.state.finished ? 2 : this.state.materialConfirm ? 1 : 0;
        this.state.allowEdit = allowEdit;
        return(

            <View style={{backgroundColor:'#FFFFFF',width: SCREEN_WIDTH,height :80 ,flexDirection:'row-reverse'}}>
                    {this.renderBtnView()}

            </View>
        );
    }


}

var styles = StyleSheet.create({
    container:{
        height:50,
        marginTop: 5,

        backgroundColor:'#FFFFFF',
        flexDirection:'row'
    },
    processImgTipView:{
        height:50,
        marginTop: 5,
        marginLeft: 43,
        marginRight: 43,
        backgroundColor:'#FFFFFF',
        flexDirection:'row',
        alignItems:'center'
    },
    titleContainer:{
        marginLeft: 20.5,
        marginRight: 20.5,
        justifyContent:'space-between',
        backgroundColor:'#FFFFFF',
        flexDirection:'row'
    }
});

module.exports = ProcessBtnView;
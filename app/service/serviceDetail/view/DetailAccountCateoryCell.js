/**
 * Created by liufei on 2018/4/16.
 */

import React, {PropTypes,Component} from 'react';
import {View, Text,Platform,Image,Dimensions,StyleSheet,TouchableOpacity,DeviceEventEmitter} from 'react-native';
const window = Dimensions.get('window');

export const SCREEN_WIDTH = window.width;

export default class DetailAccountCateoryCell extends Component {

    constructor(props) {
        super(props)

        this.arr=[]
        this.state = {
            isPushing: false,// 是否跳转中
        };

    }

    //去重方法
     unique(songs){
        let result = {};
        let finalResult=[];
        if(songs!=null&&songs) {
            for (let i = 0; i < songs.length; i++) {
                result[songs[i].subjectNo] = songs[i];
                //因为songs[i].name不能重复,达到去重效果,且这里必须知晓"name"或是其他键名
            }
            //现在result内部都是不重复的对象了，只需要将其键值取出来转为数组即可
            for (item in result) {
                finalResult.push(result[item]);
            }
        }
        return finalResult;
    }

    toAccountDetail(categoryItem){
        console.log('打印传递的数据'+this.props.timeDateArr+'-----'+this.props.timeIndex+'----'+this.props.companyid);
    UserInfoStore.isLogined().then(
        (logined) => {
                if(logined) {
        if (this.state.isPushing === true) {
            console.log("休息一下吧, 您的手速太快了");
            return;
        }

        this.props.navigator.push({
            screen: 'DetailAccountPage',
            title:categoryItem.subjectNo+' '+categoryItem.subjectName,
            passProps: {
                categoryItem:categoryItem,
                timeDateArr:this.props.timeDateArr,
                timeIndex:this.props.timeIndex,
                companyid:this.props.companyid,
                companyName:this.props.companyName,
            }
        });
        this.state.isPushing = true;

        this._timer = setTimeout(()=>{
            this.setState({isPushing:false})//0.5秒后可点击
            clearTimeout(this._timer);
        },500);

        UserInfoStore.getAccountDetailArr().then(
            (list) => {
                this.arr=list;
                if(this.arr!=null&&this.arr) {
                    var index = this.arr.findIndex((v) => {
                        return v.subjectNo == categoryItem.subjectNo;
                    });
                    console.log('index======'+index);
                    //删除指定角标的元素
                    if(index!==-1) {
                        this.arr.splice(index, 1);
                    }
                    //倒序添加元素
                    this.arr.splice(0, 0, categoryItem)
                }else{
                    this.arr=[];
                }


                UserInfoStore.setAccountDetailArr(this.arr).then(
                    (list)=>{
                        console.log('保存成功'+this.arr);

                        //发送消息通知本地存储的最近列表数据有更改
                        DeviceEventEmitter.emit('changeLateList');
                    },
                    (e)=>{

                    }
                );

            },
            (e) => {
                console.log('this.arr失败了吗=='+this.arr);
            }
        );
                } else {
                    return;
                }
            },
        (e) => {
                    return;
            }
        );



    }

    render() {
        const {categoryItem} = this.props

        return (
            <TouchableOpacity onPress={()=>{this.toAccountDetail(categoryItem)}}>
            <View style={styles.rowStyle}>
                <View style={styles.rowWrp}>
                    <Text style={styles.textStyle}>
                        {categoryItem.subjectNo}
                    </Text>
                    <Text style={[styles.textStyle,{marginLeft:5, width:270}]}
                          numberOfLines={1}
                    >
                        {categoryItem.subjectName}
                    </Text>

                </View>
                <Image style={styles.img}
                       source={require('../../../img/left_button.png')}
                />
            </View>
                <View style={[styles.line,{marginLeft:16}]}/>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({

    rowStyle: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        alignItems:'center',
        justifyContent:"space-between",
        paddingTop:18,
        paddingBottom:18

    },
    rowWrp:{
        flexDirection:'row',
        marginLeft:15
    },
    textStyle:{
        fontSize: 14,
        color: '#333333',
    },
    img:{
        resizeMode : "contain",
        marginRight:15
    },
    line:{
        height:0.6,
        width:SCREEN_WIDTH,
        borderLeftColor:'#ececec',
        borderLeftWidth:1 ,
        backgroundColor:'transparent',
        marginLeft:10
    },
});
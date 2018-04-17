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

    toAccountDetail(categoryItem){
        console.log('打印传递的数据'+this.props.timeDateArr+'-----'+this.props.timeIndex+'----'+this.props.companyid);

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
            }
        });

        UserInfoStore.getAccountDetailArr().then(
            (list) => {
                this.arr=list;

                // this.arr.push(categoryItem)
                console.log('要删除的角标'+this.arr.indexOf(categoryItem));
                if(this.arr.indexOf(categoryItem)){
                    // this.arr.remove(this.arr.indexOf(categoryItem))

                }
                this.arr.splice(0,0,categoryItem)
                console.log('s222保存的数据长度是',list.length)

                UserInfoStore.setAccountDetailArr(this.arr).then(
                    (list)=>{
                        console.log('保存成功'+this.arr);

                        //发送消息通知本地存储的最近列表数据有更改
                        DeviceEventEmitter.emit('changeLateList');

                        this.state.isPushing = true;

                        this._timer = setTimeout(()=>{
                            this.setState({isPushing:false})//0.5秒后可点击
                            clearTimeout(this._timer);
                        },500);
                    },
                    (e)=>{

                    }
                );
            },
            (e) => {

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
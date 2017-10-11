/**
 * Created by liufei on 2017/9/19.
 */
import React, {Component} from 'react';
import BComponent from '../../base/BComponent'
import {
    View,
    StyleSheet,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    FlatList,
    ScrollView
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import * as apis from '../../apis';
import ProgressDetailCell from "./view/ProgressDetailCell";
import DefaultView from '../../view/DefaultView';

export default class ProgressDetailPage extends BComponent {

    constructor(props){
        super(props)
        this.state={
            sourceData:[],//进度列表数据源
            statusW:0,//最外层状态
            status_desc:'',//状态描述
            amount:'',//金额
            loadState:'loading'
        }
        this.childState='';//判断显示样式 6显示红色 已完成
        this.status='';//子任务状态，1执行中，2已结束
        this.loadData=this.loadData.bind(this);
    }


    componentDidMount() {
        this.loadData();
    }

    loadData(){
        var loading = SActivityIndicator.show(true, "加载中...");
        apis.loadOrderDetailData(this.props.orderId).then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                if(responseData.code==0){
                    if(responseData.data!=null) {
                        console.log('走了吗吗吗', responseData.data)
                        var sourceData = responseData.data.schedule;
                        var statusW = responseData.data.status;
                        var status_desc = responseData.data.status_desc;
                        var amount = responseData.data.amount;
                        this.setState({
                            sourceData: sourceData,
                            statusW: statusW,
                            status_desc: status_desc,
                            amount: amount,
                            loadState: 'success'
                        })
                    }else{
                        this.setState({
                            loadState: 'no-data'
                        })
                    }
                }
            },
            (e) => {
                SActivityIndicator.hide(loading);
                this.setState({
                    loadState:NetInfoSingleton.isConnected?'error':'no-net',
                })
                console.log('error',e)
            },
        );
    }


    renderItem = (item) => {
        console.log('statusW=======',this.state.statusW)

        if(item.index==0&&this.state.statusW==6){
            this.childState='done'
        }else if(item.item.status==1){
            this.childState='green'

        }else if(item.item.status==2){
            this.childState='gray'
        }
        if(item.item.status==1){
            this.status='执行中'
        }else if(item.item.status==2){
            this.status='已结束'
        }

        return(
        <ProgressDetailCell
            state={this.childState}
            name={item.item.name}
            start={item.item.start}
            end={item.item.end}
            operator={item.item.operator}
            status={this.status}
        />
        );
    };

    _keyExtractor= (item, index) => index;


    render(){
        if(this.state.loadState == 'success') {
            return (
                <View style={styles.container}>
                    <View style={styles.wrapper3}>
                        <View style={styles.wrapper1}>
                            <Text style={styles.orderstateTe}>
                                订单状态
                            </Text>
                            <Text style={styles.orderstate}>
                                {this.state.status_desc}
                            </Text>
                        </View>
                        <View style={[styles.wrapper1, {marginTop: 15}]}>
                            <Text style={styles.orderstateTe}>
                                订单号:{this.props.orderId}
                            </Text>
                            <Text style={styles.money}>
                                {this.state.amount}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.wrapper2}>
                        <Text style={{color: '#333333', fontSize: 16}}>
                            进度详情
                        </Text>
                    </View>
                    <View style={styles.line}/>
                    <View style={{height: 30, backgroundColor: '#FFFFFF'}}/>
                    <FlatList
                        style={styles.list}
                        ref={(ref) => this.listView = ref}
                        data={this.state.sourceData}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}
                    />
                </View>
            )
        }else{
            return(
                <DefaultView onPress={()=>this.loadData()} type ={this.state.loadState}/>
            )
        };
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F9F9F9',
    },
    line:{
        height:0.25,
        width:SCREEN_WIDTH,
        borderBottomColor:'#ececec',
        borderBottomWidth:1 ,
        backgroundColor:'transparent',
    },
    wrapper1:{
        paddingLeft:15,
        paddingRight:15,
        alignItems:'center',
        backgroundColor:'#FFFFFF',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    orderstateTe:{
        fontSize:16,
        color:'#333333'
    },
    money:{
        fontSize:14,
        color:'#E13238'
    },
    wrapper2:{
        paddingLeft:15,
        marginTop:10,
        backgroundColor:'#FFFFFF',
        paddingBottom:20,
        paddingTop:20
    },
    wrapper3:{
        backgroundColor:'#FFFFFF',
        marginTop:10,
        paddingTop:20,
        paddingBottom:20
    },
    list:{
        backgroundColor:'#ffffff',
    }

});
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
            loadState:'success',
            orderData:{
                "order_no": "",
                "status": 1,
                "status_desc": "执行中",
                "amount": "",
                "order_time": "",
                "order_type": 1,
                "contract_time": "",
                "contract_md_time": "",
                "contract_status": ""
            }
        }
        this.childState='';//判断显示样式 6，8，9显示红色 已完成
        this.status='';//子任务状态，1执行中，2已结束
        this.contract_time='';
        this.contract_md_time=''
        this.loadData=this.loadData.bind(this);

    }


    componentDidMount() {
        this.loadData();
    }

    loadData(){
        var loading = SActivityIndicator.show(true, "加载中...");
        console.log('走了吗吗吗111555', this.props.orderno)

        apis.loadOrderDetailData(this.props.orderno).then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                if(responseData.code==0){
                    var sourceData=[{
                        "name":'签订合同',
                        "start": responseData.data.order.contract_time?responseData.data.order.contract_time:'',
                        "end":'',
                        "status":4,
                        "operator": responseData.data.order.sales_name?responseData.data.order.sales_name:''
                    }];

                    if(responseData.data.order){
                        this.setState({
                            orderData:responseData.data.order
                        })
                    }

                    if(responseData.data.schedule) {
                        var newSourceData=responseData.data.schedule.concat(sourceData);//合并数组
                        this.setState({
                            sourceData: newSourceData,
                            loadState: 'success',
                        })
                    }else{//订单详情子任务列表为空时
                        this.setState({
                            sourceData: sourceData,
                            loadState: 'success',
                        })
                    }
                }else{
                    this.setState({
                        loadState: 'no-data',
                    })
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
        if(item.index==0&&(this.state.orderData.contract_status==3||this.state.orderData.contract_status==4)){
            this.childState='done'
            this.contract_time=this.state.orderData.contract_time//合同时间
            this.contract_md_time=this.state.orderData.contract_md_time//合同最好操作时间
        }else if(item.index==0&&(this.state.orderData.status==6||this.state.orderData.status==8||this.state.orderData.status==5)){
            this.childState='done'
        }else if(item.item.status==1){
            this.childState='green'

        }else if(item.item.status==2||item.item.status==3||item.item.status==4){
            this.childState='gray'
        }
        if(item.item.status==1){
            this.status='执行中'
        }else if(item.item.status==2){
            this.status='已完成'
        }else if(item.item.status==3){
            this.status='已取消'
        }else if(item.item.status==4){//专为合同状态加的，不是接口提供的
            this.status=''
        }

        return(
        <ProgressDetailCell
            state={this.childState}
            name={item.item.name}
            start={item.item.start}
            end={item.item.end}
            operator={item.item.operator}
            status={this.status}
            contract_time={this.contract_time}
            contract_md_time={this.contract_md_time}

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
                                {this.state.orderData.status_desc}
                            </Text>
                        </View>
                        <View style={[styles.wrapper1, {marginTop: 15}]}>
                            <Text style={styles.orderstateTe}>
                                订单号:{this.state.orderData.order_no}
                            </Text>
                            <Text style={styles.money}>
                                {this.state.orderData.amount}
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
    },

});
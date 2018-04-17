/**
 * Created by liufei on 2018/4/16.
 */

//明细账列表外层tab页

import React, {Component} from 'react';
const dismissKeyboard = require('dismissKeyboard');
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import CustomTabBar from '../../mine/myOrder/view/CustomTabBar'
import {
    View,
    StyleSheet,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    ScrollView,
    DeviceEventEmitter,
    TouchableWithoutFeedback
} from 'react-native';
import  DetailAccountCategoryPage from './DetailAccountCategoryPage'
import BComponent from '../../base/BComponent'
import * as apis from '../../apis';
import DefaultView from '../../view/DefaultView'
export default class DetailAccountListPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            data:[],//全部
            late:[],//最近
            asset:[],//资产
            debt:[],//负债
            rights:[],//权益
            cost:[],//成本
            profit:[],//损益
            loadState:'success',
        };
        this.loadData=this.loadData.bind(this);
    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true,
    };

    componentDidMount() {
        this.loadData()
    }



    loadData(){
        //测试用
        // this.companyid='2369'
        // this.companytype=1


                        var loading = SActivityIndicator.show(true, "加载中...");

                    apis.loadAccountCategoryList(this.props.companyid).then(
                        (responseData) => {
                            SActivityIndicator.hide(loading);

                            if (responseData.code == 0) {
                                var data = responseData.data;
                                if (data != null && data != []) {

                                    var asset = [];
                                    var debt = [];
                                    var rights = [];
                                    var cost = [];
                                    var profit = [];
                                    for (let i = 0; i < data.length; i++) {
                                        if (data[i].subjectNo==1000 || data[i].subjectNo>1000 && data[i].subjectNo<2000) {
                                            asset.push(data[i]);
                                            for(var key in data[i].childSubject) {
                                                console.log("全部的key" + key + '====='+data[i].childSubject[key].subjectNo)
                                                asset.push(data[i].childSubject[key]);//把子集提到最外层和外层数据进行合并
                                            }

                                            console.log('是啥呢嫩',data[i])
                                        } else if (data[i].subjectNo == 2000 || data[i].subjectNo > 2000 && data[i].subjectNo<3000) {
                                            debt.push(data[i]);
                                            for(var key in data[i].childSubject) {
                                                debt.push(data[i].childSubject[key]);//把子集提到最外层和外层数据进行合并
                                            }
                                        } else if (data[i].subjectNo == 3000 || data[i].subjectNo > 3000 && data[i].subjectNo<4000) {
                                            rights.push(data[i]);
                                            for(var key in data[i].childSubject) {
                                                rights.push(data[i].childSubject[key]);//把子集提到最外层和外层数据进行合并
                                            }
                                        }else if (data[i].subjectNo == 4000 || data[i].subjectNo > 4000 && data[i].subjectNo<5000) {
                                            cost.push(data[i]);
                                            for(var key in data[i].childSubject) {
                                                cost.push(data[i].childSubject[key]);//把子集提到最外层和外层数据进行合并
                                            }
                                        }else if (data[i].subjectNo == 5000 || data[i].subjectNo > 5000 && data[i].subjectNo<6000) {
                                            profit.push(data[i]);
                                            for(var key in data[i].childSubject) {
                                                profit.push(data[i].childSubject[key]);//把子集提到最外层和外层数据进行合并
                                            }
                                        }
                                    }
                                    this.setState({
                                            data: data,
                                            asset: asset,
                                            debt: debt,
                                            rights: rights,
                                            cost: cost,
                                            profit: profit,
                                            loadState: 'success'
                                        }
                                    );
                                } else {
                                    this.setState({
                                        data: [],
                                        asset: [],
                                        debt: [],
                                        rights: [],
                                        cost: [],
                                        profit: [],
                                        loadState: 'success'
                                        }
                                    );
                                }


                            } else {
                                this.setState({
                                        loadState: 'error'
                                    }
                                );
                            }
                        },
                        (e) => {
                            SActivityIndicator.hide(loading);
                            this.setState({
                                loadState: NetInfoSingleton.isConnected ? 'error' : 'no-net',
                            })
                            console.log('error', e)

                        },
                    );
    }


    _lockSlide(){
        if (Platform.OS === 'android') {
            this.scrollTabView.setNativeProps(false);
        }
    }

    _openSlide(){
        if (Platform.OS === 'android'){
            this.scrollTabView.setNativeProps(true);
        }
    }


    render(){
        if(this.state.loadState == 'success') {
            return (
                <View style={{flex:1}}>
                    <ScrollableTabView
                        renderTabBar={() => <CustomTabBar/>}
                        style={styles.container}
                        tabBarUnderlineStyle={styles.lineStyle}//选中时线的样式
                        tabBarActiveTextColor='#C6A567'//选中时字体的颜色
                        tabBarBackgroundColor='#FFFFFF'//整个tab的背景色
                        tabBarInactiveTextColor='#999999'//未选中时字的颜色
                        tabBarTextStyle={styles.textStyle}//tab字体的样式
                        ref={(scrollTabView) => {
                            this.scrollTabView = scrollTabView;
                        }}
                    >
                        <DetailAccountCategoryPage tabLabel='最近'
                                          isLate={true}
                                          lockSlide={this._lockSlide.bind(this)} //解决ScrollableTabView和listView的滑动冲突
                                          openSlide={this._openSlide.bind(this)}
                                          {...this.props}//把所有属性都传给子页面

                        />
                        <DetailAccountCategoryPage tabLabel='资产'
                                          sourceData={this.state.asset}
                                          lockSlide={this._lockSlide.bind(this)}
                                          openSlide={this._openSlide.bind(this)}
                                          {...this.props}
                        />
                        <DetailAccountCategoryPage tabLabel='负债'
                                          sourceData={this.state.debt}
                                          lockSlide={this._lockSlide.bind(this)}
                                          openSlide={this._openSlide.bind(this)}
                                          {...this.props}
                        />
                        <DetailAccountCategoryPage tabLabel='权益'
                                          sourceData={this.state.rights}
                                          lockSlide={this._lockSlide.bind(this)}
                                          openSlide={this._openSlide.bind(this)}
                                          {...this.props}
                        />
                        <DetailAccountCategoryPage tabLabel='成本'
                                                   sourceData={this.state.cost}
                                                   lockSlide={this._lockSlide.bind(this)}
                                                   openSlide={this._openSlide.bind(this)}
                                                   {...this.props}
                        />
                        <DetailAccountCategoryPage tabLabel='损益'
                                                   sourceData={this.state.profit}
                                                   lockSlide={this._lockSlide.bind(this)}
                                                   openSlide={this._openSlide.bind(this)}
                                                   {...this.props}
                        />
                    </ScrollableTabView>
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
    container: {
        flex: 1,
        backgroundColor:'#F1F1F1',

    },

    lineStyle: {
        // height: 1,
        backgroundColor: '#E13238',
    },

    textStyle:{
        fontSize:16,
        marginTop:10
    }

});
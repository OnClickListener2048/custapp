/**
 * Created by jinglan on 2017/6/7.
 */
import React, {Component} from 'react';
import {Dimensions, TouchableOpacity,
    DeviceEventEmitter,
    InteractionManager,Platform} from 'react-native';
import {loadOutSourceCount} from "../apis/outSource";
import {
    Text,
    Image,
    View,
} from 'react-native';
import CommunalNavBar from '../main/GDCommunalNavBar';

import TopcenterImgBottomTitleView from '../view/TopcenterImgBottomTitleView';
import styles from './css/ApplictionCenterPageStyle'
const window = Dimensions.get('window');
import MyOutSideWorkPage from "../outWork/myOutSideWork/MyOutSideWorkPage";
import Toast from 'react-native-root-toast';
import ScrollViewTop from "./scrollViewTop";

export const SCREEN_WIDTH = window.width;
import errorText from '../util/ErrorMsg';


/** 应用 */
export default class ApplicationCenterPage extends Component{
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
    };
    constructor(props) {
        super(props);

        this.state = {
            bdNum:null,
            canClickBtn : false,
        };


        this._loadCount = this._loadCount.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        // console.log('ApplicationCenterPage event.type', event.type);
        console.log('ApplicationCenterPage event', JSON.stringify(event));
        if(event.id==='willAppear'){
            this._loadCount();
            this.state.canClickBtn = true;

        }
    }
    static renderTitleItem() {
        return(
            <Text style={[styles.navbarTitleItemStyle,{fontSize:18,color:'#323232'}]}>应用中心</Text>
        );
    }

    toMyOutSideWork(){

        if (this.state.canClickBtn === false){
            return;
        }

        this.state.canClickBtn = false;


        this.props.navigator.push({
                screen: 'MyOutSideWorkPage',
                backButtonTitle: '返回', // 返回按钮的文字 (可选)
                backButtonHidden: false, // 是否隐藏返回按钮 (可选)
                title:'我的外勤',

            });
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('loginSuccess', (data) => {
            console.log('应用 loginSuccess');
            try {
                this._loadCount();
            } catch (e) {
                console.log(e + "");
            }
        });
    }

    componentWillUnmount() {
        // 销毁
        this.subscription.remove();
    }

    componentWillMount() {
        this._loadCount();
    }

    //获取每个外勤状态数量
    _loadCount(){

        // let loading  = SActivityIndicator.show(true, "加载中...");
        loadOutSourceCount().then(

            (responseData) => {
                // SActivityIndicator.hide(loading);
                if(responseData !== null && responseData.data !== null) {
                    this.outSourceCountObj = {};
                    console.log("开始请求2是"+responseData.data.todoNum+"，"+responseData.data.totalNum+"，"+responseData.data.inProgressNum);

                    this.setState({
                        bdNum:responseData.data.todoNum+responseData.data.inProgressNum,
                    });

                    if(this.refs.myoutItem) {
                        this.refs.myoutItem._setBageNum(this.state.bdNum);
                    }

                    this.props.navigator.setTabBadge({
                        badge: this.state.bdNum <= 0 ? null : this.state.bdNum // 数字气泡提示, 设置为null会删除
                    });

                }
            },
            (e) => {
                    // SActivityIndicator.hide(loading);
                console.log("获取失败" , JSON.stringify(e));
                Toast.show(errorText( e ));
            },
        );

    }



    render() {
        console.log("应用中心render="+this.state.bdNum);
        return(
        <View style={styles.container}>

            <CommunalNavBar

                titleItem = {() => ApplicationCenterPage.renderTitleItem()}
            />
            <ScrollViewTop/>

            <View style={styles.applicationViewContainer}>

                <TouchableOpacity
                    onPress={() => {this.toMyOutSideWork()}}
                    style={{ marginLeft: 15,marginTop: 15, height: 100, width: (SCREEN_WIDTH - 45)/2,}}

                >
                    <TopcenterImgBottomTitleView ref="myoutItem"
                                                 applicationTitle='我的外勤'
                                                 applicationImg = {require('../img/field.png')}
                                                 style={{height: 100, width: (SCREEN_WIDTH - 45)/2,}}
                                                 textStyle={{color: '#ef0c35',  alignSelf: 'flex-end'}}
                                                 badge={this.state.bdNum}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    // onPress={() => {this.toDialog()}}
                    style={{ marginLeft: 15,marginTop: 15, height: 100, width: (SCREEN_WIDTH - 45)/2,}}

                >
                <TopcenterImgBottomTitleView applicationTitle='CRM'
                                             applicationImg = {require('../img/crm_h.png')}
                                             style={{height: 100, width: (SCREEN_WIDTH - 45)/2,}}
                                             textStyle={{color: '#ef0c35',  alignSelf: 'flex-end'}}
                                             badge={0}
                />
                </TouchableOpacity>
                <TouchableOpacity
                    // onPress={() => {this.toMyOutSideWork()}}
                    style={{ marginLeft: 15,marginTop: 15, height: 100, width: (SCREEN_WIDTH - 45)/2,}}

                >
                <TopcenterImgBottomTitleView applicationTitle='工作统计'
                                             applicationImg = {require('../img/statistical_h.png')}
                                             style={{height: 100, width: (SCREEN_WIDTH - 45)/2}}
                                             textStyle={{color: '#ef0c35',  alignSelf: 'flex-end'}}
                                             badge={0}
                />
            </TouchableOpacity>
                <TouchableOpacity
                    // onPress={() => {this.toMyOutSideWork()}}
                    style={{ marginLeft: 15,marginTop: 15, height: 100, width: (SCREEN_WIDTH - 45)/2,}}

                >
                <TopcenterImgBottomTitleView applicationTitle='工作日志'
                                             applicationImg = {require('../img/log_h.png')}
                                             style={{height: 100, width: (SCREEN_WIDTH - 45)/2,}}
                                             textStyle={{color: '#ef0c35',  alignSelf: 'center'}}
                                             badge={0}
                />
                </TouchableOpacity>

            </View>

        </View>
        );
    }
}
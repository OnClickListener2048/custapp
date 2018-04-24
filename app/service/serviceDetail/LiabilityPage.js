/**
 * Created by zhuangzihao on 2018/4/24.
 */
/**
 * Created by zhuangzihao on 2017/9/25.
 */
import React  from 'react';
import {
    View,
    StyleSheet,
    InteractionManager
} from 'react-native';
import BComponent from '../../base';
import * as apis from '../../apis';
import Toast from 'react-native-root-toast'
import PLPActivityIndicator from '../../view/PLPActivityIndicator';
import ServiceNavigatorBar from '../view/ServiceNavigatorBar'
import TimeSearchBarTest from '../view/TimeSearchBarTest'
import CustomTabBar from '../../mine/myOrder/view/CustomTabBar'
import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view';
import DetailLiabilityList from './view/DetailLiabilityList'
export default class LiabilityPage extends BComponent {

    constructor(props){
        super(props)
        this.state={
            data:[],
            isLoading:false,
            timeDateArr:props.timeDateArr,
            timeIndex:props.timeIndex,
            assets:[],
            liabilities:[]
        }

    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.state.timeDateArr[this.state.timeIndex].relateDate)
        });
    }
    loadData(date=''){
        this.setState({
            isLoading:true
        })

        apis.loadLiabilityDate(this.props.companyid,date).then(
            (responseData) => {

                if(responseData.code == 0){
                    let data = responseData.data;
                    let assets = data.slice(0,46);
                    let liabilities = data.slice(47,data.length)
                    let placeholdArr = Array.apply(null, Array(liabilities.length-assets.length-1)).map(function(item, i) {
                        return {
                            "endSum": 0,
                            "preSum": 0,
                            "projectId": null,
                            "projectName": "-",
                            "sequenceId": "-",
                            "calcOrder": "-",
                            "showOrder": "-"
                        };
                    });
                    assets = [...assets,...placeholdArr,data[46]];
                    this.setState({
                        isLoading:false,
                        assets:assets,
                        liabilities:liabilities
                    })

                }else{
                    this.setState({
                        isLoading:false
                    })
                }
            },
            (e) => {
                this.setState({
                    isLoading:false
                })
            },
        );
    }
    render(){

        console.log('LiabilityPage')
        console.log(this.state.assets);
        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <ServiceNavigatorBar isSecondLevel = {true} title="资产负债表" navigator={this.props.navigator} />
                <TimeSearchBarTest
                    timeDateArr = {this.state.timeDateArr}
                    timeIndex = {this.state.timeIndex}
                    callback = {this._callback.bind(this)}
                />
                <ScrollableTabView
                    renderTabBar={() => <CustomTabBar/>}
                    style={styles.container}
                    tabBarUnderlineStyle={styles.lineStyle}//选中时线的样式
                    tabBarActiveTextColor='#C6A567'//选中时字体的颜色
                    tabBarBackgroundColor='#FFFFFF'//整个tab的背景色
                    tabBarInactiveTextColor='#999999'//未选中时字的颜色
                    tabBarTextStyle={styles.textStyle}//tab字体的样式
                >
                    <DetailLiabilityList tabLabel='资产' list = {this.state.assets}></DetailLiabilityList>
                    <DetailLiabilityList tabLabel='负债和所有者权益' list = {this.state.liabilities}></DetailLiabilityList>


                </ScrollableTabView>
                <PLPActivityIndicator isShow={this.state.isLoading} />
            </View>
        )
    }
    _callback(index){
        this.setState({
            timeIndex:index
        })
        this.loadData(this.state.timeDateArr[index].relateDate)
        this.props.callback && this.props.callback(index)
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#F1F1F1',

    },

    lineStyle: {
        backgroundColor: '#E13238',
    },

    textStyle:{
        fontSize:16,
        marginTop:10
    }

});
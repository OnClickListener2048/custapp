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
import demoData from './local/Liability.json'
import {exportFile} from '../../util/XlsxTool'

export default class LiabilityPage extends BComponent {

    constructor(props){
        super(props)
        this.state={
            data:[],
            isLoading:false,
            timeDateArr:props.timeDateArr,
            timeIndex:props.timeIndex,
            assets:[],
            liabilities:[],
            xslxData:[],

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
    _shareToWeXin(){
        exportFile(this.state.xslxData,'资产负债表',[{wpx: 150}, {wpx: 50},{wps:100},{wps:100},{wpx: 150}, {wpx: 50},{wps:100},{wps:100}])

    }
    loadData(date=''){


        if (this.props.is_demo=='1'){

            this.setState({...this._dealData(demoData.data),isLoading:false})

            return;
        }

        this.setState({
            isLoading:true
        })

        apis.loadLiabilityDate(this.props.companyid,date).then(
            (responseData) => {

                if(responseData.code == 0){

                    this.setState({...this._dealData(responseData.data),isLoading:false})


                }else{
                    this.setState({
                        isLoading:false
                    })
                    Toast.show(responseData.msg?responseData.msg:'加载失败')

                }
            },
            (e) => {
                this.setState({
                    isLoading:false
                })
                Toast.show('加载失败')
            },
        );
    }
    _dealData(arr){
        let xslxData = [['资产','行次','期末数','年初数','负债和所有者(或股东)','行次','期末数','年初数']];
        let assets = arr.slice(0,46);
        let liabilities = arr.slice(47,arr.length)
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
        assets = [...assets,...placeholdArr,arr[46]];

        for(let i = 0;i<assets.length;i++){
            let assetsDic = assets[i];
            let liabilitiesDic = liabilities[i];
            xslxData.push([assetsDic.projectName,i+1,assetsDic.endSum,assetsDic.preSum,liabilitiesDic.projectName,i+47,liabilitiesDic.endSum,liabilitiesDic.preSum])

        }

        return {
            assets,
            liabilities,
            xslxData
        }
    }
    render(){


        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <ServiceNavigatorBar isSecondLevel = {true} isDemo = {this.props.is_demo} navigator={this.props.navigator} title="资产负债表" shareToWeXin = {this._shareToWeXin.bind(this)}  />

                <TimeSearchBarTest
                    timeDateArr = {this.state.timeDateArr}
                    timeIndex = {this.state.timeIndex}
                    callback = {this._callback.bind(this)}
                />
                <ScrollableTabView
                    renderTabBar={() => <CustomTabBar
                    />}
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
        paddingLeft:0,
        paddingRight:0
    },

    textStyle:{
        fontSize:16,
        marginTop:10
    }

});
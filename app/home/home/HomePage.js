/**
 * Created by zhuangzihao on 2017/9/8.
 */
import React, {Component} from 'react';
import {
   View,
    Text,
    ScrollView,
    SectionList,
    Dimensions,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import homePageData from '../../data/HomePage.json'
import Swiper from 'react-native-swiper';
const deviceWidth = Dimensions.get('window').width;
const col = 4
const itemMargin = 10
const itemWidth = (deviceWidth - itemMargin*(col+1))/col
export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[]
        };
    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };
    componentDidMount(){
        let dataSource = [];
        for (let i = 0; i<homePageData.data.length;i++){
            let section = {};
            section.key = homePageData.data[i].title;
            section.data = [homePageData.data[i].project];
            for(let j=0;j<section.data.length;j++){
                section.data[j].key = j
            }
            dataSource[i] = section
        }
        this.setState({
            dataSource:dataSource
        })
    }
    render(){

        return(
            <SectionList
                renderItem={this._renderItem.bind(this)}
                renderSectionHeader={this._renderSectionHeader.bind(this)}
                sections={this.state.dataSource}
                stickySectionHeadersEnabled={false}
                ListHeaderComponent={this._listHeaderComponent.bind(this)}
                ListFooterComponent={this._listFooterComponent.bind(this)}
            >
            </SectionList>
        )
    }
    _renderItem (item) {
        return(
            <View style={{flexDirection:'row',flexWrap:'wrap',flex:1}}>
                {
                    item.item.map((item, i) => {
                        return(
                            <TouchableOpacity key={i} onPress={this._goDetail.bind(this,item)}>
                                <Text style={{width:itemWidth,marginRight:itemMargin,textAlign:'center'}} >{item.subTitle}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }
    _listFooterComponent(){
        let arr = ['安全','专业','价优','智能','放心','贴心'];
        return(
            <View style={{width:deviceWidth,flexDirection:'row',justifyContent:'space-around'}}>
                {
                    arr.map((item,index)=>{
                        return (
                            <View key={index}>
                                <Text>{item}</Text>
                            </View>
                        )
                    })
                }
            </View>
        )
    }
    _renderSectionHeader(item){
        return(
            <Text>{item.section.key}</Text>
        )
    }
    _listHeaderComponent(){
        let arr = ['注册公司','记账报税','财务报表','企业变更','加盟合作']
        return(
            <View style={{width:DeviceInfo.width,height:150}}>
                <Swiper style={styles.wrapper} >
                    <View style={styles.slide1}>
                        <Text style={styles.text}>Hello Swiper</Text>
                    </View>
                    <View style={styles.slide2}>
                        <Text style={styles.text}>Beautiful</Text>
                    </View>
                    <View style={styles.slide3}>
                        <Text style={styles.text}>And simple</Text>
                    </View>
                </Swiper>
                <View style={{flexDirection:'row',width:deviceWidth,height:50}}>
                    {
                        arr.map((item,i)=>{
                            return(
                                <TouchableOpacity key={i} style={{flex:1}}>
                                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                        <Image source={require('../../img/account_red.png')}/>
                                        <Text>{item}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>

        )
    }
    _goDetail(item){
        this.props.navigator.push({
            screen: 'HomeDetailPage',
            backButtonTitle: '返回', // 返回按钮的文字 (可选)
            backButtonHidden: false, // 是否隐藏返回按钮 (可选)
            passProps:{
                detailArr:[
                    {
                        title:'有限公司',
                        url:'https://wx.pilipa.cn/register.html?title=1'
                    },
                    {
                        title:'合伙人企业',
                        url:'https://wx.pilipa.cn/register.html?title=2'
                    },
                    {
                        title:'个人独资',
                        url:'https://wx.pilipa.cn/register.html?title=3'
                    },
                    {
                        title:'企业分公司注册',
                        url:'https://wx.pilipa.cn/register.html?title=4'
                    }
                ]
            }
        });
    }

}

const styles = StyleSheet.create({
    wrapper: {
        height:100
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
})
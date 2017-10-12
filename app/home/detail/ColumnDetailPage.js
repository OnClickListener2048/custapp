/**
 * Created by zhuangzihao on 2017/9/11.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    StyleSheet,
    Linking,
    PanResponder,
    Animated
} from 'react-native';
import WebTab from './WebVIew'
import BComponent from '../../base';
import * as apis from '../../apis';
import DefaultView from '../../view/DefaultView'
import Toast from 'react-native-root-toast'

const col = 4
const mag = 10
const boxWidth = Dimensions.get('window').width - 20
const itemWidth = (boxWidth-(col+1)*mag)/col

const window = Dimensions.get('window');
export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;
export default class ColumnDetailPage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataArr:[],
            itemSelected:{},
            loadState:'loading',
        };

        this.marginTopValue= new Animated.Value(0)

    }
    static defaultProps = {
        type:'1', //1注册公司 2记账报税 3企业变更
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.props.type)
        });
    }
    componentWillMount() {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,

            onPanResponderGrant: (e, gestureState) => {

                this.pageX = e.nativeEvent.pageX;
                this.pageY = e.nativeEvent.pageY;
            },
            onPanResponderMove: (e, gestureState) => {

                if (Math.abs(this.pageY - e.nativeEvent.pageY) > Math.abs(this.pageX - e.nativeEvent.pageX)) {
                    // 上下滑动
                    if(this.pageY>e.nativeEvent.pageY){
                        //向上滑动
                        Animated.spring(this.marginTopValue, {
                            toValue: 1,
                            duration: 250,
                        }).start()
                    }else{
                        //向下滑动
                        Animated.spring(this.marginTopValue, {
                            toValue: 0,
                            duration: 250,
                        }).start()
                    }
                }
            },

        });
    }
    loadData(type = '0'){
        let loading = SActivityIndicator.show(true, "加载中...");

        apis.loadHomeData(type).then(
            (responseData) => {
                SActivityIndicator.hide(loading);

                if(responseData.code == 0 ){
                    if(responseData.list.length>0){
                        this.setState({
                            dataArr:responseData.list[0].products,
                            itemSelected:responseData.list[0].products[0],
                            loadState:'success'
                        })
                    }else{
                        this.setState({
                            loadState:'no-data'
                        })
                    }
                }else{
                    this.setState({
                        loadState:'error'
                    })
                    Toast.show(responseData.msg?responseData.msg:'加载失败！')
                }
            },
            (e) => {
                this.setState({
                    loadState:NetInfoSingleton.isConnected?'error':'no-net',
                })
                Toast.show('加载失败!')
                SActivityIndicator.hide(loading);

            },
        );

    }

    callPhone(){
        Linking.openURL('tel:13522807924')

    }
    onlineMessage(){
        //在线留言
    }

    render(){
        const marginTop = this.marginTopValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -DeviceInfo.width*0.4+20]
        })
        if(this.state.loadState == 'success'){
            return(
                <View {...this._panResponder.panHandlers} style={{flex:1,backgroundColor:'#f9f9f9'}} >
                    <Animated.View  style={{backgroundColor:'#f9f9f9',paddingBottom:10,paddingTop:10,marginTop}}>
                        <Image  style={{width:DeviceInfo.width,height:DeviceInfo.width*0.4}} source={{uri:this.state.itemSelected.img}}/>
                        <View style={{backgroundColor:'white', marginTop:-13,marginLeft:10,marginRight:10,paddingTop:10,paddingBottom:20,flexDirection:'row',flexWrap:'wrap',borderRadius:3}}>
                            {
                                this.state.dataArr.map((item,index)=>{
                                    let color = '#666666'
                                    let borderColor='#ECECEC'


                                    if(this.state.itemSelected._id == item._id){
                                        color = '#FF3238'
                                        borderColor = '#FF3238'
                                    }

                                    return(
                                        <TouchableOpacity key={index} onPress={()=>{this.change(index)}}>
                                            <View  style={[{marginLeft:mag,marginTop:mag,width:itemWidth,height:(2*itemWidth)/5,justifyContent:'center',alignItems:'center',borderColor,borderWidth:1}]}>
                                                <Text style={[{fontSize:14,color}]}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>

                                    )
                                })
                            }
                        </View>
                    </Animated.View>
                    <WebTab url={this.state.itemSelected.desc_url} />
                    <View style={styles.tabViewContainer}>
                        <TouchableOpacity
                            style={{flexDirection: 'row',height:50,width:(SCREEN_WIDTH - 4)/2}}
                            onPress={() => {
                                this.callPhone()
                            }}>
                            <View style={{flexDirection: 'row',justifyContent:'center',flex:1,alignItems:'center',backgroundColor:'#E13238'}}>
                                <Text style={{fontSize:16,textAlign:'center',color:'#ffffff'}}>{'免费咨询'}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{flexDirection: 'row',height:50,width:(SCREEN_WIDTH - 4)/2}}
                            onPress={() => {
                                this.onlineMessage()
                            }}>
                            <View  style={{flexDirection: 'row',justifyContent:'center',flex:1,alignItems:'center',backgroundColor:'#E19F0E'}}>
                                <Text style={{fontSize:16,textAlign:'center',color:'#ffffff'}}>{'在线留言'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }else{
            return(
                <DefaultView onPress={()=>this.loadData(this.props.type)} type ={this.state.loadState}/>
            )
        }
    }

    change(index) {
        if (this.state.dataArr[index]._id != this.state.itemSelected._id) {
            this.setState({
                itemSelected:this.state.dataArr[index]
            })
        }
    }

}



const styles = StyleSheet.create({


    tabViewContainer: {
        height: 50,
        width: SCREEN_WIDTH,
        backgroundColor: '#FFFFFF',
        justifyContent:'space-between',
        flexDirection: 'row',
    },
    btnTouchContainer: {
        flexDirection: 'row',
        height:50,
        width:(SCREEN_WIDTH - 4)/2
    },

    btnContainer: {
        flexDirection: 'row',
        justifyContent:'center',
        flex:1,
        alignItems:'center'
    },
    textContainer: {
        fontSize:16,
        textAlign:'center',
        color:'#ffffff'
    },


});
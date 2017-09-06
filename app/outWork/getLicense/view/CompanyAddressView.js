/**
 * Created by jinglan on 2017/6/26.
 */
import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
} from 'react-native';
import SActivityIndicator from '../../../modules/react-native-sww-activity-indicator/index';
import Toast from 'react-native-root-toast';
import * as apis from '../../../apis/index';
import Picker from 'react-native-picker';

const window = Dimensions.get('window');
export const height = window.height;
export const width = window.width;

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        height:50,
        flexDirection: 'row',
        paddingTop:10,
        paddingBottom:2,
        backgroundColor:'#FFFFFF'
    },
    leftTipStyle: {
        marginLeft: 15,
        paddingTop:5,
        fontSize:15,
        color:"#323232",
        width:85,
    },
    rightViewStyle: {
        marginRight: 15,
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex : 1

    },

    rightRowViewStyle: {
        flexDirection: 'row',
        height: 30,
        backgroundColor:'white',
        // justifyContent:'center',
        alignItems:'center',


    },

    selectBtnStyle: {

        width : 20,
        height : 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems:'center',
    },
    leftdownDrapViewStyle: {
        flexDirection: 'row-reverse',
        alignItems:'center',
        // width : 105.5,
        flex : 1,
        marginLeft : 4.5,
        marginRight : 0,
        height : 30,
        borderRadius: 2.5,
        borderWidth: 1,
        borderColor : '#e6e6e6',
        backgroundColor: 'white',
    },

    rightdownDrapViewStyle: {
        flexDirection: 'row-reverse',
        alignItems:'center',
        marginLeft : 0,
        marginRight : 0,
        // width : 105.5,
        flex : 1,
        height : 30,
        borderWidth: 1,
        borderRadius: 2.5,
        borderColor : '#e6e6e6',
        backgroundColor: 'white',
    },



});

export default class  CompanyAddressView extends Component{
    constructor(props) {
        super(props)
        this.state = {
            city:this.props.city,
            district:this.props.district,
            isFouces:this.props.isFouces,
            loadedArea:this.props.loadedArea,
            areaArr:this.props.areaArr,
            areaCodeArr:this.props.areaCodeArr,
            isPickerOpen:this.props.isPickerOpen,
            selectArea:this.props.selectArea,
            areaCodeIndexArr:this.props.areaCodeIndexArr,
            selectAreaCode:this.props.selectAreaCode,
            // city:'市',
            // district:'区',
        }

        console.log("this.props.city=" + this.props.city);
        this._timePress = this._timePress.bind(this);
        this.setArea = this.setArea.bind(this);
    }


    static propTypes = {
        city:PropTypes.string,
        district:PropTypes.string,
        isFouces:PropTypes.bool,
    };


    setArea(data:[],dataId:[]) {

        //
        this.state.selectAreaCode = dataId;
        if (data.length == 1 && data[0].length > 0 ){
            this.setState({city:data[0]});
        }else if (data.length > 1){
            this.setState({city:data[0].length > 0 ? data[0] : '市',
                district:data[1].length > 0 ? data[1] : '区'});
        }
    }

    _timePress(){
        if (this.state.loadedArea){
            this._showAreaPicker();

            return;
        }else {
            this._loadAreaData();
        }
    };

    //获取城市数据信息
    _loadAreaData() {

        let loading = SActivityIndicator.show(true, "加载中...");
        apis.loadDicArea().then(
            (responseData) => {
                SActivityIndicator.hide(loading);

                if(responseData !== null && responseData.data !== null) {

                    this.state.loadedArea = true;
                    this.state.areaArr = [];
                    this.state.areaCodeArr = [];

                    for(let index in responseData.data) {

                        let  secDic = new Object();
                        secDic["" + index + ""] = responseData.data[index].name;

                        if (responseData.data[index].name.length == 0){
                            secDic["" + index + ""] = ['(空)']
                        }

                        this.state.areaArr = this.state.areaArr.concat(secDic);

                        let  secCodeDic = new Object();
                        secCodeDic["" + responseData.data[index].code + ""] = responseData.data[index].codes;

                        if (responseData.data[index].name.length == 0){
                            secCodeDic["" + responseData.data[index].code + ""] = ['']
                        }

                        this.state.areaCodeArr = this.state.areaCodeArr.concat(secCodeDic);

                    }

                    this._showAreaPicker();

                }
            },
            (e) => {
                SActivityIndicator.hide(loading);
                console.log("获取失败" , e);
                Toast.show(errorText( e ));
            },
        );
    }

    componentWillReceiveProps(props) {

        if(this.state.isPickerOpen===false){
            this.setState({
                isPickerOpen:true,
                });
            this.props.callback();
        }
    }

    //市区picker弹框
    _showAreaPicker() {
        this.setState({
            isPickerOpen : true,
        });
        this.props.callback();
        Picker.init({
            pickerConfirmBtnText: '确认',
            pickerConfirmBtnColor: [0xe5, 0x15 ,0x1d, 1],
            pickerCancelBtnText: '取消',
            pickerCancelBtnColor: [0, 0 ,0, 1],
            pickerTitleText: '请选择注册地',
            pickerData: this.state.areaArr,
            pickerBg :  [0xff, 0xff ,0xff, 1],
            // pickerToolBarBg : [0xff, 0xff ,0xff, 1],
            // pickerData: pickerData,
            selectedValue: this.state.selectArea,
            onPickerConfirm: pickedValue => {
                //因为若什么都不选择的时候是不会走onPickerSelect方法的 但是会走此方法把默认的值传过来 即不管选择与否都会走这个方法
                //所以直接在这个方法里面拿到选择的地址名称(pickeValue就是['北京','朝阳区']),去遍历codeId找到选择的'市Id','区Id'
                this.setState({
                    isPickerOpen : false,
                });

                for (let  i = 0 ; i < this.state.areaArr.length ; i++){
                    let isBreak = false;
                    let  areaDic = this.state.areaArr[i];

                    for(let areaSec in areaDic) {
                        let cityName = areaSec;          //市名称
                        if (cityName === pickedValue[0]){
                            let districtsArr = areaDic[cityName]; //区数组

                            for (let  j = 0 ; j < districtsArr.length ; j++) {
                                let districtName = districtsArr[j];
                                if (districtName === pickedValue[1]) {
                                    this.state.areaCodeIndexArr = [i,j];
                                    break;
                                }
                            }
                            isBreak = true;
                            break;
                        }
                    }
                    if (isBreak){
                        break;
                    }
                }
                console.log('哈哈自己筛选后==>', this.state.areaCodeIndexArr[0],this.state.areaCodeIndexArr[1]);

                let  cityIndex = this.state.areaCodeIndexArr[0];
                let  districtIndex = this.state.areaCodeIndexArr[1];

                let secDic = this.state.areaCodeArr[cityIndex];  //找到市所在的一组数据 {'市Id' : ['区Id','区Id']}}

                for(let secCode in secDic) {
                    let cityCodeId = secCode;          //市id
                    let districtArr = secDic[secCode]; //区数组
                    let districtCodeId = districtArr[districtIndex];
                    this.state.selectAreaCode = [cityCodeId,districtCodeId];
                    this.setState({
                        city:cityCodeId,
                        district:districtCodeId,
                    });
                }
                //设置地址文字
                    this.setArea(pickedValue,this.state.selectAreaCode);
                this.props.callback();
            },
            onPickerCancel: pickedValue => {
                // console.log('area', pickedValue);
                this.setState({
                    isPickerOpen : false,

                });
                this.props.callback();

            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                // this.state.areaCodeTmpIndexArr = pickedIndex;

                // console.log('Select Area areaCodeTmpIndexArr', pickedValue, pickedIndex , this.state.areaCodeTmpIndexArr );
            }
        });
        Picker.show();
    }

    render() {

        return (
            <View
                style = {styles.container}>
                <Text style = {styles.leftTipStyle}>{'公司地址'}</Text>

                <View style={styles.rightViewStyle}>
                    {this.props.isFouces?
                    <View style={ styles.rightRowViewStyle}>
                        <TouchableOpacity  style={ styles.leftdownDrapViewStyle}  onPress={() => {this._timePress()}}>
                        {/*<View style={ styles.leftdownDrapViewStyle}>*/}
                            <Image source={require('../../../img/down.png')}/>
                            <Text  numberOfLines={1} style={[{textAlign:'center',marginRight: 5,fontSize:15, justifyContent: 'center',flex: 1,color: '#323232',}]}>{this.state.city}</Text>

                        {/*</View>*/}
                        </TouchableOpacity>


                        {/*<View style={[{height: 1, backgroundColor:'#e6e6e6',marginLeft: 10, marginRight:10,width:20}]}></View>*/}
                        <TouchableOpacity style={ styles.rightdownDrapViewStyle} onPress={() => {this._timePress()}}>

                        {/*<View style={ styles.rightdownDrapViewStyle}>*/}
                            <Image source={require('../../../img/down.png')}/>
                            <Text  numberOfLines={1} style={[{textAlign:'center',marginLeft: 5, fontSize:15,justifyContent: 'center',flex: 1,color: '#323232',}]}>{this.state.district}</Text>

                        {/*</View>*/}
                        </TouchableOpacity>


                    </View>:

                        <View style={ styles.rightRowViewStyle}>
                                <View style={ styles.leftdownDrapViewStyle}>
                                <Text  numberOfLines={1} style={[{textAlign:'center',marginRight: 5, justifyContent: 'center',flex: 1,color: '#323232'}]}>{this.state.city}</Text>

                                </View>
                            {/*<View style={[{height: 1, backgroundColor:'#e6e6e6',marginLeft: 10, marginRight:10,width:20}]}></View>*/}

                                <View style={ styles.rightdownDrapViewStyle}>
                                <Text  numberOfLines={1} style={[{textAlign:'center',marginLeft: 5, justifyContent: 'center',flex: 1,color: '#323232'}]}>{this.state.district}</Text>

                                </View>

                        </View>}

                    <View style={ styles.rightRowViewStyle}>


                    </View>
                </View>



            </View>
        );
    }
}


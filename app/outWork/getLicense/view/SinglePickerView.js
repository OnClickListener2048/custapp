/**
 * 单列选择器
 */
import React, {Component, PropTypes} from 'react';
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


export default class SinglePickerView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hint: this.props.hint,
            value: this.props.value,
            valueId: this.props.valueId,
            pickerType:this.props.pickerType,
            loadedArea:false,
            corpIndustryValue:null,//企业类型，所属行业集合
            industry:this.props.industry,
            corpType:this.props.corpType,
            industryId:this.props.industryId,
            corpTypeId:this.props.corpTypeId,
            isPickerOpen:false,
        }
        this.industryNames = [];
        this.corpTypeNames = [];
        this.selectedValues = [''];
        this.selectedValue = [''];
        console.log("this.props.city=" + this.props.city);

        // this._Press = this._Press.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    static propTypes = {
        hint: PropTypes.string,// 左侧提示文案
        value: PropTypes.string,//显示值
        onPress: PropTypes.func,// 点击回调
        enable: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.number])// 是否启用编辑
    };

    setValue(value) {
        this.setState({value: value});
    }

    // _Press() {
    //     if (this.props.onPress) {
    //         this.props.onPress();
    //     }
    // };

    // 行业选择/企业类型选择
    _industryPickerClick(pickerType) {
        console.log('_industryPickerClick'+pickerType);
        let loading = SActivityIndicator.show(true, "加载中...");
        this.lastID = null;
        apis.loadDicData().then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                if(responseData !== null && responseData.data !== null){
                    this.state.loadedArea = true;
                    this.industryNames = [];
                    this.corpTypeNames = [];
                    this.setState({corpIndustryValue:responseData.data,});
                    responseData.data.industry.forEach(key => this.industryNames.push(key.Text) );
                    responseData.data.corpType.forEach(key => this.corpTypeNames.push(key.Text) );


                    if(pickerType==='industry'&& responseData.data.industry !== null){//行业选择
                        const industry = this.state.value;
                        this.setState({industryId: this.props.valueId});
                        if(industry !== undefined) {
                            this.selectedValue = [industry];
                        }
                        console.log('_industryPicker====');

                        this._showSinglePicker(this.industryNames, this.selectedValue,
                            '请选择所属行业', (value) => {
                                this.setState({industry: value,value:value});
                                responseData.data.industry.forEach(key => {
                                    if(key.Text == value) {
                                        //Toast.show('选中' + value + ",id=" + key.Id);
                                        this.setState({industryId: key.Id});
                                    }
                                } );
                            });
                    }else if(pickerType==='corpType'&& responseData.data.corpType !== null){//企业类型
                        const corpType = this.state.value;
                        this.setState({corpTypeId: this.props.valueId});
                        if(corpType !== undefined) {
                            this.selectedValues = [corpType];
                        }
                        console.log('_corpTypePicker====');

                        this._showSinglePicker(this.corpTypeNames, this.selectedValues,
                            '请选择企业类型', (value) => {
                                this.setState({corpType: value,value:value});
                                console.log('选中企业类型' + value);
                                responseData.data.corpType.forEach(key => {
                                    if(key.Text == value) {
                                        //Toast.show('选中' + value + ",id=" + key.Id);
                                        this.setState({corpTypeId: key.Id});
                                    }
                                } );
                            });
                    }

                }
            },
            (e) => {
                SActivityIndicator.hide(loading);
                console.log("获取失败" , e);
                Toast.show(errorText( e ));
            },
        );
    }

    _pickerClick(pickerType){
        if (this.state.loadedArea){
            if(pickerType==='industry'){
                this._showSinglePicker(this.industryNames, this.selectedValue,
                    '请选择所属行业', (value) => {
                        this.setState({industry: value,value:value});
                        this.state.corpIndustryValue.industry.forEach(key => {
                            if(key.Text == value) {
                                //Toast.show('选中' + value + ",id=" + key.Id);
                                this.setState({industryId: key.Id});
                            }
                        } );
                    });

            }else{
                this._showSinglePicker(this.corpTypeNames, this.selectedValues,
                    '请选择企业类型', (value) => {
                        this.setState({corpType: value,value:value});
                        console.log('选中企业类型' + value);
                        this.state.corpIndustryValue.corpType.forEach(key => {
                            if(key.Text == value) {
                                //Toast.show('选中' + value + ",id=" + key.Id);
                                this.setState({corpTypeId: key.Id});
                            }
                        } );
                    });

            }
            return;
        }else {
            this._industryPickerClick(pickerType);
        }
    }

    componentWillReceiveProps(props) {

        if(this.state.isPickerOpen===false){
            this.setState({
                isPickerOpen:true,
            });
            this.props.callback();
        }
    }

    // 显示单列选择框, 参数为类型
    _showSinglePicker(pickerData, selectedValue, title:string,
                      confirmValueCallback:Function) {
        this.setState({
            isPickerOpen : true,
        });
        this.props.callback();
        // selectedValue = ['a', 2];

        Picker.init({
            pickerTitleText: title,
            pickerConfirmBtnText: '确认',
            pickerConfirmBtnColor: [0xe5, 0x15 ,0x1d, 1],
            pickerCancelBtnText: '取消',
            pickerCancelBtnColor: [0, 0 ,0, 1],
            pickerBg :  [0xff, 0xff ,0xff, 1],
            pickerData: pickerData,
            selectedValue: selectedValue,
            onPickerCancel: pickedValue => {
                this.setState({
                    isPickerOpen : false,
                });
                this.props.callback();

            },
            onPickerConfirm: (pickedValue, pickedIndex) => {
                this.setState({
                    isPickerOpen : false,
                });
                console.log('Confirm Area', pickedValue[0], pickedIndex);

                let isRefresh = false;

                if (pickedValue.length > 0){

                    for(let i = 0 ; i < pickerData.length ; i++) {
                        let subInfoStr = pickerData[i];
                        console.log('到这里' + subInfoStr + pickedValue[0] + '个数' +  pickerData.length + '相等吗?' + subInfoStr === pickedValue[0]);
                        if (subInfoStr === pickedValue[0]) {
                            isRefresh = true;
                            break;
                        }
                    }

                }

                if (confirmValueCallback && isRefresh == true){
                    confirmValueCallback(pickedValue);
                    console.log('到这里2');

                }
                this.props.callback();

            },
        });
        Picker.show();
    }

    render() {
        const {hint, enable} = this.props;
        return (

            <View
                style={styles.container}>
                <Text style={styles.leftTipStyle}>{this.props.hint}</Text>

                <View style={styles.rightViewStyle}>

                        {!enable &&
                        <View style={styles.textShowStyle}>
                            {this.state.value===''?<Text numberOfLines={1} style={[{
                                    textAlign: 'left',
                                    marginRight: 5,
                                marginBottom: 5,
                                    justifyContent: 'flex-end',
                                    flex: 1,
                                fontSize:15,
                                    color: '#323232',
                                }]}>{'请选择'}</Text>:
                            <Text numberOfLines={1} style={[{
                                textAlign: 'left',
                                marginRight: 5,
                                marginBottom: 5,
                                color: '#323232',
                                fontSize:15,
                                justifyContent:'flex-end',
                            }]}>{this.state.value}</Text>}
                        </View>
                        }

                        {enable &&
                        <TouchableOpacity style={{paddingBottom:13,paddingTop:1,flex:1,backgroundColor:'white',alignItems: 'flex-start',justifyContent:'flex-start'}} onPress={() => {
                            this._pickerClick(this.props.pickerType)
                        }}>
                            <View style={styles.leftdownDrapViewStyle}>
                            <Image source={require('../../../img/down.png')}/>
                            {this.state.value===''?<Text numberOfLines={1} style={[{
                                textAlign: 'center',
                                marginRight: 5,
                                justifyContent: 'center',
                                flex: 1,
                                color: '#323232',
                            }]}>{'请选择'}</Text>
                            :<Text numberOfLines={1} style={[{
                                textAlign: 'center',
                                marginRight: 5,
                                justifyContent: 'center',
                                flex: 1,
                                    fontSize:15,
                                color: '#323232',
                            }]}>{this.state.value}</Text>}
                            </View>
                        </TouchableOpacity>
                        }

                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 2,
        backgroundColor: 'white'
    },
    textShowStyle: {
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 0.5,
        width: width- 110,
        backgroundColor:'white',
        flex:1,
        marginBottom:18,
        justifyContent:'flex-end'
    },

    leftTipStyle: {
        marginLeft: 15,
        width:85,
        paddingTop: 5,
        color:'#323232',
        fontSize:15,

    },
    rightViewStyle: {
        marginRight: 15,
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor:'white'

    },

    rightRowViewStyle: {
        flexDirection: 'row',
        height: 20,
        // backgroundColor: 'white',
        backgroundColor:'white',
        // justifyContent:'center',
        alignItems: 'center',
    },
    leftdownDrapViewStyle: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        width : width-115,
        flex: 1,
        marginLeft: 4.5,
        marginRight: 0,
        height: 30,
        borderRadius: 2.5,
        borderWidth: 1,
        borderColor: '#e6e6e6',
        backgroundColor: 'white',
    },
});
/**
 * 单列选择器
 */
import React, {Component, PropTypes} from 'react';
import {
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
            value: '',
            isPickerOpen:this.props.isPickerOpen,
            valueFormat:this.props.valueFormat,//2018-01-22
            valuePicker:'',//2018年1月22日
        }

        this.setValue = this.setValue.bind(this);
    }

    static propTypes = {
        valueFormat: PropTypes.string,//显示值
        onPress: PropTypes.func,// 点击回调
    };

    setValue(value) {
        this.setState({value: value});
    }

    componentWillReceiveProps(props) {
        if(this.state.isPickerOpen===false){
            this.setState({
                isPickerOpen:true,
            });
            this.props.callback();
        }
    }

    _createDateData() {
        let date = [];
        for(let i=1950;i<2100;i++){
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    for(let k=1;k<29;k++){
                        (k<10)?day.push('0'+k+'日'):day.push(k+'日');
                    }
                    //Leap day for years that are divisible by 4, such as 2000, 2004
                    if(i%4 === 0){
                        day.push(29+'日');
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        (k<10)?day.push('0'+k+'日'):day.push(k+'日');
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        (k<10)?day.push('0'+k+'日'):day.push(k+'日');
                    }
                }
                let _month = {};
                (j<10)?_month['0'+j+'月'] = day :_month[j+'月'] = day;
                month.push(_month);
            }
            let _date = {};
            _date[i+'年'] = month;
            date.push(_date);
        }
        return date;
    }

    //将时间2018-01-22格式改为数组：[ '2018年', '01月','22日']
    _dataPiackerList(value){
        var valueList = [];
        console.log("输出传值=="+value);
        if(value!==undefined&&value!=='--'&&value!==''){
            var strlist = value.split('-');
            for(let i=0;i<strlist.length;i++){
                if(i===0) valueList.push(strlist[i]+'年');
                if(i===1) valueList.push(strlist[i]+'月');
                if(i===2) valueList.push(strlist[i]+'日');
            }
        }
        return valueList;
    }

    // 显示单列选择框, 参数为类型
    _showSinglePicker() {
        this.setState({
            isPickerOpen : true,
        });
        this.props.callback();

        Picker.init({
            pickerTitleText: '',
            pickerConfirmBtnText: '确认',
            pickerConfirmBtnColor: [0xCE, 0xAF ,0x72, 1],
            pickerCancelBtnText: '取消',
            pickerCancelBtnColor: [0, 0 ,0, 1],
            pickerBg :  [0xff, 0xff ,0xff, 1],
            pickerData: this._createDateData(),
            selectedValue: this._dataPiackerList(this.props.valueFormat),
            onPickerCancel: pickedValue => {
                this.setState({
                    isPickerOpen : false,
                });
                this.props.callback();

            },
            onPickerConfirm: (pickedValue, pickedIndex) => {
                let strValue = '';
                let strFormat = '';
                for(let p=0;p<pickedValue.length;p++){
                    if(p===0){
                        strValue+=pickedValue[p].substring(0,4);
                        strFormat+=pickedValue[p].substring(0,4);
                    }else{
                        strFormat+=pickedValue[p].substring(0,2);
                        strValue+=pickedValue[p].substring(0,2);
                    }
                    if(p!==2)
                        strFormat+='-';
                }
                this.setState({
                    isPickerOpen : false,
                    value:strValue,//纯数字日期
                    valueFormat:strFormat,//加 - - 日期
                    valuePicker:pickedValue,//加 年 月 日 日期
                });
                console.log('Confirm Area', pickedValue[0], pickedIndex+strValue+strFormat);

                this.props.callback();

            },
        });
        Picker.show();
    }

    render() {
        return (

         <TouchableOpacity style={{flex:1,backgroundColor:'white',marginLeft:15}} onPress={() => {
                this._showSinglePicker()
            }}>
                    <Text numberOfLines={1} style={[{
                            fontSize:17,
                        color: '#333333',
                    }]}>{this.state.valueFormat}</Text>
            </TouchableOpacity>
        );
    }
}

/**
 *  用法: https://github.com/beefe/react-native-picker
 *  npm install react-native-picker --save
 *  react-native link
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from 'react-native';

import Picker from 'react-native-picker';
import area from './area.json';// 此文件其实不需要
import Alert from "../app/modules/react-native-alert"

// var styles = StyleSheet.create({
//     alertTextStyle : {
//         fontFamily: "Arial",//just set global fontFamily
//     },
// })
// Alert.setTextStyle(styles.alertTextStyle);

export default class PickerTest extends Component {

    // 自定义Alert
    _showAlert() {
        let toast = Alert.alert('', '确定退出', [
            {
                text: "取消",
                onPress: ()=>{}
            }
            ,
            {
                text: "确定",
                onPress: ()=>{}
            }
        ]);
    }


    _createDateData() {
        let date = [];
        for(let i=1950;i<2050;i++){
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    for(let k=1;k<29;k++){
                        day.push(k+'日');
                    }
                    //Leap day for years that are divisible by 4, such as 2000, 2004
                    if(i%4 === 0){
                        day.push(29+'日');
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        day.push(k+'日');
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        day.push(k+'日');
                    }
                }
                let _month = {};
                _month[j+'月'] = day;
                month.push(_month);
            }
            let _date = {};
            _date[i+'年'] = month;
            date.push(_date);
        }
        return date;
    }

    _createAreaData() {
        let data = [];
        let len = area.length;
        for(let i=0;i<len;i++){
            let city = [];
            for(let j=0,cityLen=area[i]['city'].length;j<cityLen;j++){
                let _city = {};
                _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                city.push(_city);
            }

            let _data = {};
            _data[area[i]['name']] = city;
            data.push(_data);
        }
        return data;
    }

    _showDatePicker() {
        Picker.init({
            pickerData: this._createDateData(),
            pickerToolBarFontSize: 16,
            pickerFontSize: 16,
            pickerFontColor: [255, 0 ,0, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
            }
        });
        Picker.show();
    }

    _showSiglePicker() {
        let pickerData = [
                    "东城区",
                    "西城区",
                    "崇文区",
                    "宣武区",
                    "朝阳区",
                    "丰台区",
                    "石景山区",
                    "海淀区",
                    "门头沟区",
                    "房山区",
                    "通州区",
                    "顺义区",
                    "昌平区",
                    "大兴区",
                    "平谷区",
                    "怀柔区",
                    "密云县",
                    "延庆县"
                ];
        Picker.init({
            pickerTitleText: '请选择注册地',
            pickerConfirmBtnText: '确认',
            pickerConfirmBtnColor: [0xe5, 0x15 ,0x1d, 1],
            pickerCancelBtnText: '取消',
            pickerCancelBtnColor: [0, 0 ,0, 1],
            pickerData: pickerData,
            selectedValue: [ '宣武区'],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                console.log('Confirm Area', pickedValue, pickedIndex);
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                console.log('Area', pickedValue, pickedIndex);
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                console.log('Select Area', pickedValue, pickedIndex);
            }
        });
        Picker.show();
    }

    _showAreaPicker() {
        let pickerData = [
            {
                "石家庄": [
                    "长安区",
                    "桥东区",
                    "桥西区",
                    "新华区",
                    "郊  区",
                    "井陉矿区",
                    "井陉县",
                    "正定县",
                    "栾城县",
                    "行唐县",
                    "灵寿县",
                    "高邑县",
                    "深泽县",
                    "赞皇县",
                    "无极县",
                    "平山县",
                    "元氏县",
                    "赵  县",
                    "辛集市",
                    "藁",
                    "晋州市",
                    "新乐市",
                    "鹿泉市"
                ]
            },
            {
                "北京": [
                    "东城区",
                    "西城区",
                    "崇文区",
                    "宣武区",
                    "朝阳区",
                    "丰台区",
                    "石景山区",
                    "海淀区",
                    "门头沟区",
                    "房山区",
                    "通州区",
                    "顺义区",
                    "昌平区",
                    "大兴区",
                    "平谷区",
                    "怀柔区",
                    "密云县",
                    "延庆县"
                ]
            },
        ];
        // selectedValue = ['a', 2];
        Picker.init({
            pickerTitleText: '请选择注册地',
            pickerConfirmBtnText: '确认',
            pickerConfirmBtnColor: [0xe5, 0x15 ,0x1d, 1],
            pickerCancelBtnText: '取消',
            pickerCancelBtnColor: [0, 0 ,0, 1],
            // pickerData: this._createAreaData(),
            pickerData: pickerData,
            selectedValue: [ '北京', '昌平区'],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                console.log('Confirm Area', pickedValue, pickedIndex);
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                console.log('Area', pickedValue, pickedIndex);
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                console.log('Select Area', pickedValue, pickedIndex);
            }
        });
        Picker.show();
    }

    _showTimePicker() {
        let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = [];

        for(let i=1;i<51;i++){
            years.push(i+1980);
        }
        for(let i=1;i<13;i++){
            months.push(i);
            hours.push(i);
        }
        for(let i=1;i<32;i++){
            days.push(i);
        }
        for(let i=1;i<61;i++){
            minutes.push(i);
        }
        let pickerData = [years, months, days, ['am', 'pm'], hours, minutes];
        let date = new Date();
        let selectedValue = [
            [date.getFullYear()],
            [date.getMonth()+1],
            [date.getDate()],
            [date.getHours() > 11 ? 'pm' : 'am'],
            [date.getHours() === 12 ? 12 : date.getHours()%12],
            [date.getMinutes()]
        ];
        Picker.init({
            pickerData,
            selectedValue,
            pickerTitleText: 'Select Date and Time',
            wheelFlex: [2, 1, 1, 2, 1, 1],
            onPickerConfirm: pickedValue => {
                console.log('area', pickedValue);
            },
            onPickerCancel: pickedValue => {
                console.log('area', pickedValue);
            },
            onPickerSelect: pickedValue => {
                let targetValue = [...pickedValue];
                if(parseInt(targetValue[1]) === 2){
                    if(targetValue[0]%4 === 0 && targetValue[2] > 29){
                        targetValue[2] = 29;
                    }
                    else if(targetValue[0]%4 !== 0 && targetValue[2] > 28){
                        targetValue[2] = 28;
                    }
                }
                else if(targetValue[1] in {4:1, 6:1, 9:1, 11:1} && targetValue[2] > 30){
                    targetValue[2] = 30;
                    
                }
                // forbidden some value such as some 2.29, 4.31, 6.31...
                if(JSON.stringify(targetValue) !== JSON.stringify(pickedValue)){
                    // android will return String all the time，but we put Number into picker at first
                    // so we need to convert them to Number again
                    targetValue.map((v, k) => {
                        if(k !== 3){
                            targetValue[k] = parseInt(v);
                        }
                    });
                    Picker.select(targetValue);
                    pickedValue = targetValue;
                }
            }
        });
        Picker.show();
    }

    _toggle() {
        Picker.toggle();
    }

    _isPickerShow(){
        Picker.isPickerShow(status => {
            alert(status);
        });
    }

    render() {
        return (
            <View style={{height: Dimensions.get('window').height}}>
                <TouchableOpacity style={{marginTop: 10, marginLeft: 20}} onPress={this._showSiglePicker.bind(this)}>
                    <Text>单列选择</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10, marginLeft: 20}} onPress={this._showDatePicker.bind(this)}>
                    <Text>DatePicker</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10, marginLeft: 20}} onPress={this._showTimePicker.bind(this)}>
                    <Text>TimePicker</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10, marginLeft: 20}} onPress={this._showAreaPicker.bind(this)}>
                    <Text>地区选择器</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10, marginLeft: 20}} onPress={this._toggle.bind(this)}>
                    <Text>toggle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop: 10, marginLeft: 20}} onPress={this._isPickerShow.bind(this)}>
                    <Text>isPickerShow</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{marginTop: 10, marginLeft: 20}} onPress={this._showAlert.bind(this)}>
                    <Text>自定义Alert</Text>
                </TouchableOpacity>

            </View>
        );
    }
};

// AppRegistry.registerComponent('PickerTest', () => PickerTest);

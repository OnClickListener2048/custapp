/**
 * Created by jiaxueting on 2017/6/23.
 */
import React, { Component,PropTypes } from 'react';
import { Text, TouchableOpacity, View,StyleSheet ,Dimensions} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
const window = Dimensions.get('window');
export const SCREEN_WIDTH = window.width;
export const SCREEN_HEIGHT = window.height;

export default class DataTimerView extends Component {

    constructor(props){
        super(props)
        this.state = { isDateTimePickerVisible: this.props.isDateTimePickerVisible,
            date:this.props.date,};
    }

    static propTypes = {
        isDateTimePickerVisible:PropTypes.bool,
    };

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => {this.setState({ isDateTimePickerVisible: false })
        this.props.callback("",this.state.isDateTimePickerVisible);//将数据传递给父组件
    };

    _handleDatePicked = date => {
        console.log('A date has been picked: ', date);
        this.setState({
            date:date,
        }),
        this._hideDateTimePicker();
        this.props.callback(date,this.state.isDateTimePickerVisible);//将日期传递给父组件
    };

    //日期按需求格式化
    _dateFormat(fmt) {
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        console.log(">>>>>"+fmt.Format("yyyy-MM-dd"));
        return fmt.Format("yyyy-MM-dd");
    }

    render() {
        return (
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'rgba(0, 0, 0, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
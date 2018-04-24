/**
 * Created by zhuangzihao on 2018/4/24.
 */
/**
 * Created by zhuangzihao on 2017/9/25.
 */
import React ,{Component} from 'react';
import {
    FlatList,
    View,
    Text
} from 'react-native';
import ServiceCommonCell from './ServiceCommonCell'

export default class DetailLiabilityList extends Component {

    static defaultProps = {
        list:[]
    };
    render(){
        console.log('DetailLiabilityList')
        console.log(this.props.list)
        return(
            <FlatList
                renderItem={this._renderItem.bind(this)}
                data={this.props.list}
                keyExtractor = {(item, index) => index}
            />
        )
    }
    _renderItem(item){
        return(
            <ServiceCommonCell
                projectName = {item.item.projectName}
                isclick = {false}
                endMonth = {'期末数'}
                endYear = {'年初数'}
                endMonthSum = {item.item.endSum}
                endYearSum = {item.item.preSum}
            />

        )
    }

}
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
            <View>
                <Text>{item.item.projectName}</Text>
            </View>
        )
    }

}
/**
 * Created by liufei on 2017/9/19.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    ScrollView,
    ListView,
    RefreshControl
} from 'react-native';

export default class MyOrderStatePage extends Component {

    constructor(props){
        super(props)
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2}),
        }
        this.orderArr=[];
    }

    render(){
        return(
        <View style={styles.container}>
            <ListView    style={[{flex : 1 }]}
                         dataSource={this.state.dataSource}
                         // onEndReached={this._loadMoreData}
                         // renderFooter={this.renderFooter}
                         enableEmptySections={true}
                         onEndReachedThreshold={10}
                         renderRow={this._renderRow.bind(this)}

            />
        </View>
        )
    }

    _renderRow(rowData){

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    }
});
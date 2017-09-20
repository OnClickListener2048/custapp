/**
 * Created by zhuangzihao on 2017/9/8.
 */
import React, {Component} from 'react';
import {
    View,
} from 'react-native';
import CommonCell from '../../view/CommenCell'
import UltimateListView from "react-native-ultimate-listview";
export default class MessagePage extends Component {
    constructor(props) {
        super(props);
    }

    sleep = (time) => new Promise(resolve => setTimeout(() => resolve(), time));

    onFetch = async (page = 1, startFetch, abortFetch) => {
        try {
            //This is required to determinate whether the first loading list is all loaded.
            let pageLimit = 10;
            let skip = (page - 1) * pageLimit;

            //Generate dummy data
            let rowData = Array.from({length: pageLimit}, (value, index) => `item -> ${index + skip}`);

            //Simulate the end of the list if there is no more data returned from the server
            if (page === 10) {
                rowData = [];
            }

            //Simulate the network loading in ES7 syntax (async/await)
            await this.sleep(2000);
            startFetch(rowData, pageLimit);
        } catch (err) {
            abortFetch(); //manually stop the refresh or pagination if it encounters network error
            console.log(err);
        }
    };





    renderItem = (item, index, separator) => {
        return(
            <CommonCell
                leftText="111"
            />
        )
    };

    renderPaginationFetchingView = () => {
        return (
            <View></View>
        );
    };
    render() {
        return (
            <View style={{flex:1}}>
                <UltimateListView
                    ref={(ref) => this.listView = ref}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `${index} - ${item}`}  //this is required when you are using FlatList
                    refreshableMode="advanced" //basic or advanced
                    item={this.renderItem}  //this takes three params (item, index, separator)
                    paginationFetchingView={this.renderPaginationFetchingView}
                />
            </View>
        );
    }



}
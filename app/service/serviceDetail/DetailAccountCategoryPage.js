/**
 * Created by liufei on 2018/4/16.
 */

//明细账列表页面
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    FlatList
} from 'react-native';
import DefaultView from '../../view/DefaultView'
import DetailAccountCateoryCell from "./view/DetailAccountCateoryCell";
export default class DetailAccountCategoryPage extends Component {

    constructor(props){
        super(props)
        this.pageX = '';
        this.pageY = '';
        this.state = {
            late:[],//最近
        };
    }

    static defaultProps = {
        sourceData: [],
        isLate:false
    }


    renderItem = (item) => {
        console.log('item222222',item)

        return(
            <DetailAccountCateoryCell
                categoryItem={item.item}
                timeDateArr={this.props.timeDateArr}
                timeIndex={this.props.timeIndex}
                companyid={this.props.companyid}

                {...this.props}
            />
        )
    };

    _keyExtractor = (item, index) => index;//唯一不同的index作为key

    render(){
        var {sourceData,isLate} = this.props
        console.log('sourceData========',sourceData)

        if(isLate) {
            UserInfoStore.getAccountDetailArr().then(
                (list) => {
                    this.setState({
                            late: list,
                        }
                    );
                    console.log('s保存的数据长度是',list.length)
                },
                (e) => {
                    this.setState({
                            late: [],
                        }
                    );
                }
            );
            sourceData=this.state.late;//针对 最近列表  对其数据进行赋值
        }

        if(sourceData.length!=0) {
            return (
                <View style={styles.container}>
                    <FlatList
                        ref={(ref) => this.listView = ref}
                        data={sourceData}

                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}//为每个item添加唯一的key

                        //解决ScrollableTabView和listView的滑动冲突
                        onTouchStart={(e) => {
                            this.pageX = e.nativeEvent.pageX;
                            this.pageY = e.nativeEvent.pageY;
                        }}
                        onTouchMove={(e) => {
                            if (Math.abs(this.pageY - e.nativeEvent.pageY) > Math.abs(this.pageX - e.nativeEvent.pageX)) {
                                // 下拉
                                this.props.lockSlide();
                            } else {
                                // 左右滑动
                                this.props.openSlide();

                            }
                        }}
                    />
                </View>
            )
        }else{
            return(
                <DefaultView type ='no-data'/>
            )
        }
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F1F1',
        marginTop:10
    }
});
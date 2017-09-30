/**
 * Created by zhuangzihao on 2017/9/25.
 */
import React  from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';
import ExpanableList from '../../view/ExpanableList'
import BComponent from '../../base';
import SectionHeader from '../../view/SectionHeader'
import ServiceCell from './view/ServiceCell'
import HeaderView from '../view/HeaderView'
import ChooseTimerModal from '../../view/ChooseTimerModal'
import * as apis from '../../apis';


export default class AccountsReceivablePage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {
            openOptions:[],
            dataSource:[],
            start_account:'- -',
            end_account:'- -'
        };
    }


    componentDidMount() {
        this.loadData('1','2017-09')
    }
    loadData(companyid = '1',date='',type='2'){
        apis.loadAccounts(companyid,date,type).then(
            (responseData) => {

                if(responseData.code == 0){

                    this.setState({
                        dataSource:responseData.list,
                        start_account:responseData.start_account,
                        end_account:responseData.end_account
                    })
                }
            },
            (e) => {
                console.log('error',e)
            },
        );
    }
    _renderRow (rowItem, rowId, sectionId) {

        return(
            <ServiceCell style={{backgroundColor:'#f9f9f9',paddingTop:26,paddingBottom:26}} underLine={true} title={rowItem.name} item1_name="收入" item2_name="支出" item1_money={'¥'+rowItem.start} item2_money={'¥'+rowItem.end}/>
        )

    };
    _renderSection (section, sectionId) {
        let dic = this.state.dataSource[sectionId]
        return(
            <ServiceCell isOpen={this.state.openOptions[sectionId]} isHeader={true} title={dic.name} titleStyle={{color:'#E13238'}} item1_name="收入" item2_name="支出" item1_money={'¥'+dic.start} item2_money={'¥'+dic.end}/>

        )
    };
    _listHeaderComponent(){
        return(
            <View style={{width:DeviceInfo.width}}>
                <HeaderView
                    hasTop={false}
                    leftDes="收入"
                    leftNum={"¥"+this.state.start_account}
                    rightDes="支出"
                    rightNum={"¥"+this.state.end_account}
                />
                <SectionHeader style={{backgroundColor:'#f9f9f9'}} leftViewStyle={{backgroundColor:'#E13238'}} text="应付账款明细"/>
            </View>
        )
    }
    render() {
        return (
            <View style={{backgroundColor:'#f9f9f9',flex:1}}>
                <ExpanableList
                    ListHeaderComponent = {this._listHeaderComponent.bind(this)}
                    dataSource={this.state.dataSource}
                    headerKey="name"
                    memberKey="others"
                    renderRow={this._renderRow.bind(this)}
                    openOptions={this.state.openOptions}
                    renderSectionHeaderX={this._renderSection.bind(this)}
                    headerClickCallBack={(index)=>this._headerClickCallBack(index)}
                />
                <ChooseTimerModal />

            </View>

        );
    }
    _headerClickCallBack(index){
        let openOptions =this.state.openOptions
        openOptions[index]=!openOptions[index]
        this.setState({openOptions})
    }
}
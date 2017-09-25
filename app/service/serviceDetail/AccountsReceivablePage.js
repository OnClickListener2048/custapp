/**
 * Created by zhuangzihao on 2017/9/25.
 */
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
const MockData = [
    {
        title: '应收账款',
        item1_name:'期初',
        item1_money:'¥30,500.45',
        item2_name:'期末',
        item2_money:'¥60,050.46',
        member: [
            {
                title: '京东',
                item1_name:'期初',
                item1_money:'¥30,500.45',
                item2_name:'期末',
                item2_money:'¥60,050.46',
            },
            {
                title: '国美',
                item1_name:'期初',
                item1_money:'¥30,500.45',
                item2_name:'期末',
                item2_money:'¥60,050.46',
            },

        ]
    }
]
export default class AccountsReceivablePage extends BComponent {

    _renderRow (rowItem, rowId, sectionId) {

        return(
            <ServiceCell style={{backgroundColor:'#f9f9f9',paddingTop:26,paddingBottom:26}} underLine={true} title={rowItem.title} item1_money={rowItem.item1_money} item2_money={rowItem.item2_money}/>
        )

    };
    _renderSection (section, sectionId) {
        let dic = MockData[sectionId]
        return(
            <ServiceCell title={dic.title} titleStyle={{color:'#E13238'}} item1_money={dic.item1_money} item2_money={dic.item2_money}/>

        )
    };
    _listHeaderComponent(){
        return(
            <View style={{width:DeviceInfo.width}}>
                <Image source={require('../../img/service_bg.png')}/>
                <SectionHeader style={{backgroundColor:'#f9f9f9'}} leftViewStyle={{backgroundColor:'#E13238'}} text="应收账款明细"/>
            </View>
        )
    }
    render() {
        return (
            <View style={{backgroundColor:'#f9f9f9',flex:1}}>
                <ExpanableList
                    ListHeaderComponent = {this._listHeaderComponent.bind(this)}
                    dataSource={MockData}
                    headerKey="title"
                    memberKey="member"
                    renderRow={this._renderRow.bind(this)}
                    renderSectionHeaderX={this._renderSection.bind(this)}
                    openOptions={[0]}
                />
            </View>

        );
    }
}
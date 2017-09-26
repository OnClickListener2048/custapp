/**
 * Created by zhuangzihao on 2017/9/25.
 */
import React  from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated
} from 'react-native';
import ExpanableList from '../../view/ExpanableList'
import BComponent from '../../base';
import SectionHeader from '../../view/SectionHeader'
import ServiceCell from './view/ServiceCell'
import ChooseTimerModal from '../../view/ChooseTimerModal'
import HeaderView from '../view/HeaderView'
const MockData = [
    {
        title: '库存现金',
        item1_name:'期初',
        item1_money:'¥30,500.45',
        item2_name:'期末',
        item2_money:'¥60,050.46',
        member: [
            {
                title: '银行存款',
                item1_name:'期初',
                item1_money:'¥30,500.45',
                item2_name:'期末',
                item2_money:'¥60,050.46',
            },
            {
                title: '货币资金',
                item1_name:'期初',
                item1_money:'¥30,500.45',
                item2_name:'期末',
                item2_money:'¥60,050.46',
            },

        ]
    }
]
export default class CashFlowPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

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
                <HeaderView
                    hasTop={true}
                    topDes="本月利润"
                    topNum="¥30,000.00"
                    leftDes="收入"
                    leftNum="¥30,000.00"
                    rightDes="支出"
                    rightNum="¥30,000.00"
                />

                <SectionHeader style={{backgroundColor:'#f9f9f9'}} leftViewStyle={{backgroundColor:'#E13238'}} text="现金流明细"/>
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
                <ChooseTimerModal/>
            </View>

        );
    }
}
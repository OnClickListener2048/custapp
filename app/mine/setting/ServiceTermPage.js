/**
 * Created by liufei on 2017/10/25.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput, WebView
} from 'react-native';
import BComponent from '../../base';

export default class ServiceTermPage extends BComponent {
    render(){
        return(
            <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={[styles.small,{marginTop:10}]}>
                    根据《中华人民共和国合同法》与《中华人民共和国会
                    计法》之规定原则，甲乙双方经友好协商，就企业财务
                    票据处理等有关业务事宜，达成如下协议：
                </Text>
                <Text style={[styles.big,{marginTop:10}]}>
                    一、委托范围：根据甲方委托，利用乙方的网络平台
                </Text>
                <Text style={[styles.small,{marginTop:10}]}>
                    1. 处理日常财务票据；
                </Text>
                <Text style={styles.small}>
                    2. 根据甲方提供的票据生成财务报表；
                </Text>
                <Text style={styles.small}>
                    3. 根据财务报表完成税务申报（申报项目见微信公众号）；
                </Text>
                <Text style={styles.small}>
                    4. 为甲方开设财务软件的查询用户权限（在本合同期限内免费使用乙方提供的财务软件查询功能）；
                </Text>
                <Text style={[styles.big,{marginTop:10}]}>
                    二、甲方的责任和义务
                </Text>
                <Text style={[styles.small,{marginTop:10}]}>
                    1. 建立健全的企业管理制度，依法经营，保证资产的安全完整，保证原始凭证的真实、合法、准确、完整，积极配合乙方工作。甲方在每月25日前为乙方提供完整的会计资料，包括各种发票的使用情况、银行存款的详细情况（出示银行对账单）。如果甲方提供资料不全、票据失真致使乙方无法继续工作，从而导致工商税务处罚，由甲方负责，甲方并对提供的会计原始凭证的真实性负责。
                </Text>
                <Text style={styles.small}>
                    2. 安排专人负责现金和银行存款的收付，按《会计基础工作规范》要求保管好所有的往来单据。
                </Text>
                <Text style={styles.small}>
                    3. 做好会计凭证传递过程中的登记和保管工作。
                </Text>
                <Text style={styles.small}>
                    4. 按本合同规定及时足额的支付服务费用。
                </Text>
                <Text style={styles.small}>
                    5. 在报税期，甲方需向乙方提供公章、财务章、人名章等相关资料，如果与甲方联系不上，其后果由甲方负责。
                </Text>
                <Text style={styles.small}>
                    6. 在服务开始前，客户需提供以下资料和信息：
                </Text>
                <Text style={styles.small}>
                    1) 营业执照复印件
                </Text>
                <Text style={styles.small}>
                    2) 组织机构代码证复印件
                </Text>
                <Text style={styles.small}>
                    3) 税务登记证（国税、地税）复印件
                </Text>
                <Text style={styles.small}>
                    4) 验资报告复印件
                </Text>
                <Text style={styles.small}>
                    5) 开户许可证复印件
                </Text>
                <Text style={styles.small}>
                    6) 银行基本存款帐户及纳税专户帐号
                </Text>
                <Text style={styles.small}>
                    7) 企业报税的计算机代码
                </Text>
                <Text style={styles.small}>
                    8) 公司地址及电话
                </Text>
                <Text style={styles.small}>
                    9) 分管税务局（税务专管员）联系电话
                </Text>
                <Text style={styles.small}>
                    10) 公司负责人的联系方式
                </Text>
                <Text style={[styles.big,{marginTop:10}]}>
                    三、乙方的责任和义务：
                </Text>
                <Text style={[styles.small,{marginTop:10}]}>
                    1. 根据《中华人民共和国会计法》《企业会计制度》《小企业会计制度》及《企业会计准则》和各项税收管理等有关规定选择符合资质的人员或机构为甲方开展代理记帐业务。
                </Text>
                <Text style={styles.small}>
                    2. 根据甲方的经营特点和管理需要，选择相应的会计核算制度。
                </Text>
                <Text style={styles.small}>
                    3. 为甲方开设财务软件的查询用户权限（在本合同期限内免费使用乙方提供的财务软件查询功能）。并培训甲方负责人通过网络查询帐目。
                </Text>
                <Text style={styles.small}>
                    4. 妥善保管甲方的所有会计资料，由乙方原因造成甲方资料丢失，应由乙方负责弥补并承担由此引起的经济损失。赔偿的上限不超过当月服务费（实际支付）的两倍。
                </Text>
                <Text style={styles.small}>
                    5. 对工作中涉及的甲方商业机密和会计资料严格保密，不得随意向外透露、出示和传递。
                </Text>
                <Text style={[styles.big,{marginTop:10}]}>
                    四、结算方式：
                </Text>
                <Text style={[styles.small,{marginTop:10}]}>
                    经过双方商定，服务费标准以乙方公众号所列为准， 因活动促销的价格变动不影响所提供服务内容，在服务的过程中，增加服务项目，收费项目见微信公众号列表。服务期限根据甲方在乙方服务账号的选择为准，服务到期后是否续约由甲方自行确定。
                </Text>
                <Text style={[styles.big,{marginTop:10}]}>
                    五、违约责任
                </Text>
                <Text style={[styles.small,{marginTop:10}]}>
                    任何一方如有违反合同的规定，给对方造成的损失的，则按《中华人民共和国合同法》的规定承担违约责任。如果甲方在合同未到期之前提出中止本合同，支付的费用不予退还，乙方负责将甲方电子账目和其他材料退还甲方；如果乙方在合同未到期之前提出中止本合同，则乙方负责完成当月的报税工作，并退还剩余服务费。凡因执行本协议所发生的，或与本协议有关的一切争议，双方应通过友好协商解决；如果协商不能解决，可根据双方达成的仲裁协议进行仲裁，或向人民法院提起诉讼，如不采取诉讼方式，仲裁裁决的结果是终局的，对双方都有约束力。在争议解决过程中，除双方有争议正在进行仲裁或诉讼的部分外，本协议应继续履行。由于不可抗力造成的损失，由各方自负。另一方有责任尽力协助减少损失。
                </Text>
                <Text style={[styles.big,{marginTop:10}]}>
                    六、本协议自双方签字之日起生效，有效期壹年。
                </Text>
                <Text style={[styles.big,{marginTop:10}]}>
                    七、本协议一式两份，双方各执一份。
                </Text>
                <Text style={[styles.big,{marginTop:10}]}>
                    八、在网站，微信公众号，电子方式下进行的支付视同默认本合同的全部条款
                </Text>

            </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#F1F1F1',
        flex: 1,
        paddingTop:10,

        marginBottom:10
    },
    contentContainer: {
        backgroundColor:'#ffffff',
        paddingHorizontal:10,
    },
    small:{
        fontSize:14,
        color:'#666666',
        lineHeight:22,
        marginTop:5
    },
    big:{
        fontSize:16,
        color:'#333333',
        lineHeight:25,
    }



});


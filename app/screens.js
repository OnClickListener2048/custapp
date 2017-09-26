// 所有需要通过导航跳转的组件都需要在此文件中注册, 第一个参数为组件别名, 需要唯一
import { Navigation } from 'react-native-navigation';

// 引用外部文件
import LoginPage from './user/LoginPage';

import HomePage from './home/home/HomePage';
import VerifyNamePage from './home/VerifyName/VerifyNamePage';
import VerifyResultPage from './home/VerifyName/VerifyResultPage';
import MessagePage from './message/message/MessagePage';
import MinePage from './mine/mine/MinePage';
import ServicePage from './service/service/ServicePage';
import HomeDetailPage from './home/detail/HomeDetailPage'
import BindPhonePage from './mine/bindPhone/BindPhonePage'
import MyOrderPage from './mine/myOrder/MyOrderPage'

import ChangeCompanyPage from './mine/companyInfo/ChangeCompanyPage'
import CompanyInfoPage from './mine/companyInfo/CompanyInfoPage'
import CompanySurveyPage from './mine/companyInfo/CompanySurveyPage'
import LicenceInfoPage from './mine/companyInfo/LicenceInfoPage'

import SettingPage from './mine/setting/SettingPage'
import FeedbackPage from './mine/setting/FeedbackPage'
import AboutUsPage from './mine/setting/AboutUsPage'
import ProgressDetailPage from './mine/myOrder/ProgressDetailPage'
import SystemMessagePage from './message/detail/SystemMessagePage';

import CashFlowPage from './service/serviceDetail/CashFlowPage'
import AccountsReceivablePage from './service/serviceDetail/AccountsReceivablePage'
import AccountsPayablePage from './service/serviceDetail/AccountsPayablePage'
import ProfitStatementPage from './service/serviceDetail/ProfitStatementPage'
import TaxFormPage from './service/serviceDetail/TaxFormPage'


export default function () {
    let reg = Navigation.registerComponent;
    reg('LoginPage', () => LoginPage);
    reg('HomePage', () => HomePage);
    reg('VerifyNamePage', () => VerifyNamePage);
    reg('VerifyResultPage', () => VerifyResultPage);
    reg('MessagePage', () => MessagePage);
    reg('MinePage', () => MinePage);
    reg('ServicePage', () => ServicePage);
    reg('HomeDetailPage', () => HomeDetailPage);
    reg('BindPhonePage', () => BindPhonePage);
    reg('MyOrderPage', () => MyOrderPage);
    reg('ChangeCompanyPage', () => ChangeCompanyPage);
    reg('CompanyInfoPage', () => CompanyInfoPage);
    reg('CompanySurveyPage', () => CompanySurveyPage);
    reg('LicenceInfoPage', () => LicenceInfoPage);
    reg('SettingPage', () => SettingPage);
    reg('FeedbackPage', () => FeedbackPage);
    reg('AboutUsPage', () => AboutUsPage);
    reg('SystemMessagePage', () => SystemMessagePage);
    reg('ProgressDetailPage', () => ProgressDetailPage);
    reg('CashFlowPage', () => CashFlowPage);
    reg('AccountsReceivablePage', () => AccountsReceivablePage);
    reg('AccountsPayablePage', () => AccountsPayablePage);
    reg('ProfitStatementPage', () => ProfitStatementPage);
    reg('TaxFormPage', () => TaxFormPage);




}
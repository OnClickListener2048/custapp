// 所有需要通过导航跳转的组件都需要在此文件中注册, 第一个参数为组件别名, 需要唯一
import { Navigation } from 'react-native-navigation';

// 引用外部文件
import LoginPage from './user/LoginPage';

import HomePage from './home/home/HomePage';
import InvoiceInputPage from './home/invoice/InvoiceInputPage';
import AddInvoiceTitlePage from './home/invoice/AddInvoiceTitlePage';
import VerifyNamePage from './home/VerifyName/VerifyNamePage';
import PersonalDataPage from './mine/mine/PersonalDataPage';
import VerifyResultPage from './home/VerifyName/VerifyResultPage';
import MessagePage from './message/message/MessagePage';

import ServiceMessagePage from './message/message/ServiceMessagePage';
import NotifyMessagePage from './message/message/NotifyMessagePage';


import MinePage from './mine/mine/MinePage';
import ServicePage from './service/service/ServicePage';
import ProductDetailPage from './home/detail/ProductDetailPage'
import ColumnDetailPage from './home/detail/ColumnDetailPage'


import BindPhonePage from './mine/bindPhone/BindPhonePage'
import FirstBindPhonePage from './user/FirstBindPhonePage'
import MyOrderPage from './mine/myOrder/MyOrderPage'

import ChangeCompanyPage from './mine/companyInfo/ChangeCompanyPage'
import CompanyInfoPage from './mine/companyInfo/CompanyInfoPage'
import CompanySurveyPage from './mine/companyInfo/CompanySurveyPage'
import AccreditPhonePage from './mine/companyInfo/AccreditPhonePage'
import LicenceInfoPage from './mine/companyInfo/LicenceInfoPage'

import SettingPage from './mine/setting/SettingPage'
import FeedbackPage from './mine/setting/FeedbackPage'
import AboutUsPage from './mine/setting/AboutUsPage'
import AboutPilipaPage from './mine/setting/AboutPilipaPage'
import ServiceTermPage from './mine/setting/ServiceTermPage'
import ProgressDetailPage from './mine/myOrder/ProgressDetailPage'
import SystemMessagePage from './message/detail/SystemMessagePage';

import CashFlowPage from './service/serviceDetail/CashFlowPage'
import AccountsReceivablePage from './service/serviceDetail/AccountsReceivablePage'
import AccountsPayablePage from './service/serviceDetail/AccountsPayablePage'
import ProfitStatementPage from './service/serviceDetail/ProfitStatementPage'
import TaxFormPage from './service/serviceDetail/TaxFormPage'

import Notification from './view/NotificationView'
import NoNetTipPage from './view/NoNetTipPage'

import WebViewPage from './view/WebViewPage'
import AccountAndSecurity from "./mine/bindPhone/AccountAndSecurity";
import ChangeCompanyLightBox from './view/ChangeCompanyLightBox'
import LogViewer from "./mine/setting/LogViewer";

import UpdateLightBox from './view/UpdateLightBox'
import AccreditInputBox from './mine/companyInfo/AccreditInputBox'
import QRCodeScreenPage from './view/QRCodeScreenPage'

import InvoiceMainPage from './home/invoice/InvoiceMainPage'
import InvoiceInfoPage from './home/invoice/InvoiceInfoPage'

import HomeTipBox from './view/HomeTipBox'
import DebugPage from "./mine/debug/DebugPage";
import {HttpLogView}  from 'react-native-http';
import HttpLogDetailPage from "./mine/debug/HttpLogDetailPage";


export default function () {
    let reg = Navigation.registerComponent;
    reg('LoginPage', () => LoginPage);
    reg('HomePage', () => HomePage);
    reg('VerifyNamePage', () => VerifyNamePage);
    reg('VerifyResultPage', () => VerifyResultPage);
    reg('PersonalDataPage', () => PersonalDataPage);
    reg('MessagePage', () => MessagePage);
    reg('ServiceMessagePage', () => ServiceMessagePage);
    reg('NotifyMessagePage', () => NotifyMessagePage);
    reg('MinePage', () => MinePage);
    reg('ServicePage', () => ServicePage);
    reg('FirstBindPhonePage', () => FirstBindPhonePage);
    reg('BindPhonePage', () => BindPhonePage);
    reg('MyOrderPage', () => MyOrderPage);
    reg('ChangeCompanyPage', () => ChangeCompanyPage);
    reg('CompanyInfoPage', () => CompanyInfoPage);
    reg('CompanySurveyPage', () => CompanySurveyPage);
    reg('AccreditPhonePage', () => AccreditPhonePage);
    reg('LicenceInfoPage', () => LicenceInfoPage);
    reg('SettingPage', () => SettingPage);
    reg('FeedbackPage', () => FeedbackPage);
    reg('AboutUsPage', () => AboutUsPage);
    reg('AboutPilipaPage', () => AboutPilipaPage);
    reg('ServiceTermPage', () => ServiceTermPage);
    reg('SystemMessagePage', () => SystemMessagePage);
    reg('ProgressDetailPage', () => ProgressDetailPage);
    reg('CashFlowPage', () => CashFlowPage);
    reg('AccountsReceivablePage', () => AccountsReceivablePage);
    reg('AccountsPayablePage', () => AccountsPayablePage);
    reg('ProfitStatementPage', () => ProfitStatementPage);
    reg('TaxFormPage', () => TaxFormPage);
    reg('VerifyResultPage', () => VerifyResultPage);
    reg('Notification', () => Notification);
    reg('ProductDetailPage', () => ProductDetailPage);
    reg('ColumnDetailPage', () => ColumnDetailPage);
    reg('NoNetTipPage', () => NoNetTipPage);
    reg('WebViewPage', () => WebViewPage);
    reg('AccountAndSecurity', () => AccountAndSecurity);
    reg('ChangeCompanyLightBox', () => ChangeCompanyLightBox);
    reg('LogViewer', () => LogViewer);
    reg('UpdateLightBox', () => UpdateLightBox);
    reg('HomeTipBox', () => HomeTipBox);
    reg('AccreditInputBox', () => AccreditInputBox);
    reg('QRCodeScreenPage', () => QRCodeScreenPage);
    reg('InvoiceMainPage', () => InvoiceMainPage);
    reg('InvoiceInputPage', () => InvoiceInputPage);
    reg('AddInvoiceTitlePage', () => AddInvoiceTitlePage);
    reg('InvoiceInfoPage', () => InvoiceInfoPage);
    reg('DebugPage', () => DebugPage);
    reg('HttpLogView', () => HttpLogView);
    reg('HttpLogDetailPage', () => HttpLogDetailPage);

}
// 所有需要通过导航跳转的组件都需要在此文件中注册, 第一个参数为组件别名, 需要唯一
import { Navigation } from 'react-native-navigation';

// 引用外部文件
import LoginPage from './user/LoginPage';

import HomePage from './home/home/HomePage';
import InvoiceInputPage from './home/invoice/InvoiceInputPage';
import AddInvoiceTitlePage from './mine/invoice/AddInvoiceTitlePage';
import VerifyNamePage from './home/VerifyName/VerifyNamePage';
import PersonalDataPage from './mine/mine/PersonalDataPage';
import VerifyResultPage from './home/VerifyName/VerifyResultPage';
import MessagePage from './message/message/MessagePage';

import ServiceMessagePage from './message/message/ServiceMessagePage';
import NotifyMessagePage from './message/message/NotifyMessagePage';


import MinePage from './mine/mine/MinePage';
import ServicePage from './service/service/ServicePage';



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
import VouchersListPage from './service/serviceDetail/VouchersListPage'
import DetailAccountPage from './service/serviceDetail/DetailAccountPage'
import AccountVoucherPage from './service/serviceDetail/AccountVoucherPage'
import GeneralLedgerPage from './service/serviceDetail/GeneralLedgerPage'

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
import InvoiceTitleListPage from "./mine/invoice/InvoiceTitleListPage";

import {HttpLogView}  from 'react-native-http';
import HttpLogDetailPage from "./mine/debug/HttpLogDetailPage";

import CheckInvoiceTitlePage from './mine/invoice/CheckInvoiceTitlePage'
import ToolsPage from './home/tools/ToolsPage'

import SupportPage from './service/support/SupportPage'

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
    reg('VouchersListPage', () => VouchersListPage);
    reg('DetailAccountPage', () => DetailAccountPage);
    reg('AccountVoucherPage', () => AccountVoucherPage);
    reg('GeneralLedgerPage', () => GeneralLedgerPage);
    reg('VerifyResultPage', () => VerifyResultPage);
    reg('Notification', () => Notification);
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
    reg('InvoiceTitleListPage', () => InvoiceTitleListPage);
    reg('CheckInvoiceTitlePage', () => CheckInvoiceTitlePage);
    reg('InvoiceInfoPage', () => InvoiceInfoPage);
    reg('DebugPage', () => DebugPage);
    reg('HttpLogView', () => HttpLogView);
    reg('HttpLogDetailPage', () => HttpLogDetailPage);
    reg('ToolsPage', () => ToolsPage);
    reg('SupportPage', () => SupportPage);
}
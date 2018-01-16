/**
 * Created by jiaxueting on 2017/12/26.
 */
/**
 * 设置 > 企业信息>手机号授权
 */
import {postApi, getApi,deleteApi} from './common';

// 获取公司被授权看账的手机号列表
export function getAccreditMobile(companyId = '',ownerMobile = '') {
    return getApi('/api/v1/auth/account', { companyId,ownerMobile});
}

// 授权手机号看账
export async function addAccreditMobile(ownerMobile = '',mobile = '',companyId = '',companyName = '') {
    return await postApi('/api/v1/auth/account', {ownerMobile,mobile,companyId,companyName});
}

// 取消手机号的看账权限
export async function deleteAccreditMobile(ownerMobile = '',mobile = '',companyId = '',companyName='') {
    return await deleteApi('/api/v1/auth/account', {ownerMobile,mobile,companyId,companyName});
}

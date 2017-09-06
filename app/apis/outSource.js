/**
 * Created by jiaxueting on 2017/6/22.
 */

import {postApi, getApi} from './common';

/**
 * 外勤主任务数
 * @returns {Promise}
 */
export function loadOutSourceCount() {
    return postApi('/app/v0/outsource/count');
}

/**
 * 外勤主任务列表
 * @param count
 * @param sinceId
 * @param taskType  todo（待处理）或inProgress（进行中）, end（已完成）或all（全部）
 * @returns {Promise}
 */
export function loadOutSourceList(count = 15, sinceId = '',taskType='') {
    return postApi('/app/v0/outsource/list',{count, sinceId ,taskType });
}


/**
 * 我的外勤-主任务详情 即 公司信息 + 所有的任务信息 包括 任务处理人员 任务ID 任务状态
 */

export function loadOutSourceTask(taskId = '') {
    return postApi('/app/v0/outsource/task',{taskId});
}

/**
 * 我的外勤-主任务-步骤详情 最复杂的一页
 */
export function  loadOutSourceTaskStep(stepId = '' , taskId = '') {
    return postApi('/app/v0/outsource/task/step',{stepId,taskId});
}

/**
 * 我的外勤-主任务-步骤详情-任务进度变化
 * finished	结束任务	boolean	@mock=false
 * inProgress	开始任务	boolean	@mock=false
 * materialConfirm	确认材料	boolean	@mock=false
 * stepId	步骤 ID, 必填	string	@mock=1
 * taskId	任务ID, 必填	string	@mock=1
 */

export function loadOutSourceTaskStepChange(finished = false , inProgress = false , materialConfirm = false , stepId = '' , taskId = '') {
    return postApi('/app/v0/outsource/task/step/change',{finished,inProgress,materialConfirm,stepId,taskId});
}

/*
*地区信息
*/
export function loadDicArea(city = '') {
    return postApi('/app/v0/dic/area',{city});
}

// 行业列表等数据词典
export function loadDicData() {
    return postApi('/app/v0/dic/outsource/corp');
}

/**
 * 我的外勤-主任务-步骤详情-保存修改
 * @param clientObj
 * @returns {Promise}
 */
export function postClientMessage(clientObj) {
    return postApi('/app/v0/outsource/task/step/save',clientObj);
}

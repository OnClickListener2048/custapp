import Helper from "./Helper";

const helper = new Helper();
describe('--> Greet Button <--', () => {
    beforeEach(() => helper.setup());
    beforeEach(() => helper.login());
    // afterEach(() => helper.teardown());
    it('我的页面数据检测', async() => {
        let driver = helper.driver;

        await driver.waitForElementByAccessibilityId('mine_MyOrders', 20000)// 等待我的订
            .elementByAccessibilityId('left_text')// 获取我的订单左侧文案;
            .text();
        let leftTexts = await driver.elementsByAccessibilityId('left_text');
        console.log(leftTexts);

        let text = await leftTexts[0].text();
        console.log(text);
        expect(text).toEqual('我的公司');
        text = await leftTexts[1].text();
        console.log(text);
        expect(text).toEqual('我的订单');

        text = await leftTexts[2].text();
        console.log(text);
        expect(text).toEqual('我的抬头');

        text = await leftTexts[3].text();
        console.log(text);
        expect(text).toEqual('联系客服');

        text = await leftTexts[4].text();
        console.log(text);
        expect(text).toEqual('加盟合作');

        text = await leftTexts[5].text();
        console.log(text);
        expect(text).toEqual('设置');

        let rightTexts = await driver.elementsByAccessibilityId('right_text');
        console.log(leftTexts);
        text = await rightTexts[0].text();
        console.log(text);
        expect(text).toEqual('2');

        text = await rightTexts[1].text();
        console.log(text);
        expect(text).toEqual('3');

        text = await rightTexts[2].text();
        console.log(text);
        expect(text).toEqual('2');

    });

    it('我的公司页数据检测', async() => {

        let driver = helper.driver;
        //点击我的公司页面
        await driver.waitForElementByAccessibilityId('mine_MyCompany',20000).click();
        let company_lefts = await driver.waitForElementsByAccessibilityId('company_left',20000);
        let text = await company_lefts[0].text();
        console.log(text);
        expect(text).toEqual('西藏鑫康医疗器械有限责任公司');
        text = await company_lefts[1].text();
        console.log(text);
        expect(text).toEqual('徐州市全兴空调汽配有限公司');







    });


    it('我的订单列表页数据检测', async() => {

        let driver = helper.driver;
         await driver.waitForElementByAccessibilityId('mine_MyOrders',20000).click();
         let tabTexts = await driver.waitForElementsByAccessibilityId('myOrders_tab_text');
         let text= await tabTexts[0].text();
         console.log(text);
         expect(text).toEqual('进行中');
         await tabTexts[0].click();//点击进行中标签

        //  判断 进行中 数据显示
        let stateTexts = await driver.waitForElementsByAccessibilityId('myOrders_state_text');
        text= await stateTexts[0].text();
         expect(text).toEqual('订单状态');
        let states = await driver.waitForElementsByAccessibilityId('myOrders_state');
        text= await states[0].text();
        expect(text).toEqual('执行中');
        text= await states[1].text();
        expect(text).toEqual('执行中');
        text= await states[2].text();
        expect(text).toEqual('执行中');
        let ordernos = await driver.waitForElementsByAccessibilityId('myOrders_orderno');
        text= await ordernos[0].text();
        expect(text).toEqual('订单号:2424');
        text= await ordernos[1].text();
        expect(text).toEqual('订单号:1aq11111');
        text= await ordernos[2].text();
        expect(text).toEqual('订单号:1aq11111');
        let times = await driver.waitForElementsByAccessibilityId('myOrders_time');
        text= await times[0].text();
        expect(text).toEqual('2018-01-17');
        text= await times[1].text();
        expect(text).toEqual('2018-01-30');
        text= await times[2].text();
        expect(text).toEqual('2018-01-30');

        //判断 已驳回 数据显示
        text= await tabTexts[1].text();
        console.log(text);
        expect(text).toEqual('已驳回');
        await tabTexts[1].click();//点击已驳回标签
        text=await driver.waitForElementByAccessibilityId('no_data',10000).text();
        expect(text).toEqual('您还没有任何相关数据');

        //判断 已结束 数据显示
        text= await tabTexts[2].text();
        console.log(text);
        expect(text).toEqual('已结束');
        await tabTexts[2].click();//点击已结束标签
        text=await driver.waitForElementByAccessibilityId('no_data',10000).text();
        expect(text).toEqual('您还没有任何相关数据');

        //判断 全部 数据显示
        text= await tabTexts[3].text();
        console.log(text);
        expect(text).toEqual('全部');
        await tabTexts[3].click();//点击全部标签

         stateTexts = await driver.waitForElementsByAccessibilityId('myOrders_state_text');
        text= await stateTexts[0].text();
        expect(text).toEqual('订单状态');
         states = await driver.waitForElementsByAccessibilityId('myOrders_state');
        text= await states[0].text();
        expect(text).toEqual('执行中');
        text= await states[1].text();
        expect(text).toEqual('执行中');
        text= await states[2].text();
        expect(text).toEqual('执行中');
         ordernos = await driver.waitForElementsByAccessibilityId('myOrders_orderno');
        text= await ordernos[0].text();
        expect(text).toEqual('订单号:2424');
        text= await ordernos[1].text();
        expect(text).toEqual('订单号:1aq11111');
        text= await ordernos[2].text();
        expect(text).toEqual('订单号:1aq11111');
         times = await driver.waitForElementsByAccessibilityId('myOrders_time');
        text= await times[0].text();
        expect(text).toEqual('2018-01-17');
        text= await times[1].text();
        expect(text).toEqual('2018-01-30');
        text= await times[2].text();
        expect(text).toEqual('2018-01-30');

    });


});
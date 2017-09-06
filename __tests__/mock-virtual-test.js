import virtualApi from 'virtualApi';

jest.mock('virtualApi', () => {
        return {
            sendVerifyVCode:
                () => {
                    return 'abc';
                    // 也可返回async的Promise方法
                    // return new Promise((resolve, reject) => {
                    //     process.nextTick(
                    //         () =>
                    //             resolve(JSON.parse('{"success":true,"code":200,"msg":null,"data":null}'))
                    //     )
                    // });
                }
        }
    }, {virtual: true}
);


it('can fetch', async () => {
    expect(virtualApi.sendVerifyVCode()).toEqual('abc');
});
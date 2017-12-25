import pushJump from '../pushJump';

it('pushJump success', () => {
    pushJump(null, "pilipa://view.orders.detail?orderno=订单号&test=你好");
});
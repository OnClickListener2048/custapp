package cn.pilipa.custapp.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.theweflex.react.WeChatModule;

import cn.pilipa.custapp.MainActivity;
import cn.pilipa.custapp.MainApplication;

import static android.content.pm.PackageManager.MATCH_DEFAULT_ONLY;

/**
 * 当小程序唤起App时, 进入这个Activity, 但是整个应用还没有初始化.
 */
public class WXEntryActivity extends Activity implements IWXAPIEventHandler {
    String WECHAT_APP_ID = "wx16da5000356a9497";// 微信APP ID
    // IWXAPI 是第三方app和微信通信的openapi接口
    private IWXAPI api;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        System.out.println("*************** WXEntryActivity Created *******");
        System.out.println("*************** MainActivity.appInited *******" + MainActivity.appInited);
        api = WXAPIFactory.createWXAPI(this, WECHAT_APP_ID, false);
        api.handleIntent(getIntent(), this);

        WeChatModule.handleIntent(getIntent());
//        finish(); // 直接Finish会导致从小程序无法启动主App
    }

    @Override
    public void onReq(BaseReq baseReq) {
        System.out.println("*************** WXEntryActivity onReq *******" + baseReq);
        if (baseReq.getType() == 4) { // com.tencent.mm.opensdk.modelmsg.ShowMessageFromWX$Req 打开App请求信息类型
//            PackageManager packageManager = getReactApplicationContext().getPackageManager();
//            Intent intent = packageManager.getLaunchIntentForPackage("cn.pilipa.custapp");
//            getReactApplicationContext().startActivity(intent);

            // TODO 检查 App 是否正常启动运行, 如果载入完毕则返回, 否则先启动App的默认View入口
            if (MainActivity.appInited) {
                finish();
                System.out.println("*************** MainActivity.appInited onReq *******" + MainActivity.appInited);
                Intent intent = getPackageManager()
                        .getLaunchIntentForPackage(getPackageName());
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(intent);
            } else {
                Intent intent = getPackageManager()
                        .getLaunchIntentForPackage(getPackageName());
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            }
        }
    }

    @Override
    public void onResp(BaseResp baseResp) {
        // 收到分享完毕的回调, 则关闭Activity
        finish();
    }
}
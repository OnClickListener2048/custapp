package cn.pilipa.custapp;

import android.os.Bundle;
import android.support.annotation.LayoutRes;

import com.reactnativenavigation.controllers.SplashActivity;

import cn.jpush.android.api.JPushInterface;
import com.umeng.analytics.MobclickAgent;

// 闪屏界面: R.layout.launch_screen
public class MainActivity extends SplashActivity {

    /**
     * @return xml layout res id
     */
    @LayoutRes
    public int getSplashLayout() {
        return R.layout.launch_screen;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        JPushInterface.init(this);
        System.out.println("Init Jpush()");
        MobclickAgent.setDebugMode(true);
        // SDK在统计Fragment时，需要关闭Activity自带的页面统计，
        // 然后在每个页面中重新集成页面统计的代码(包括调用了 onResume 和 onPause 的Activity)。
        MobclickAgent.openActivityDurationTrack(false);
        // MobclickAgent.setAutoLocation(true);
        // MobclickAgent.setSessionContinueMillis(1000);
        // MobclickAgent.startWithConfigure(
        // new UMAnalyticsConfig(mContext, "4f83c5d852701564c0000011", "Umeng",
        // EScenarioType.E_UM_NORMAL));
        MobclickAgent.setScenarioType(this, MobclickAgent.EScenarioType.E_UM_NORMAL);

    }


    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
        MobclickAgent.onPause(this);

    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
        MobclickAgent.onResume(this);
    }


}
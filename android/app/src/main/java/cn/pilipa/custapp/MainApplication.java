package cn.pilipa.custapp;

import android.support.annotation.Nullable;
import android.support.multidex.MultiDex;

import cn.pilipa.alert.PLPAlertPackage;
import com.beefe.picker.PickerViewPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativenavigation.NavigationApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

import cn.jpush.reactnativejpush.JPushPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.facebook.react.ReactPackage;
//import com.tencent.bugly.Bugly;
import com.tencent.bugly.Bugly;
import com.tencent.bugly.beta.Beta;

import java.util.Arrays;
import java.util.List;
import com.theweflex.react.WeChatPackage;
public class MainApplication extends NavigationApplication {
    // 设置为 true 将不弹出 toast
    private boolean SHUTDOWN_TOAST = true;
    // 设置为 true 将不打印 log
    private boolean SHUTDOWN_LOG = true;

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        MultiDex.install(this);
//        CrashReport.initCrashReport(getApplicationContext(), "c2c07c0373", true);
        Bugly.init(getApplicationContext(), "c2c07c0373", true);
        Beta.checkUpgrade(false,false);
    }

    @Nullable
    public List<ReactPackage> createAdditionalReactPackages() {
        return Arrays.<ReactPackage>asList(
                //new MainReactPackage(),
                new PLPAlertPackage(),
                new PickerViewPackage(),
                new PickerPackage(),
                //new NavigationReactPackage(),
                new RNDeviceInfo(),
                new VectorIconsPackage(),
                new BlurViewPackage(),
                new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
                new UmengReactPackage(),
                new WeChatPackage()
        );
    }

}
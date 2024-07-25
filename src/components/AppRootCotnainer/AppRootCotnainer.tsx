import { createContext, useContext, useEffect, useRef, useState } from "react";
import { router, getAppRouterParams, AppRouterType } from "@/router";
import rootStore, { AppStoreType } from "@/store";
import { getAppUpdateManager } from "@/utils";
import { appInfoLogger } from "@/utils/logger";
import { Dialog } from "@taroify/core";
import { View } from "@tarojs/components";
import { observable, when } from "mobx";
import classnames from "classnames/bind";
import AppContainer from "../AppContainer";
import AppModal from "../AppModal";
import { IAppModalRef } from "../AppModal/AppModal";
import AppLoginModal, { IAppLoginModalRef } from "../AppLoginModal";

import localStyle from './AppRootContainer.module.less'


const cx = classnames.bind(localStyle)

interface AppRootContainerContextType {
  store: AppStoreType;
  router: AppRouterType;
  modal: IAppModalRef | undefined;
  loginModal: IAppLoginModalRef | undefined;
}

const DefaultAppRootContainerContext = {
  store: rootStore,
  router: router,
  modal: undefined,
} as AppRootContainerContextType;

const AppRootContainerContext = createContext<AppRootContainerContextType>(
  DefaultAppRootContainerContext
);
const AppRootContainerProvider = ({
  context,
  children,
}: {
  context?: Partial<AppRootContainerContextType>;
  children: React.ReactNode;
}) => {
  return (
    <AppRootContainerContext.Provider
      value={{
        ...DefaultAppRootContainerContext,
        ...context,
      }}
    >
      {children}
    </AppRootContainerContext.Provider>
  );
};
export const useAppRootContainer = () => useContext(AppRootContainerContext);

async function _AppInitailize() {
  // 初始化路由
  router.initialize();

  switch (process.env.TARO_ENV) {
    case "h5": {
      // router.initializeAppLaunchOptions({
      //   webLaunchUrl: window.location.href,
      // })
      return true;
    }
    case "weapp": {
      // rootStore.user.restoreUserStatus()
      await router.waitAppRouterReady();
      let pageParams = getAppRouterParams();

      appInfoLogger("App 系统模块", "onLaunch", pageParams);
      appInfoLogger(
        "App 系统模块",
        "运行平台",
        rootStore.app.systemInfo.platform
      );

      // router.initializeAppLaunchOptions({
      //   options: _options
      // })

      console.log("router", router);

      // require("@/utils/statics/baidu/mtj-wx-sdk");

      // 判断小程序新版本
      const appUpdateManager = getAppUpdateManager();
      appUpdateManager.register();

      // 初始化系统状态
      rootStore.app.initialAppInfo();

      // let _options = options as Taro.getLaunchOptionsSync.LaunchOptions;
      return true;
    }
  }
  return false;
}

export const AppRootContainer = (
  PageComponent: () => JSX.Element,
  options: { independent: boolean } = { independent: false }
) => {
  const appInitializeState = observable({ isAppReady: false });

  if (options.independent) {
    _AppInitailize().then((isReady) => {
      appInitializeState.isAppReady = isReady;
    });
  } else {
    when(
      () => {
        return rootStore.user.isReady && rootStore.app.isReady;
      },
      () => {
        appInitializeState.isAppReady = true;
        console.log('debug rootStore.user.isReady', rootStore.user.isReady)
        console.log('debug rootStore.app.isReady', rootStore.app.isReady)
      }
    );
  }

  return () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isAppComponentReady, setIsAppComponentReady] = useState(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isAppReady, setIsAppReady] = useState(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const appLoginModalRef = useRef<IAppLoginModalRef>();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const appModalRef = useRef<IAppModalRef>();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      when(
        () => appInitializeState.isAppReady,
        () => {
          setIsAppReady(true);
        }
      );
    }, []);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (
        // etc...
        appModalRef.current
      ) {
        setIsAppComponentReady(true)
      }
    }, [appModalRef])

    return (
      <AppRootContainerProvider
        context={{
          modal: appModalRef.current,
          loginModal: appLoginModalRef.current,
        }}
      >
        <View className={cx("app-root-container")}>
          {(isAppReady && isAppComponentReady) ? (
            <PageComponent />
          ) : (
            <AppContainer isLoading></AppContainer>
          )}
        </View>
        <AppModal ref={appModalRef}></AppModal>
        <Dialog id="dialog" />
        <AppLoginModal ref={appLoginModalRef}></AppLoginModal>
      </AppRootContainerProvider>
    );
  };
};

export default AppRootContainer;

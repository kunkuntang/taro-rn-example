import React, { CSSProperties, useLayoutEffect, useRef , PropsWithChildren, useCallback, useEffect, useMemo, useState, useImperativeHandle } from 'react'
import { Text, View, ViewProps } from '@tarojs/components'
import Taro, { pxTransform } from '@tarojs/taro'
import { isFunction } from 'lodash-es'
import { useStore } from '@/store'
import { router, useAppRouter } from '@/router'
import { useAppLoggerHook } from '@/hooks/useAppLoggerHook'
import { AppRoutePathEnum } from '@/router/enum'
import cx from 'classnames/bind'
import { StyleSheet } from 'react-native'

import localStyle from './AppHeader.module.less'


const classNames = cx.bind(localStyle)

export type HeaderActionRefType = {
  getBoundingClientRect: () => Promise<Taro.NodesRef.BoundingClientRectCallbackResult | null>
}

interface IProps {
  title?: string
  titleCustomStyle?: CSSProperties
  fixed?: boolean
  navPlaceHolder?: boolean
  alwayNavBack?: boolean
  isHideNavBack?: boolean
  customNavIconRender?: () => JSX.Element
  backgroudColor?: string
  textColor?: string
  onNavigateBack?: () => void
  isHideHomeIcon?: boolean
  customHomeIconRender?: JSX.Element | (() => JSX.Element)
  homePath?: AppRoutePathEnum
  customHeaderStyle?: CSSProperties
  headerRef?: React.MutableRefObject<HeaderActionRefType | undefined>;

  customNavRightIconRender?: React.ReactNode | (() => React.ReactNode)
}

const ArrowLeft = (props: PropsWithChildren<ViewProps>) => <Text {...props}>返回</Text>
const HomeIcon = (props: PropsWithChildren<ViewProps>) => <Text {...props}>首页</Text>

function AppHeader(props: PropsWithChildren<IProps>) {
  const [headerTitle, setHeaderTitle] = useState('')
  const { infoLogger } = useAppLoggerHook('AppHeader 全局头部组件')

  const { canNavigateBack } = useAppRouter()

  const [navBarHeight, setNavBarHeight] = useState(46)
  const [menuHeight, setMenuHeight] = useState(46)
  const [menuBotton, setMenuBotton] = useState(0)

  const appStore = useStore()
  // 获取系统信息
  const systemInfo = appStore.app.systemInfo
  const isPcPlatform = useMemo(() => (appStore.app.isWindows || appStore.app.isMac), [])
  // 胶囊按钮位置信息
  let [menuButtonInfo, setMenuButtonInfo] = useState(() => {
    if (process.env.TARO_ENV === 'weapp') {
      return Taro.getMenuButtonBoundingClientRect()
    } else {
      return {
        /** 下边界坐标，单位：px */
        bottom: 0,
        /** 高度，单位：px */
        height: 0,
        /** 左边界坐标，单位：px */
        left: 0,
        /** 右边界坐标，单位：px */
        right: 0,
        /** 上边界坐标，单位：px */
        top: 0,
        /** 宽度，单位：px */
        width: 0,
      }
    }
  })

  // const isShowNavBack = useMemo(() => {
  //   return props.isShowNavBack === false ? props.isShowNavBack : canNavigateBack
  // }, [canNavigateBack, props])

  useLayoutEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      let _menuButtonInfo = menuButtonInfo
      if (!_menuButtonInfo) {
        _menuButtonInfo = Taro.getMenuButtonBoundingClientRect()
        setMenuButtonInfo(_menuButtonInfo)
      }

      if (isPcPlatform) {
        const weappNavBarHeight = 50
        setNavBarHeight(weappNavBarHeight)
        setMenuHeight(50)
        setMenuBotton(0)
      } else {
        const weappNavBarHeight =
          (_menuButtonInfo.top -
          (systemInfo.statusBarHeight || 0)) * 2 +
          _menuButtonInfo.height +
          (systemInfo.statusBarHeight || 0) 

        const weappMenuHeight = _menuButtonInfo.height
        const weappMenuBotton = _menuButtonInfo.top - (systemInfo.statusBarHeight || 0)
  
        setNavBarHeight(weappNavBarHeight)
        setMenuHeight(weappMenuHeight)
        setMenuBotton(weappMenuBotton)
      }
    }
  }, [])

  useEffect(() => {
    let pageTitle = props.title
    if (pageTitle) {
      if (pageTitle.length > 7) {
        pageTitle = pageTitle.slice(0, 7) + '...'
      }
      setHeaderTitle(pageTitle)
    } else {
      setHeaderTitle(props.title || '')
    }
  }, [props.title])

  const handleNavigateBack = useCallback(() => {
    router.navigateBack({
      delta: 1,
    })
    if (props.onNavigateBack && isFunction(props.onNavigateBack)) {
      props.onNavigateBack()
    }
  }, [router, props])

  const handleNavigateHome = useCallback(() => {
    router.redirectTo(props.homePath || AppRoutePathEnum.HOME)
  }, [props.homePath, router])

  const renderHomeIcon = useCallback(() => {
    if (props.customHomeIconRender) {
      if (isFunction(props.customHomeIconRender)) {
        return props.customHomeIconRender()
      } else {
        return props.customHomeIconRender;
      }
    } else {
      return <HomeIcon style={{ fontSize: pxTransform(32), color: props.textColor || '#fff'  }} onClick={handleNavigateHome}></HomeIcon>
    }
  }, [handleNavigateHome, props])

  const renderNavIcon = useCallback(() => {
    // infoLogger('isShowNavBack', props.isShowNavBack)
    if (!props.isHideNavBack) {
      // 判断是否可以返回上一页
      if (canNavigateBack || props.alwayNavBack) {
        if (props.customNavIconRender && isFunction(props.customNavIconRender)) {
          return props.customNavIconRender()
        } else {
          return <ArrowLeft style={{ fontSize: pxTransform(32), color: props.textColor || '#fff' }} onClick={handleNavigateBack} />
        }
      } else if (!props.isHideHomeIcon) {
        return renderHomeIcon()
      } else {
        return null
      }
    } else if (!props.isHideHomeIcon) {
      return renderHomeIcon()
    } else {
      return null
    }
  }, [props, canNavigateBack, handleNavigateBack, renderHomeIcon])

  const canShowNavRightIcon = !!props.customNavRightIconRender
  const renderNavRightIcon = () => {
    if (!canShowNavRightIcon) {
      return null
    }
    
    return (
      <View className={classNames('app-header-righticon')}>
        {isFunction(props.customNavRightIconRender) ? props.customNavRightIconRender() : props.customNavRightIconRender}
      </View>
    )

  }

  const renderNavPlaceholder = () => {
    return props.navPlaceHolder !== false ? (
      <View
        className={classNames('app-header-container-placeholder')}
        style={{
          height: navBarHeight,
          ...(props.customHeaderStyle || {})
        }}
      ></View>
    ) : null
  }

  return (
    <>
      <View
        className={classNames([
          'app-header-container',
          {
            'app-fix-header-container': props.fixed ?? true,
          },
        ])}
        style={{
          height: navBarHeight,
          backgroundColor: props.backgroudColor || '#2f80c6',
          color: props.textColor || '#fff',
          ...(props.customHeaderStyle || {})
        }}
      >
        <View className={classNames('app-header-content')}>
          <View
            className={classNames('app-header-statusbar')}
            style={{
              height: (menuButtonInfo.top || 0),
            }}
          ></View>
          {props.children ? (
            props.children
          ) : (
            <View
              className={classNames('app-header-title-content')}
              style={{
                height: menuHeight,
                lineHeight: menuHeight,
                paddingLeft: 8,
                paddingRight: (isPcPlatform ? 10 : menuButtonInfo.width + 10),
                paddingBottom: menuBotton,
              }}
            >
              <View
                className={classNames('app-header-icon')}
                style={{
                  height: menuHeight,
                }}
                onClick={() => (props.onNavigateBack && isFunction(props.onNavigateBack)) ? props.onNavigateBack() : {}}
              >
                {renderNavIcon()}
              </View>
              <View className={classNames('app-header-title')} style={{ ...(props.titleCustomStyle ?? {})}}>
                <Text className={classNames('app-header-title__text')} style={{ marginRight: canShowNavRightIcon ? Taro.pxTransform(16) : 0 }}>{headerTitle}</Text>
              </View>
              {renderNavRightIcon()}
            </View>
          )}
        </View>
      </View>
      {props.fixed !== false && renderNavPlaceholder()}
    </>
  )
}

export default AppHeader

import React, { CSSProperties, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { Text, View, ViewProps } from '@tarojs/components'
import Taro, { pxTransform } from '@tarojs/taro'
import { isFunction } from 'lodash-es'
import cx from 'classnames/bind'

import localStyle from './AppHeader.module.less'

const classNames = cx.bind(localStyle)

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
  // homePath?: AppRoutePathEnum
  homePath?: string
  customHeaderStyle?: CSSProperties
  customNavRightIconRender?: React.ReactNode | (() => React.ReactNode)
}

const ArrowLeft = (props: PropsWithChildren<ViewProps>) => <Text {...props}>返回</Text>
const HomeIcon = (props: PropsWithChildren<ViewProps>) => <Text {...props}>首页</Text>

function AppHeader(props: PropsWithChildren<IProps>) {
  const [headerTitle, setHeaderTitle] = useState('')
  // const { infoLogger } = useAppLoggerHook('AppHeader 全局头部组件')

  // const { canNavigateBack } = useAppRouter()

  const [navBarHeight, setNavBarHeight] = useState(46)
  const [menuHeight, setMenuHeight] = useState(46)
  const [menuBotton, setMenuBotton] = useState(0)

  // const appStore = useStore()
  // 获取系统信息
  const systemInfo = Taro.getSystemInfoSync()


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
    // router.navigateBack({
    //   delta: 1,
    // })
    Taro.navigateBack({
      delta: 1,
    })
    if (props.onNavigateBack && isFunction(props.onNavigateBack)) {
      props.onNavigateBack()
    }
  }, [props])

  const handleNavigateHome = useCallback(() => {
    // router.redirectTo(props.homePath || AppRoutePathEnum.HOME)
    Taro.redirectTo({
      url: props.homePath || ''
    })
  }, [props.homePath])

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
      if (props.alwayNavBack) {
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
  }, [props, handleNavigateBack, renderHomeIcon])

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
              height: 0,
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
                paddingRight: 8,
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

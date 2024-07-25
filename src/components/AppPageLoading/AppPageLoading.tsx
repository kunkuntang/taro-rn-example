import React, { useRef , FC, useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import cx from 'classnames/bind'

import localStyle from './index.module.less'

const classNames = cx.bind(localStyle)

interface AppPageLoadingPropsType {
  isLoading: boolean
  children?: JSX.Element
  height?: number
  isFullscreen?: boolean
  maskOpacity?: number
  zIndex?: number
  delay?: number
}

const AppLoadingGif = `${CDN_URL}/img/qunyou-loading-xcx.gif`

/**
 * @name Spin组件
 * @params visible 控制显示状态
 * @params children loading可包裹
 */
export const AppPageLoading: FC<AppPageLoadingPropsType> = props => {
  const [isLoading, setIsLoading] = useState(false)
  const loadingDelayCurrent = useRef<NodeJS.Timeout | null>(null)
  const loadingContainerHeight = props.isFullscreen ? '100vh' : props.height ?? '100% '

  useEffect(() => {
    // 当需要显示加载中状态时
    if (isLoading === false && props.isLoading === true) {
      if (loadingDelayCurrent.current) {
        clearTimeout(loadingDelayCurrent.current)
      }
      loadingDelayCurrent.current = setTimeout(() => {
        setIsLoading(!!props.isLoading)
        loadingDelayCurrent.current = null
      }, props.delay || 100)
    } else {
      setIsLoading(!!props.isLoading)
    }
  }, [props.delay, props.isLoading])

  return (
    <View
      className={classNames('app-page-container', { hide: !isLoading })}
      style={{ display: isLoading ? 'block' : 'none', height: loadingContainerHeight, zIndex: props.zIndex ?? 1 }}
    >
      {props.children}
      <View className={classNames('app-page-loading')}>
        <Image className={classNames('app-page-loading__img')} src={AppLoadingGif} mode='widthFix'></Image>
      </View>
    </View>
  )
}

export default AppPageLoading

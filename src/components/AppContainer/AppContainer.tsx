import { pxTransform } from '@tarojs/taro'
import { CSSProperties, PropsWithChildren } from 'react'
import cx from 'classnames/bind'
import { View } from '@tarojs/components'
import AppPageLoading from '../AppPageLoading'

import localStyle from './AppContainer.module.less'
import { AppSafeArea } from '../AppSafeArea'

const classNames = cx.bind(localStyle)

export interface IAppContainerProps {
  isLoading?: boolean
  safeAreaTop?: boolean
  safeAreaBottom?: boolean
  statusBarHeight?: number,
  fullscreen?: boolean
  backgroundColor?: string
  style?: CSSProperties | undefined
  /** 当 loading 显示时是否还显示内容 */
  isRenderWithLoading?: boolean
  loadingMaskOpacity?: number
  loadingZIndex?: number
  loadingDelay?: number
}

const SAFE_AREA_INSET_TOP = 'safe-area-inset-top'
const SAFE_AREA_INSET_BOTTOM = 'safe-area-inset-bottom'

function AppContainer(props: PropsWithChildren<IAppContainerProps>) {
  const safeAreaTopStyle = props.safeAreaTop ? `env(${SAFE_AREA_INSET_TOP})` : '0px'
  const safeAreaBottomStyle = props.safeAreaBottom ? `env(${SAFE_AREA_INSET_BOTTOM})` : '0px'
  const containerHeight = props.fullscreen ? '100vh' : '100%'

  const renderContainerContent = () => {
    if (props.isLoading) {
      if (props.isRenderWithLoading) {
        return [
          <AppPageLoading
            key='app-page-loading'
            isLoading={props.isLoading}
            maskOpacity={props.loadingMaskOpacity}
            zIndex={props.loadingZIndex}
            delay={props.loadingDelay}
          ></AppPageLoading>,
          props.children
        ]
      } else {
        return (
          <AppPageLoading
            isLoading={props.isLoading}
            maskOpacity={props.loadingMaskOpacity}
            zIndex={props.loadingZIndex}
            // delay={props.loadingDelay}
          ></AppPageLoading>
        )
      }
    } else {
      return props.children
    }
  }

  return (
    <View
      className={classNames({
        'app-container': true,
        'app-fullscreen-container': props.fullscreen,
      })}
      style={{
        ...props.style,
        ...(
          props.fullscreen ? {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          } : {}
        ),
        backgroundColor: props.backgroundColor ? props.backgroundColor : '#ffffff',
        height: containerHeight,
      }}
    >
      {props.safeAreaTop && <AppSafeArea position='top' />}
      {renderContainerContent()}
      {props.safeAreaBottom && <AppSafeArea position='bottom' />}
    </View>
  )
}

export default AppContainer

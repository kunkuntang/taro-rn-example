import React, { CSSProperties, useEffect, useLayoutEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { ViewProps } from '@tarojs/components/types/View'
import rootStore from '@/store'
import { observer } from 'mobx-react-lite'
import cx from 'classnames/bind'

import localStyle from './AppSafeArea.module.less'

const classNames = cx.bind(localStyle)

export type SafeAreaPosition = 'top' | 'bottom'

export interface SafeAreaProps extends ViewProps {
  position?: SafeAreaPosition
}

interface DeviceSafeAreaInfo { top: number, bottom: number}

export const AppSafeArea = observer((props: SafeAreaProps) => {
  const { className, position, ...restProps } = props

  /** 机型安全区域信息 */
  const [deviceSafeAreaInfo, setDeviceSafeAreaInfo] = useState<DeviceSafeAreaInfo | null>(rootStore.app.deviceSafeAreaInfo)
  useLayoutEffect(() => { 
    setDeviceSafeAreaInfo(rootStore.app.deviceSafeAreaInfo)
   }, [rootStore.app.deviceSafeAreaInfo.top,  rootStore.app.deviceSafeAreaInfo.bottom])

  const getAndroidSafeAreaStyle = (): CSSProperties => {
    if (!deviceSafeAreaInfo) {
      return {} as CSSProperties
    }

    let safeAreaStyle = {} as CSSProperties
    switch (position) {
      case 'top': {
        safeAreaStyle = {
          paddingTop: deviceSafeAreaInfo.top + 'px'
        }
        break;
      }
      case 'bottom': {
        safeAreaStyle = {
          paddingBottom: deviceSafeAreaInfo.bottom + 'px'
        }
        break
      }
      default: {
        
      }
    }

    return safeAreaStyle
  }

  return (
    <View
      className={classNames(
        'app-safe-area',
        {
          ['app-safe-area__top']: position === 'top',
          ['app-safe-area__bottom']: position === 'bottom',
          ['app-safe-area__android']: rootStore.app.isAndroid,
        },
        className
      )}
      style={rootStore.app.isAndroid ? getAndroidSafeAreaStyle() : {}}
      {...restProps}
    />
  )
})
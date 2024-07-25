import React, { CSSProperties , PropsWithChildren } from 'react'
import { pxTransform } from '@tarojs/taro'
import { View } from '@tarojs/components'
import cx from 'classnames/bind'

import localStyle from './AppFooter.module.less'

const classNames = cx.bind(localStyle)

interface IProps {
  isFixed?: boolean
  height?: number
  placeholderHeight?: number
  backgroudColor?: string
  /** 当 placeholderHeight > height 时，可以用来设置背景颜色 */
  placeholderBackgroudColor?: string
  customFooterStyle?: CSSProperties
  isHidePlaceholder?: boolean
}

function AppFooter(props: PropsWithChildren<IProps>) {
  return (
    <>
      <View
        className={classNames([
          'app-footer-container',
          {
            'app-fixed-footer-container': props.isFixed,
          },
        ])}
        style={{
          minHeight: pxTransform(props.height || 128),
          backgroundColor: props.backgroudColor || '#fff',
          ...(props.customFooterStyle || {})
        }}
      >
        {props.children}
      </View>
      {!props.isHidePlaceholder && <View
        className={classNames('app-footer-placehodler')}
        style={{
          height: `calc(env(safe-area-inset-bottom) + ${pxTransform(props.placeholderHeight || props.height || 128)})`,
          backgroundColor: props.placeholderBackgroudColor || 'transparent',
        }}
      ></View>}
    </>
  )
}

export default AppFooter

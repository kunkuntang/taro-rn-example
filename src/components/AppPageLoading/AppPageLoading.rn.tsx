import { Image, View } from '@tarojs/components'
import { FC, useEffect, useState } from 'react'
import cx from 'classnames/bind'

import localStyle from './index.module.less'

const classNames = cx.bind(localStyle)

interface propsType {
  isLoading: boolean
  children?: JSX.Element
  delay?: number
}

/**
 * @name Spin组件
 * @params visible 控制显示状态
 * @params children loading可包裹
 */
export const AppPageLoading: FC<propsType> = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [deg, setDeg] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(!!props.isLoading)
    }, props.delay || 100)
  }, [props])

  useEffect(() => {
    // setInterval(() => {
    //   setDeg(_deg => (_deg + 10) % 360)
    // }, 100)
  }, [])

  return (
    <View className={classNames('spin-page__container', { hide: !isLoading })}>
      {!isLoading && props.children}
      <View className={classNames('spin-page__mask')}></View>
      <View className={classNames('spin-container')}>
        <Image
          className={classNames('spin-lading-people')}
          src='https://test-qicdn.liankaa.com/file/人物@2x_1660808586178.png'
        />
        <Image
          className={classNames('spin-lading-icon')}
          src='https://test-qicdn.liankaa.com/file/加载中@2x_1660808594566.png'
        />
        <View className={classNames('spin-lading-container')}>
          <View className={classNames('spin-lading__tips')}>加载中</View>
          <View className={classNames('spin-lading__desc')}>精彩内容即将呈现</View>
        </View>
      </View>
    </View>
  )
}

export default AppPageLoading

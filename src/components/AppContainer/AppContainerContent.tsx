import { ScrollView, View } from "@tarojs/components"
import { PropsWithChildren } from "react"
import cx from 'classnames/bind'

import localStyle from './AppContainerContent.module.less'

const classNames = cx.bind(localStyle)

interface IAppContainerContentProps {
  style?: Record<string, any>
}

const AppContainerContent = (props: PropsWithChildren<IAppContainerContentProps>) => {
  return (
    <ScrollView style={props?.style ? props.style : ''} className={classNames('app-container-content')}>
      {props.children}
    </ScrollView>
  )
}

export default AppContainerContent

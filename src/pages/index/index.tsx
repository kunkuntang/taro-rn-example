import Taro from '@tarojs/taro'
import { Component, PropsWithChildren } from 'react'
import { View, Text, Button } from '@tarojs/components'
import AppHeader from '@/components/AppHeader'
import AppContainer from '@/components/AppContainer/AppContainer'
import AppContainerContent from '@/components/AppContainer/AppContainerContent'
import AppFooter from '@/components/AppFooter'

import './index.less'

export default class Index extends Component<PropsWithChildren> {

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <AppContainer fullscreen>
          <AppHeader title='控制台'></AppHeader>
          <AppContainerContent>
            <Text>Hello world!! ddddd333</Text>

            {
              [1,2,3,4,5,6,7,9,10, 8, 11, 12].map(item => {
                return <View className='title' key={item}>{item}</View>
              })
            }
          </AppContainerContent>
          <AppFooter height={100}>
            <Button
              type='primary'
              onClick={() => {
                Taro.showToast({
                  title: '提示'
                })
              }}
            >
              Save it!
            </Button>
          </AppFooter>
        </AppContainer>
      </View>
    )
  }
}

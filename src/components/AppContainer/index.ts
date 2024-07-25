import { PropsWithChildren } from 'react'
import AppContainer, { IAppContainerProps } from './AppContainer'
import AppContainerContent from './AppContainerContent'

type CompoundedComponent = React.ForwardRefExoticComponent<
  PropsWithChildren<Partial<IAppContainerProps>>
> & {
  Content: typeof AppContainerContent
}
const InnerAppContainer = AppContainer as CompoundedComponent
InnerAppContainer.Content = AppContainerContent

export default InnerAppContainer
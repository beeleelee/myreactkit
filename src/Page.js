import React from 'react'

import {
  pageStyle
} from './styles/page'

const func = () => {}

export default class Page extends React.Component {
  constructor(...args){
    super(...args)
    this.scrollEndTimeHandle = null 
    this.doScrollEnd = this.doScrollEnd.bind(this)
  }
  doScrollEnd(){
    let {
      onScrollEnd = func,
      reachEndThreshold = 50,
      onReachEnd = func,
      onReachTop = func,
    } = this.props
    let scrollTop = this.container.scrollTop 
    onScrollEnd(scrollTop)
    let { height: containerHeight } = this.container.getBoundingClientRect()
    let { height: contentHeight } = this.content.getBoundingClientRect()

    if(contentHeight - scrollTop - reachEndThreshold <= containerHeight) {
      onReachEnd()
    }
    if(scrollTop - reachEndThreshold <= 0) {
      onReachTop()
    }
  }
  render(){
    let {
      onScroll = func,
      onScrollEnd = func,
      onReachEnd = func,
      onReachTop = func,
      reachEndThreshold = 50,
      style,
      children,
      ...props
    } = this.props 
    return (
      <div 
        {...props}
        ref={node => this.container = node}
        onScroll={e => {
          if(this.scrollEndTimeHandle){
            clearTimeout(this.scrollEndTimeHandle)
            this.scrollEndTimeHandle = null 
          }
          this.scrollEndTimeHandle = setTimeout(this.doScrollEnd, 100)
        }}
        style={{...pageStyle, ...style}}>
        <div ref={node => this.content = nod}>{children}</div>
      </div>
    )
  }
}
import React from 'react'
import {
  currentTime,
  setStyle,
  Deceleration,
  Tween,
} from 'mytoolkit'
import loadingGIF from './images/loadingGIF'

import {
  scrollViewWrapperStyle,
  scrollContentStyle,
  refreshWrapStyle,
  scrollBarStyle,
} from './styles/pageRefresh'

const refreshHeight = 40 
const refreshTimeSpan = 1500
const reachEndTreshhold = 50 

export default class PageRefresh extends React.Component {
  constructor(...args){
    super(...args)
    let propsToBind = ['doTouchStart', 'doTouchMove', 'doTouchEnd', 'doDeceleration', 'doScrollEnd', 'doRefreshEnd']
    propsToBind.forEach(name => {
      this[name] = this[name].bind(this)
    })
    this.scrollTop = 0 
    this.shouldRefresh = false 
    this.refreshing = false 
  }
  doTouchStart(e){
    if(this.refreshing) return 

    if(this.decAni){
      this.decAni.stop()
      this.decAni = null 
    }
    if(this.tweenAni){
      this.tweenAni.pause()
      this.tweenAni = null 
    }
    let { pageY } = e.touches[0]
    this.startY = this.currentY = pageY 
    this.touchArray = [
      {
        time: currentTime(),
        y: pageY
      }
    ]
    setStyle(this.scrollBar, 'opacity', 1)
    this.calculateContentHeight()
    this.prevScrollTop = this.scrollTop 
  }
  doTouchMove(e){
    e.preventDefault()
    if(this.refreshing) return 

    let { pageY } = e.touches[0]
    let delta = pageY - this.currentY 
    let bMargin = this.containerHeight + this.scrollTop - this.contentHeight 
    let resistance = 1 
    if(this.scrollTop < 0){
      if(delta > 0){
        resistance = 1 / 3 
      }
      // check if need do refresh 
      if(this.scrollTop <= -70){
        this.shouldRefresh = true 
      }else{
        this.shouldRefresh = false 
      }
    }else if(bMargin > 0){
      if(delta < 0){
        resistance = 1 / 3 
      }
    }
    delta *= resistance 
    this.scrollTop -= delta 
    this.setScrollTop()
    this.touchArray.push({
      time: currentTime(),
      y: pageY
    })
    this.currentY = pageY 
  }
  doTouchEnd(e){
    if(this.refreshing) return 

    if(this.touchArray.length < 2){
      this.doScrollEnd()
      return
    }
    let bMargin = this.containerHeight + this.scrollTop - this.contentHeight
    // do deceleration 
    let l = this.touchArray.length 
    let lastTouch = this.touchArray[l - 1]
    let fromTouch = this.touchArray[l - 2]
    for(let i = 3; i < 5; i++){
      if(l - i < 0) break 

      fromTouch = this.touchArray[l - i]
    }
    let v = (lastTouch.y - fromTouch.y) / (lastTouch.time - fromTouch.time)
    // no deceleration when out of margin
    if(this.scrollTop < 0 || bMargin > 0){
      v = 0
    }
    if(v === 0){
      this.doScrollEnd()
      return 
    }
    this.decAni = new Deceleration({
      velocity: this.safeV(v),
      onStep: this.doDeceleration,
      onEnd: this.doScrollEnd 
    })
    this.decAni.start()
  }
  doRefreshEnd(){
    let startY = this.scrollTop
    let endY = 0 
    this.tweenAni = new Tween({
      duration: 150,
      onStep: (t, percent) => {
        this.scrollTop = startY + (endY - startY) * percent
        this.setScrollTop()
      },
      onEnd: e => {
        this.scrollTop = endY 
        this.setScrollTop()
        this.refreshing = false 
        this.shouldRefresh = false 
      }
    })
    this.tweenAni.start()
  }
  doScrollEnd(){
    let bMargin = this.containerHeight + this.scrollTop - this.contentHeight
    let startY, endY 
    if(this.scrollTop < 0 || bMargin > 0){
      if(this.scrollTop < 0){
        startY = this.scrollTop 
        endY = this.shouldRefresh ? -1 * refreshHeight : 0 
        this.refreshing = this.shouldRefresh ? true : false 
      }else if(bMargin > 0){
        startY = this.scrollTop
        endY = this.contentHeight - this.containerHeight
      }
      this.tweenAni = new Tween({
        duration: 300,
        onStep: (t, percent) => {
          this.scrollTop = startY + (endY - startY) * percent 
          this.setScrollTop()
        },
        onEnd: e => {
          this.scrollTop = endY
          this.setScrollTop()
          if(this.shouldRefresh){
            this.props.onRefresh && this.props.onRefresh()
            setTimeout(this.doRefreshEnd, refreshTimeSpan)
          }
        }
      })
      this.tweenAni.start()
    }
    this.prevScrollTop !== this.scrollTop && this.props.onScrollEnd && this.props.onScrollEnd()
    this.prevScrollTop !== this.scrollTop && bMargin + reachEndTreshhold > 0 && this.props.onReachEnd && this.props.onReachEnd()
    setStyle(this.scrollBar, 'opacity', 1)
  }
  doDeceleration(movement){
    this.scrollTop -= movement
    this.setScrollTop()
    let bMargin = this.containerHeight + this.scrollTop - this.contentHeight

    if(this.scrollTop < 0 || bMargin > 0){
      let r = 0.003, expand = 0 
      if(movement > 0){
        expand = Math.abs(this.scrollTop)
      }else{
        expand = Math.abs(bMargin)
      }
      r += 1 / (100 - expand)
      this.decAni.setOptions({
        resistance: r
      })
    }
  }
  safeV(v){
    if(Math.abs(v) < 3){
      return v 
    }
    if(v > 0){
      return 2.9
    }
    return -2.9 
  }
  setScrollTop(){
    let t = `translate3d(0, ${-1 * this.scrollTop}px, 0)`
    setStyle(this.scrollContent, 'transform', t)

    let scrollBarTop = (this.scrollTop / this.contentHeight) * this.containerHeight 
    setStyle(this.scrollBar, 'top', `${scrollBarTop}px`)
  }
  getContainerHeight(){
    let { height } = this.container.getBoundingClientRect()
    return height 
  }
  getContentHeight(){
    let { height } = this.scrollContent.getBoundingClientRect()
    return height 
  }
  calculateContentHeight(){
    this.containerHeight = this.getContainerHeight()
    this.contentHeight = this.getContentHeight()
    if(this.contentHeight < this.containerHeight){
      this.contentHeight = this.containerHeight
    }
    if(this.contentHeight > this.containerHeight){
      let scrollBarHeight = this.containerHeight * (this.containerHeight / this.contentHeight)
      setStyle(this.scrollBar, 'height', `${scrollBarHeight}px`)
    }else{
      setStyle(this.scrollBar, 'height', 0)
    }
  }
  componentDidMount(){
    this.container.addEventListener('touchmove', this.doTouchMove, {
      capture: false,
      passive: false,
      once: false 
    })
  }
  componentDidUpdate(){
    this.calculateContentHeight()
  }
  componentWillUnmount(){
    this.container.removeEventListener('touchmove', this.doTouchMove)
  }
  render(){
    return (
      <div 
        onTouchStart={this.doTouchStart}
        onTouchEnd={this.doTouchEnd}
        onTouchCancel={this.doTouchEnd}
        style={{...scrollViewWrapperStyle, ...this.props.style}}
        ref={node => this.container = node}
        className="scroll-view-wrapper">
        <div 
          style={{...scrollContentStyle}}
          ref={node => this.scrollContent = node}
          className="scroll-content">
          <div style={{...refreshWrapStyle}} ><img src={loadingGIF} style={{width: 20}}/></div>
          {this.props.children}
        </div>
        <div 
          ref={node => this.scrollBar = node}
          style={{...scrollBarStyle}} 
          className="scroll-bar"/>
      </div>
    )
  }
}
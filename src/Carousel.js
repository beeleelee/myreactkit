import React from 'react'
import {
  Tween,
  currentTime,
  setStyle,
} from 'mytoolkit'
import {
  slideItemStyle,
  slidesStyle,
  slideContainerStyle,
  dotWrapStyle,
  dotStyle,
} from './styles/carousel'

const autoplayInterval = 3000 
const tweenDuration = 300 

export default class Carousel extends React.Component {
  constructor(props){
    super(props)
    ['setDimension', 'doTouchEnd', 'doTouchMove', 'doTouchStart', 'setOffsetX', 'nextSlide', 'prevSlide'].forEach(name => {
      this[name] = this[name].bind(this)
    })
    this.autoplayTimeHandle = null 
    this.offsetX = 0 
    this.isTransition = false 
    this.autoplaying = false 
    this.slideWidth = 0
    this.slideHeight = 0 
    this.state = {
      curIndex: props.defaultIndex || 0,
      isScroll: false 
    }
  }
  setOffsetX(offsetX){
    this.offsetX = offsetX
    setStyle(this.slides, 'transform', `translate3d(${offsetX}px, 0, 0)`)
  }
  tweenSlide(duration, startX, endX, nextIndex){
    this.tween = new Tween({
      duration,
      onStep: (t, percent) => {
        let offsetX = startX + (endX - startX) * percent 
        this.setOffsetX(offsetX)
      },
      onEnd: e => {
        this.setOffsetX(0)
        this.setState({
          curIndex: nextIndex,
          isScroll: false,
        }, () => {
          this.isTransition = false
          this.tween = null 
          this.autoplaying = false 
          let { afterChange } = this.props 
          this.prevIndex !== nextIndex && afterChange && afterChange(nextIndex)
        })
      }
    }).start()
  }
  prevSlide(){
    this.props.autoplay && this.autoplay()
    let childList = React.Children.toArray(this.props.children)
    if(childList.length < 2) return 

    this.autoplaying = true 
    this.beforeScroll(() => {
      this.isTransition = true 
      this.tweenSlide(tweenDuration, -1 * this.slideWidth, 0, this.firstIndex)
    })
  }
  nextSlide(){
    this.props.autoplay && this.autoplay()
    let childList = React.Children.toArray(this.props.children)
    if(childList.length < 2) return 

    this.autoplaying = true 
    this.beforeScroll(() => {
      this.isTransition = true 
      this.tweenSlide(tweenDuration, -1 * this.slideWidth, -2 * this.slideWidth, this.lastIndex)
    })
  }
  autoplay(){
    this.autoplayTimeHandle = setTimeout(this.nextSlide, this.props.autoplayInterval || autoplayInterval)
  }
  beforeScroll(func){
    this.prevIndex = this.state.curIndex 
    this.setState({
      isScroll: true
    }, () => {
      this.setOffsetX((this.shouldRenderFirst ? -1 : 0) * this.slideWidth)
      func && func()
    })
  }
  afterScroll(){
    let startX = this.offsetX, endX 

    if(this.distanceX < 60){
      endX = (this.shouldRenderFirst ? -1 : 0) * this.slideWidth 
      this.nextIndex = this.state.curIndex
    }else if(this.currentX - this.startX < 0){
      endX = (this.shouldRenderLast && this.shouldRenderFirst ? -2 : -1) * this.slideWidth
      this.nextIndex = this.shouldRenderLast ? this.lastIndex : this.state.curIndex
    }else{
      endX = 0
      this.nextIndex = this.shouldRenderFirst ? this.firstIndex : this.state.curIndex
    }
    // check if is tap
    if(this.timegap < 501 && this.distanceX < 20 && this.distanceY < 20){
      this.setState({
        curIndex: this.nextIndex,
        isScroll: false,
      }, ()=> {
        this.isTransition = false 
        this.setOffsetX(0)
      })
    }else{
      this.tweenSlide(tweenDuration, startX, endX, this.nextIndex)
    }
  }
  doTouchStart(e){
    let childList = React.Children.toArray(this.props.children)
    if(childList.length < 2) return 
    if(this.isTransition) return 

    e.stopPropagation()
    if(this.autoplayTimeHandle){
      clearTimeout(this.autoplayTimeHandle)
      this.autoplayTimeHandle = null 
    }
    this.beforeScroll()
    let { pageX, pageY } = e.touches[0]
    this.startX = this.currentX = pageX 
    this.startY = this.currentY = pageY
    this.startTime = currentTime()
  }
  doTouchMove(e){
    let childList = React.Children.toArray(this.props.children)
    if(childList.length < 2) return 
    if(this.isTransition) return 

    e.stopPropagation()
    e.preventDefault()
    let { pageX, pageY } = e.touches[0]
    let moveX = pageX - this.currentX 

    if(this.offsetX + moveX > 0 || this.slideContentWidth + this.offsetX + moveX < this.slideWidth){
      moveX *= 0.33
    }

    this.setOffsetX(this.offsetX + moveX)
    this.currentX = pageX
    this.currentY = pageY 
  }
  doTouchEnd(){
    let childList = React.Children.toArray(this.props.children)
    if(childList.length < 2) return 
    if(this.isTransition) return 

    e.stopPropagation()
    this.timegap = currentTime() - this.startTime 
    this.distanceX = Math.abs(this.currentX - this.startX)
    this.distanceY = Math.abs(this.currentY - this.startY)
    this.isTransition = true 
    this.afterScroll()
    this.props.autoplay && this.autoplay()
  }
  setDimension(){
    let { height } = this.slides.getBoundingClientRect()
    let { width } = this.slideContainer.getBoundingClientRect()

    this.slideWidth = width 
    this.slideHeight = height 
  }
  componentDidMount(){
    this.props.autoplay && this.autoplay()
    setTimeout(this.setDimension, 0)
    let options = {
      capture: true,
      passive: false,
      once: false 
    }
    this.slideContainer.addEventListener('touchstart', this.doTouchStart, options)
    this.slideContainer.addEventListener('touchmove', this.doTouchMove, options)
    this.slideContainer.addEventListener('touchend', this.doTouchEnd, options)
    this.slideContainer.addEventListener('touchcancel', this.doTouchEnd, options)
  }
  componentWillUnmount(){
    if(this.autoplayTimeHandle){
      clearTimeout(this.autoplayTimeHandle)
    }
    this.slideContainer.removeEventListener('touchstart', this.doTouchStart)
    this.slideContainer.removeEventListener('touchmove', this.doTouchMove)
    this.slideContainer.removeEventListener('touchend', this.doTouchEnd)
    this.slideContainer.removeEventListener('touchcancel', this.doTouchEnd)
  }
  preLoadImage(list){
    return <div style={{display: 'none'}}>{list}</div>
  }
  renderSlide(item){
    if(this.slideWidth){
      slideItemStyle.width = this.slideWidth
    }
    return (
      <div style={{...slideItemStyle}} className="slide-item">{item}</div>
    )
  }
  renderSlides(){
    let infinite = this.props.infinite 
    let list = React.Children.toArray(this.props.children)
    let { isScroll, curIndex } = this.state 
    let firstIndex = curIndex - 1 
    let lastIndex = curIndex + 1 
    this.shouldRenderFirst = !this.autoplaying && infinite === false && firstIndex < 0 ? false : true 
    this.shouldRenderLast = !this.autoplaying && infinite === false && list.length - lastIndex <= 0 ? false : true 
    this.firstIndex = firstIndex < 0 ? list.length - 1 : firstIndex 
    this.lastIndex = list.length - lastIndex > 0 ? lastIndex : 0 
    if(!this.shouldRenderFirst || !this.shouldRenderLast){
      this.slideContentWidth = 2 * this.slideWidth
    }else{
      this.slideContentWidth = 3 * this.slideWidth 
    }
    return (
      <div 
        ref={node => this.slides = node}
        className="slides"
        style={{...slidesStyle}}>
        {this.preLoadImage(list)}
        {
          isScroll && this.shouldRenderFirst ?
          this.renderSlide(list[this.firstIndex])
          : null
        }
        {this.renderSlide(list[curIndex])}
        {
          isScroll && this.shouldRenderLast ? 
          this.renderSlide(list[this.lastIndex])
          : null 
        }
      </div>
    )
  }
  renderDots(){
    if(this.props.dots === false) return null 

    let list = React.Children.toArray(this.props.children)
    return (
      <div>
        {
          list.length > 1 && list.map((item, key) => (
            <div 
              style={{
                ...dotStyle,
                backgroundColor: `${key === this.state.curIndex ? '#666666' : '#d8d8d8'}`
              }}
              key={key}/>
          ))
        }
      </div>
    )
  }
  render(){
    if(this.props.style && this.props.style.height){
      slideContainerStyle.height = this.props.style.height 
    }
    return (
      <div 
        ref={node => this.slideContainer = node}
        className="slide-container"
        style={{...slideContainerStyle}}>
        {this.renderSlides()}
        {this.renderDotes()}
      </div>
    )
  }
}
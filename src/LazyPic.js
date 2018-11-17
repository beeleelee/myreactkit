import React from 'react'
import loadingGIF from './images/loadingGIF'
import {
  IDFactory,
} from 'mytoolkit'
import {
  lazyStyle
} from './styles/lazy'

let unShowList = []
let genID = IDFactory(1)

export class LazyPic extends React.Component {
  state = {
    shouldLoad: false 
  }
  constructor(...args){
    super(...args)
    this.checkShouldLoad = this.checkShouldLoad.bind(this)
  }
  checkShouldLoad(){
    let { top, left, width, height } = this.element.getBoundingClientRect()
    let screenWidth = screen.availWidth 
    let screenHeight = screen.availHeight 

    if(top + height < 0 || top > screenHeight || left + width < 0 || left > screenWidth){
      unShowList.push({
        component: this,
        id: this.id 
      })
      return false 
    }
    this.setState({
      shouldLoad: true 
    })
    return true 
  }
  componentWillUnmount(){
    let id = this.id 
    unShowList = unShowList.filter(item => item.id !== id)
  }
  componentDidMount(){
    this.id = genID()
    setTimeout(this.checkShouldLoad, 0)
  }
  render(){
    let ImgLoading = this.props.loadingurl || loadingGIF 
    if(this.state.shouldLoad){
      if(this.props.type === 'bg'){
        return <div {...this.props} />
      }
      return <img {...this.props} />
    }

    return (
      <div 
        ref={node => this.element = node}
        {...this.props}
        style={{
          ...lazyStyle,
          backgroundImage: `url(${ImgLoading})`
        }}/>
    )
  }
}

export function checkLazy() {
  let newList = unShowList.map(item => {
    if(item.component.checkShouldLoad()){
      return null 
    }
    return item 
  })
  unShowList = newList.filter(item => item !== null)
}
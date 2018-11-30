import React from 'react'
import loadingGIF from './images/loadingGIF'
import {
  IDFactory,
} from 'mytoolkit'
import './styles/lazy.css'

let unShowList = []
let genID = IDFactory(1)

export class LazyPic extends React.Component {
  state = {
    shouldLoad: false 
  }
  checkShouldLoad(saveToList){
    let { top, left, width, height } = this.element.getBoundingClientRect()
    let screenWidth = screen.availWidth 
    let screenHeight = screen.availHeight 

    if(top + height < 0 || top > screenHeight || left + width < 0 || left > screenWidth){
      saveToList && unShowList.push({
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
    setTimeout(()=>{
      this.checkShouldLoad(true)
    }, 0)
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
        className="mrk-lazy-pic"
        ref={node => this.element = node}
        {...this.props}
        style={{
          backgroundImage: `url(${ImgLoading})`
        }}/>
    )
  }
}

LazyPic.checkLazy = () => {
  let newList = unShowList.map(item => {
    if(item.component.checkShouldLoad()){
      return null 
    }
    return item 
  })
  unShowList = newList.filter(item => item !== null)
}

export default LazyPic
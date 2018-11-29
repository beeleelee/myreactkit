import React from 'react'
import ReactDOM from 'react-dom'
import {
  randStr,
  typeOf,
} from 'mytoolkit'
import {
  toastWrapStyle,
  toastStyle,
} from './styles/toast'

const fadeOutTime = 200000
let container = null 
let containerID = null 

export class ToastMessage extends React.Component {
  constructor(options){
    super(options)
    this.timeHandle = null 
    this.remove = this.remove.bind(this)
  }
  remove(){
    ReactDOM.unmountComponentAtNode(container)
  }
  componentWillUnmount(){
    clearContainer()
  }
  componentDidMount(){
    this.timeHandle = setTimeout(this.remove, fadeOutTime)
  }
  componentDidUpdate(){
    if(this.timeHandle){
      clearTimeout(this.timeHandle)
    }
    this.timeHandle = setTimeout(this.remove, fadeOutTime)
  }

  render(){
    return (
      <div style={{...toastWrapStyle}}>
        <div style={{...toastStyle}}>{this.props.message || ''}</div>
      </div>
    )
  }
}

export const toast = (message) => {
  if(typeOf(containerID) === 'Null'){
    containerID = `toast_${randStr(6)}`
    container = createContainer(containerID)
  }
  ReactDOM.render(<ToastMessage message={message} />, container)
}

function createContainer(id) {
  document.body.insertAdjacentHTML('beforeend', `<div id=${id} />`)

  return document.getElementById(id)
}

function clearContainer() {
  if(container){
    document.body.removeChild(container)
    container = null 
    containerID = null
  }
}

export default toast 
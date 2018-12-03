import React from 'react'
import ReactDOM from 'react-dom'
import {
  randStr,
  Tween,
  noop,
  delay,
  typeOf,
  setStyle,
} from 'mytoolkit'
import './styles/alert.css'

class Alert extends React.Component {
  state = {

  }
  constructor(props) {
    super(props)
    this.container = props.container
    this.doCancel = this.doCancel.bind(this)
    this.doConfirm = this.doConfirm.bind(this)
    this.remove = this.remove.bind(this)
    this.fade = this.fade.bind(this)
    this.inTween = false 
  }
  componentWillUnmount() {
    let container = this.container
    delay(clearContainer, 0, container)
  }
  componentDidMount() {
    delay(this.fade, 0, 'in')
  }
  doCancel() {
    if(this.inTween) return  

    let {
      onCancel,
      cancelable,
    } = this.props 

    if(!cancelable) return  

    typeOf(onCancel) === 'Function' && onCancel()

    this.fade('out')
  }
  doConfirm() {
    if(this.inTween) return  

    let {
      onConfirm,
    } = this.props 

    typeOf(onConfirm) === 'Function' && onConfirm()

    this.fade('out')
  }
  remove(container) {
    ReactDOM.unmountComponentAtNode(container)
  }
  fade(type){
    this.inTween = true 
    let start = type === 'in' ? 0 : 1 
    let end = type === 'in' ? 1 : 0

    new Tween({
      duration: 300,
      ease: 'easeInOutCubic',
      onStep: (t, percent) => {
        let inter = (end - start) * percent + start 
        setStyle(this.mask, 'opacity', inter)
        setStyle(this.modal, 'transform', `translate3d(-50%, -50%, 0) scale(${inter})`)
      },
      onEnd: () => {
        setStyle(this.mask, 'opacity', end)
        setStyle(this.modal, 'transform', `translate3d(-50%, -50%, 0) scale(${end})`)
        this.inTween = false 
        if(type === 'out'){
          delay(this.remove, 0, this.container)
        }
      }
    }).start()
  }
  render() {
    let {
      title,
      content,
      cancelable,
      cancelText,
      confirmText
    } = this.props

    return (
      <div>
        <div
          onClick={this.doCancel}
          ref={node => this.mask = node} className="mrk-confirm-mask" />
        <div
          onClick={e => {
            e.stopPropagation()
          }}
          ref={node => this.modal = node}
          className="mrk-confirm-modal" >
          {title ? <div className="mrk-confirm-title">{title}</div> : null}
          {content ? <div className="mrk-confirm-content" dangerouslySetInnerHTML={{ __html: content }} /> : null}
          <div className="mrk-hr"></div>
          <div className="mrk-flex-row">
            {cancelable ? <div onClick={this.doCancel} className="mrk-btn mrk-confirm-cancel">{cancelText}</div> : null}
            {cancelable ? <div className="mrk-vr"></div> : null}
            <div onClick={this.doConfirm} className="mrk-btn mrk-confirm-confirm">{confirmText}</div>
          </div>
        </div>
      </div>
    )
  }
}
const defaultOptions = {
  title: 'default',
  content: '...',
  cancelable: true,
  onCancel: noop,
  onConfirm: noop,
  cancelText: '取消',
  confirmText: '确定',
}
function alert(options = {}) {
  let mergedOptions = { ...defaultOptions, ...options }
  let container = createContainer(randStr(6))
  ReactDOM.render(<Alert {...mergedOptions} container={container} />, container)
}

function createContainer(id) {
  document.body.insertAdjacentHTML('beforeend', `<div id=${id} />`)

  return document.getElementById(id)
}

function clearContainer(container) {
  document.body.removeChild(container)
  container = null
}

export default alert
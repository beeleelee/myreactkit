import React from 'react'
import ReactDOM from 'react-dom'
import {
  randStr,
  Tween,
  noop,
  delay,
} from 'mytoolkit'
import './styles/alert.css'

class Alert extends React.Component {
  state = {

  }
  constructor(props) {
    super(props)
    this.container = props.container
    console.log(this.container)

  }
  componentWillUnmount() {
    let container = this.container
    delay(clearContainer, 0, container)
  }
  componentDidMount() {

  }
  doCancel() {

  }
  doConfirm() {

  }
  remove() {

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
            <div onClick={this.onConfirm} className="mrk-btn mrk-confirm-confirm">{confirmText}</div>
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
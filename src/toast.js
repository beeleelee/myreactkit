import React from 'react'
import ReactDOM from 'react-dom'
import {
  randStr,
  typeOf,
  delay,
} from 'mytoolkit'
import './styles/toast.css'

const fadeOutTime = 2000
let container = null
let containerID = null
let messageList = []

class ToastMessage extends React.Component {
  state = {
    show: false
  }
  constructor(options) {
    super(options)
    this.fadeOut = this.fadeOut.bind(this)
    this.remove = this.remove.bind(this)
  }
  remove() {
    if (this.state.show) return

    messageList = messageList.filter(item => item.key !== this.id)
    if (messageList.length > 0) {
      renderToastList()
    } else {
      removeToastList()
    }
  }
  fadeOut() {
    this.setState({
      show: false
    })
  }
  componentDidMount() {
    this.id = this.props.id
    setTimeout(() => {
      this.setState({
        show: true
      })
      setTimeout(this.fadeOut, fadeOutTime)
    }, 0)
  }
  render() {
    return (
      <div
        onTransitionEnd={this.remove}
        className={`mrk-toast-message ${this.state.show ? 'show' : ''}`}>
        {this.props.message || ''}
      </div>
    )
  }
}

class ToastList extends React.Component {
  componentWillUnmount() {
    delay(clearContainer, 0)
  }
  render() {
    let {
      messageList = []
    } = this.props
    return (
      <div className="mrk-toast-wrap">
        {
          messageList.map((item) => {
            return <ToastMessage key={item.key} message={item.message} id={item.key} />

          })
        }
      </div>
    )
  }
}

export const toast = (message) => {
  if (typeOf(containerID) === 'Null') {
    containerID = `toast_${randStr(6)}`
    container = createContainer(containerID)
  }
  messageList.push({
    key: randStr(6),
    message
  })
  renderToastList()
}

function renderToastList() {
  ReactDOM.render(<ToastList messageList={messageList} />, container)
}

function createContainer(id) {
  document.body.insertAdjacentHTML('beforeend', `<div id=${id} />`)

  return document.getElementById(id)
}

function removeToastList() {
  container && ReactDOM.unmountComponentAtNode(container)
}

function clearContainer() {
  if (container) {
    document.body.removeChild(container)
    container = null
    containerID = null
  }
}

export default toast 
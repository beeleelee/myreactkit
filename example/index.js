import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import PCarousel from './carousel'
import PPageRefresh from './pageRefresh'
import {
  toast,
  alert,
} from '../dist/myreactkit.esm'

let count = 1

const App = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/carousel">carousel</Link>
        </li>
        <li>
          <Link to="/pagerefresh">pageRefresh</Link>
        </li>
      </ul>

      <hr />
      <button onClick={() => {
        toast(`hello! ${count++}`)
      }}>toast hello</button>
      <hr />
      <button onClick={() => {
        alert({
          title: 'warning', 
          content: 'react fans',
          onCancel: () => {
            console.log('call cancel')
          },
          onConfirm: () => {
            console.log('call confirm')
          },
          cancelable: true,
          cancelText: 'cancel',
          confirmText: 'ok'
        })
      }}>alert</button>
      <Route path="/carousel" component={PCarousel} />
      <Route path="/pagerefresh" component={PPageRefresh} />
    </div>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('root'))

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}
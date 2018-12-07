import React from 'react'
import ReactDOM from 'react-dom'
// import {
//   HashRouter as Router,
//   Route,
//   Link
// } from 'react-router-dom'
import PCarousel from './carousel'
import PPageRefresh from './pageRefresh'
import {
  toast,
  alert,
  Router,
  Route,
} from '../dist/myreactkit.esm'
import {
  createHashHistory,
} from 'history'

const history = createHashHistory({
  getUserConfirmation: (message, callback) => {
    alert({
      content: message,
      onCancel: () => callback(false),
      onConfirm: () => callback(true)
    })
  }
})
window.h = history
// let count = 1

// const App = () => (
//   <Router>
//     <div>
//       <ul>
//         <li>
//           <Link to="/carousel">carousel</Link>
//         </li>
//         <li>
//           <Link to="/pagerefresh">pageRefresh</Link>
//         </li>
//       </ul>

//       <hr />
//       <button onClick={() => {
//         toast(`hello! ${count++}`)
//       }}>toast hello</button>
//       <hr />
//       <button onClick={() => {
//         alert({
//           title: 'warning', 
//           content: 'react fans',
//           onCancel: () => {
//             console.log('call cancel')
//           },
//           onConfirm: () => {
//             console.log('call confirm')
//           },
//           cancelable: true,
//           cancelText: 'cancel',
//           confirmText: 'ok'
//         })
//       }}>alert</button>
//       <Route path="/carousel" component={PCarousel} />
//       <Route path="/pagerefresh" component={PPageRefresh} />
//     </div>
//   </Router>
// )

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Route path="/" />
      </Router>
      // <div>
      //   123456
      //   <p>
      //     <button onClick={() => {
      //       history.push('/a')
      //     }}>a</button>
      //   </p>
      //   <p>
      //     <button onClick={() => {
      //       history.push({
      //         pathname: '/b'
      //       })
      //     }}>b</button>
      //   </p>
      //   <p>
      //     <button onClick={() => {
      //       history.push('/c')
      //       const unblock = history.block('Are you sure you want to leave this page?')
      //       // Register a simple prompt message that will be shown the
      //       // user before they navigate away from the current page.

      //       // Or use a function that returns the message when it's needed.
      //       // const unblock = history.block((location, action) => {
      //       //   // The location and action arguments indicate the location
      //       //   // we're transitioning to and how we're getting there.

      //       //   // A common use case is to prevent the user from leaving the
      //       //   // page if there's a form they haven't submitted yet.
      //       //   if (input.value !== '') return 'Are you sure you want to leave this page?'
      //       // })

      //       // // To stop blocking transitions, call the function returned from block().
      //       // unblock()
      //     }}>
      //       c
      //     </button>
      //   </p>
      // </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}
import React from 'react'
import PropTypes from 'prop-types'
import toast from './toast'
import {
  typeOf,
} from 'mytoolkit'

export class Router extends React.Component {
  constructor(props) {
    super(props)
    let routes = React.Children.map(props.children, c => {
      if (c.type === Route)
        return c

    })
    console.log(routes)
    this.routes = routes
    this.state = {
      stack: []
    }

    this.onHistoryChange = this.onHistoryChange.bind(this)
  }
  onHistoryChange(location, action) {
    let { pathname } = location
    let curRoute = this.routes.find(r => r.props.path === pathname)
    console.log('current route', curRoute)
    if (curRoute) {

      this.setState({
        stack: [
          ...this.state.stack,
          {
            ...curRoute.props
          }
        ]
      })
    }
  }
  componentDidMount() {
    let {
      history
    } = this.props
    this.unlisten = history.listen((location, action) => {
      console.log(action, location)
      let { pathname } = location
      toast(`${action} ${pathname}`)
      this.onHistoryChange(location, action)
    })
    this.onHistoryChange(history.location, 'PUSH')
  }
  componentWillUnmount() {
    this.unlisten()
  }
  render() {
    let { stack } = this.state
    return (
      <div>
        {stack.map((item, key) => {
          let Component = item.component
          console.log(Component, item)
          return <Component key={key} />
        })}
      </div>
    )
  }
}

// Router.propTypes = {
//   history: PropTypes.object.isRequired,
// }

export class Route extends React.Component {
  componentDidMount() {
    console.log(this.props)
  }
  render() {
    let { component } = this.props
    let T = component
    return (
      <T />
    )
  }
}

// Route.propTypes = {
//   path: PropTypes.string.isRequired,
// }
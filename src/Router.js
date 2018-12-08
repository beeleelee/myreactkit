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
    this.state = {
      routes,
      stack: []
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
    })
    console.log(history.location)
    let { pathname } = history.location
    this.setState({
      stack: [
        this.state.stack,
        pathname
      ]
    })
  }
  componentWillUnmount() {
    this.unlisten()
  }
  render() {

    return (
      <div>
        {this.state.stack}
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
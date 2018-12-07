import React from 'react'
import PropTypes from 'prop-types'

export class Router extends React.Component {
  componentDidMount() {
    let {
      history
    } = this.props
    this.unlisten = history.listen((location, action) => {
      console.log(action, location)
    })
  }
  componentWillUnmount() {
    this.unlisten()
  }
  render() {
    return (
      <div>
        {this.props.children}
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
    return (
      <p>a route</p>
    )
  }
}

// Route.propTypes = {
//   path: PropTypes.string.isRequired,
// }
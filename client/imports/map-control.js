import { default as React, Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
const MAP = `__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`;
// Enables custom elements within <GoogleMap>
// Children shouldn't change height between renders
const MapControl = React.createClass({
  contextTypes: {
    [MAP]: PropTypes.object,
  },
  componentDidMount() { this._render() },
  componentDidUpdate() { this._render() },
  componentWillUnmount() {
    const {mapHolderRef, controlPosition} = this.props
    const index = mapHolderRef.getMap().controls[controlPosition].getArray().indexOf(this.el)
    mapHolderRef.getMap().controls[controlPosition].removeAt(index)
  },
  _render() {
    const { controlPosition, children} = this.props;
    const mapHolderRef = this.context[MAP];
    ReactDOM.render(
      <div
        ref={el => {
          const { controls = [] } = mapHolderRef;
          const controlSet = controls[2];
          if (!this.renderedOnce) {
            this.el = el
            controlSet.push(el)
          } else if (el && this.el && el !== this.el) {
            this.el.innerHTML = '';
            [].slice.call(el.childNodes).forEach(child => this.el.appendChild(child))
          }
          this.renderedOnce = true
        }}
      >
        {children}
      </div>,
      document.createElement('div')
    )
  },
  render() {
    return <noscript />
  },
})

export default MapControl
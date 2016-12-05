import { default as React, Component } from "react";

export default class AtmForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: props.marker.status};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({value: newProps.marker.status})
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.state.value, this.props.marker._id);
  }

  handleRemove() {
    this.props.onRemoveMarker(this.props.marker);
  }

  render() {
    const { marker = {}, onRemoveMarker, isMobile } = this.props;
    let updatedAtString = '';
    if (marker.updatedAt instanceof Date) {
      const now = (new Date()).getTime();
      const mins = (now - marker.updatedAt.getTime())/(1000*60);
      updatedAtString = 'Updated ' +  Math.round(mins)+' mins ago';
      if (mins >= 60) {
        const hrs = mins/60;
        updatedAtString = 'Updated ' + (hrs === 1 ? 'an hour ago' : Math.round(hrs) + ' hours ago');
        if(hrs > 24) {
          const days = Math.floor(hrs/24);
          const hrsAndDay = Math.floor(hrs%24);;
          updatedAtString = 'Updated ' + (days === 1 ? '1 day ' : days + ' days ') + hrsAndDay + ' hrs ago';
        }
      }
    }
 //   const removeButton = isMobile ? <div/> : (<button style={{ marginTop: 1, marginLeft: 30, height: 30 }} type="button" onClick={this.handleRemove}>Remove</button>);
    return (
      <form onSubmit={this.handleSubmit}>
        <select style={{ margin: 1, height: 30 }} value={this.state.value} onChange={this.handleChange}>
          <option value="NO_CASH">No cash</option>
          <option value="CASH_AVAILABLE_SHORT_QUEUE">Cash available short Q</option>
          <option value="CASH_AVAILABLE_LONG_QUEUE">Cash available long Q</option>
        </select>
        <div style={{ margin: 1 }}>
          <div style={{ margin: 1 }}>
              {marker.name}
          </div>
          <div style={{ margin: 1 }}>
              <b>{updatedAtString}</b>
          </div>
        </div>
        <input style={{ marginTop: 1, height: 30 }} type="submit" value="Update" />
     
      </form>
    );
  }
}
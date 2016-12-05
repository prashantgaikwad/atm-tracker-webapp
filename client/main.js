import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import Base from './imports/base.js';
 
Meteor.startup(() => {
  render(<Base />, document.getElementById('render-target'));
});
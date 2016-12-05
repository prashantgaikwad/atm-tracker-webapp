import { createContainer } from 'meteor/react-meteor-data';
import App from './app';
import { compose } from 'react-komposer';


function postDataLoader(props, onData) {
  const { center, bounds, password, cashOnly } = props;
  Meteor.call('Atms.get', center, bounds, password, cashOnly, (error, result) => {
    if (!error) {
      onData(null, { atms: result });
    }else {
      onData(error);
    }
  });
}
export default compose(postDataLoader)(App);
import { Atms } from '../lib/collections';
import { HTTP } from 'meteor/http'
import Logger from './logger';
import AtmService from './service';

function getCall(location, pagetoken, callback) {
  try {
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+`${location.lat},${location.lng}`
    +'&radius=1000&type=atm&key=AIzaSyBFt6UaBxOQ7Jhdp7MHZrGQ0t2PSq3yXxQ';
    if(pagetoken) {
      url = url + '&pagetoken=' + pagetoken;
    }
    //console.log(url);
    const resp = HTTP.call('GET', url, (error, result) => {
      if (error) {
        Logger.error('Error in fetcing data from places api');
        Logger.error(error);
      }
      callback(result);
    });
  } catch (e) {
    Logger.error(e);
  }
};

function insertData(data = {}) {
  try{
    const atms = data.results || [];
    atms.forEach((atm) => {
      const existingAtm = Atms.findOne({ _id: atm.place_id });
      if (!existingAtm) {
        Atms.insert({ position: atm.geometry.location, name: atm.name, _id: atm.place_id, updatedAt: new Date() });
      } else {
        //console.log('Atm aleady exist -', atm.place_id)
      }
    });
  } catch(e) {
    Logger.error(e);
  }
}

function fetch(center, token) {
   getCall(center, token, (result) => {
      const atms = result.data;
      insertData(atms);
      //console.log('atms -- ######### ', atms);
      if(atms && atms.next_page_token) {
        Meteor.setTimeout(() => {
          fetch(center, atms.next_page_token);
        }, 3500);
      }
   });
}

Meteor.methods({
  'Places.fetch'(center = {}) {
    Logger.info('center: '+ center.lat);
    try{
      fetch(center)
    } catch(e) {
      Logger.error(e);
    }
  },

  'Atms.get'(center, bounds, password, cashOnly) {
    const atmService = new AtmService();
    return atmService.getAtms(bounds, password, cashOnly);
  },

  'Atm.update'(id, status) {
    const atmService = new AtmService();
    atmService.updateAtm(id, status);
  },

  'Atm.remove'(id) {
    const atmService = new AtmService();
    atmService.removeAtm(id);
  },
});
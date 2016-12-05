import Logger from './logger';
import { Atms } from '../lib/collections';
export default class AtmService {

  getAtms(bounds, password, cashOnly, isMobile){
    const { min, max } = bounds;
    const latOffset = (max.lat -min.lat)/20;
    const lngOffset = (max.lng -min.lng)/20;
    let limit = password === '#ALL' ? 1000 : 150; 
    if (isMobile) {
      limit = 50;
    }
    try {
      const query = { 'position.lat': { $lt: max.lat - latOffset, $gt: min.lat + latOffset },
          'position.lng': { $lt: max.lng - lngOffset, $gt: min.lng + lngOffset } };
      if(cashOnly) {
        query.$or= [ {'status': 'CASH_AVAILABLE_SHORT_QUEUE'}, { 'status': 'CASH_AVAILABLE_LONG_QUEUE' } ];
      }
      return Atms.find(query, { limit }).fetch();
    } catch(e) {
       Logger.error(e);
       return [];
    }
  }

  updateAtm(id, status) {
    try{
       Atms.update({ _id: id }, { $set: { status, updatedAt: new Date() }});
    } catch(e) {
      Logger.error('Error while updating atm '+ id);
      Logger.error(e);
    }
  }

  removeAtm() {
    try{
       Atms.remove({ _id: id });
    } catch(e) {
      Logger.error('Error while removing atm '+ id);
      Logger.error(e);
    }
  }

}
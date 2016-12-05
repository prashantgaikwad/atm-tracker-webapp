import { Meteor } from 'meteor/meteor';
import { Atms } from '../lib/collections';
import Logger from './logger';
import { Restivus } from 'meteor/nimble:restivus';
import AtmService from './service';

Meteor.startup(() => {
  Logger.info('Server started');

  Meteor.publish('atms', function pub() {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Access denied.');
    }
    return Atms.find();
  });
  Atms.allow({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

  const Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true,
  });

  Api.addRoute('atms', {authRequired: false}, {
    post: {
      action: function () {
        const { bounds, password, cashOnly, isMobile } = this.bodyParams;
        if(!bounds) {
          return {
            statusCode: 400,
            body: {status: "fail", message: "bounds cannot be null"}
          };
        }
        const atmService = new AtmService();
        const atms = atmService.getAtms(bounds, password, cashOnly, isMobile);
        if (atms) {
          return {status: "success", data: atms};
        }
        return {
          statusCode: 400,
          body: {status: "fail", message: "Unable to get atms"}
        };
      }
    }
  });

  Api.addRoute('atm/update', {authRequired: false}, {
      get: {
        action: function () {
          const { id, status } = this.queryParams;
          if(!id || !status) {
            return {
              statusCode: 400,
              body: {status: "fail", message: "Id cannot be null"}
            };
          }
          const atmService = new AtmService();
          try {
            atmService.updateAtm(id, status);
            return {
              statusCode: 200,
              body: {status: "SUCCESS", message: "Atm updated successfully"}
            };
          } catch (error) {
            return {
              statusCode: 500,
              body: {status: "fail", message: "Error while updating "+id}
            };
          }
        }
      }
    });

    Api.addRoute('atm/delete', {authRequired: false}, {
      get: {
        action: function () {
          const { id } = this.queryParams;
          if(!id) {
            return {
              statusCode: 400,
              body: {status: "fail", message: "Id cannot be null"}
            };
          }
          const atmService = new AtmService();
          try {
            //atmService.deleteAtm(id);
            return {
              statusCode: 200,
              body: {status: "SUCCESS", message: "Atm deleted successfully"}
            };
          } catch (error) {
            return {
              statusCode: 500,
              body: {status: "fail", message: "Error while deleting"}
            };
          }
        }
      }
    });

});

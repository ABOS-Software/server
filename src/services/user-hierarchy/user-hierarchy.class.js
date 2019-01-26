/* eslint-disable no-unused-vars */
class Service {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find(params) {
    const seqClient = this.app.get('sequelizeClient');
    const user = seqClient.models['user'];
    const userManager = seqClient.models['user_manager'];
    const userYear = seqClient.models['user_year'];
    const year = seqClient.models['year'];
    let yr = await year.findByPk(params.query.year);
    let users = await user.findAll({
      attributes: ['id', 'full_name', 'username'],
      include: [{model: userYear, where: {year_id: yr.id}, required: false}]
    });

    let usersList = {};


    for (const u of users) {
      let subUsers = await this.definesubUsers(users, u, yr);
      let userYr = this.setUserYr(u.user_years[0]);

      let enabledYear = await userYear.findOne({
        where: {user_id: u.id, status: 'ENABLED'},
        attributes: ['year_id']
      });
      if (!enabledYear) {
        enabledYear = -1;
      } else {
        enabledYear = enabledYear.year_id;
      }
      usersList[u.username] = {
        id: u.id,
        fullName: u.full_name,
        group: userYr.group_id,
        subUsers: subUsers,
        status: userYr.status,
        enabledYear: enabledYear
      };


    }
    // console.log(usersList);
    return {data: [usersList]};
  }

  async getManagedList(user, year) {
    const seqClient = this.app.get('sequelizeClient');

    const userManager = seqClient.models['user_manager'];
    let managedMap = new Map();
    let managed = await userManager.findAll({
      where: {
        manage_id: user.id,
        year_id: year.id
      }, attributes: ['user_id', 'id']
    });
    for (let record of managed) {
      managedMap.set(record.dataValues.user_id, record);
    }


    return managedMap;
  }

  isUserManaged(managed, userID) {
    return managed.has(userID);
  }

  async definesubUsers(users, u, yr) {
    let subUsers = {};
    //let userYr = await userYear.findOne({where: {user_id: u.id, year_id: yr.id}});
    let managed = await this.getManagedList(u, yr);
    for (const su of users) {
      let userYearSub = this.setUserYr(su.user_years[0]);
      subUsers[su.username] = {
        group: userYearSub.group_id,
        checked: (this.isUserManaged(managed, su.id)),
        status: userYearSub.status
      };


    }
    return subUsers;
  }

  setUserYr(userYr) {
    if (!userYr) {
      userYr = {};
      userYr.group_id = 1;
      userYr.status = 'DISABLED';
    }
    return userYr;
  }


  async get(id, params) {
  }

  async userStatus(enabledYear, currentStatus, year, uId) {
    const seqClient = this.app.get('sequelizeClient');

    const userYear = seqClient.models['user_year'];
    let status = '';
    if (enabledYear !== -1) {
      if (year.id !== enabledYear) {
        if (currentStatus === 'ENABLED') {
          status = 'ARCHIVED';
        }
      } else {

        let enabledUsers = await userYear.findAll({where: {user_id: uId, status: 'ENABLED'}});
        for (let enabledU of enabledUsers) {
          enabledU.status = 'ARCHIVED';
          await enabledU.save();

        }
        status = 'ENABLED';


      }
    } else {
      if (currentStatus === 'ENABLED') {
        status = 'ARCHIVED';
      }
    }
    return status;
  }

  async updateUserYear(usr, yr, user, params) {
    let retEnabledYear = -1;
    const seqClient = this.app.get('sequelizeClient');
    const userYear = seqClient.models['user_year'];
    let [userYr, cr] = await userYear.findOrBuild({where: {user_id: usr.id, year_id: yr.id}});
    if (user.group != null) {
      userYr.group_id = user.group;
    }
    userYr.status = user.status || 'DISABLED';
    if (userYr.user_id === params.payload.userId && userYr.status === 'ENABLED') {
      retEnabledYear = userYr.year_id;
    }
    await userYr.save();
    return retEnabledYear;
  }

  async setSubUsers(userObj, year, user, usersM) {
    const seqClient = this.app.get('sequelizeClient');
    const userM = seqClient.models['user'];
    const userManager = seqClient.models['user_manager'];
    const userYear = seqClient.models['user_year'];
    //   log.debug(jsonParams.toString());
    let managed = await this.getManagedList(user, year);

    for (const suK of Object.keys(userObj.subUsers)) {
      const su = userObj.subUsers[suK];
      let subUser = usersM.get(suK);

      // UserManager.findOrSaveByManageAndUser(user, subUser)

      if (su.checked) {
        await userManager.findOrCreate({where: {manage_id: user.id, user_id: subUser.id, year_id: year.id}});

      } else {
        let uM = managed.get(subUser.id);
        if (uM) {
          await uM.destroy();
          //uM.save()
        }
      }


    }
  }

  async getMappedUsers() {
    const seqClient = this.app.get('sequelizeClient');
    const user = seqClient.models['user'];
    let userMap = new Map();
    let usersM = await user.findAll({});
    for (let record of usersM) {
      userMap.set(record.dataValues.username, record);
    }


    return userMap;
  }
  async create(data, params) {
    const seqClient = this.app.get('sequelizeClient');
    const user = seqClient.models['user'];

    const year = seqClient.models['year'];
    //   log.debug(jsonParams.toString());
    let users = data.data;
    let yr = await year.findByPk(data.year);
    let retEnabledYear;
    let usersM = await this.getMappedUsers();
    //let usersList = [:]
    for (const uK of Object.keys(users)) {
      const u = users[uK];
      let usr = usersM.get(uK);
      u.status = await this.userStatus(u.enabledYear, u.status, yr, usr.id);

      retEnabledYear = await this.updateUserYear(usr, yr, u, params);
      //let subUsers = [:]
      await this.setSubUsers(u, yr, usr, usersM);


    }
    return {enabledYear: retEnabledYear};


  }

  async update(id, data, params) {
  }

  async patch(id, data, params) {
  }

  async remove(id, params) {
  }
}

module.exports = function (options, app) {
  return new Service(options, app);
};

module.exports.Service = Service;

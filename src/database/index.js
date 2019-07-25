import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);
    this.init();
  }

  init() {
    this.connection
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
  }
}

export default new Database();

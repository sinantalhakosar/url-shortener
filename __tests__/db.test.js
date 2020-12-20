const db = require("../models");
const chai = require('chai');
var expect = chai.expect;
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
const UserModel = require("../models/user.model");
const UrlModel = require("../models/url.model");
const {
    sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists 
  } = require('sequelize-test-helpers')

describe("Test users model", () => {
  // Set the db object to a variable which can be accessed throughout the whole test file
    let thisDb = db
    
  // Before any tests run, clear the DB and run migrations with Sequelize sync()
  beforeAll(async () => {
    await thisDb.sequelize.sync({ force: true });
  });
  
  const User = UserModel(sequelize, dataTypes)
  const user = new User()

  checkModelName(User)('users')
 
  describe('user properties', () => {
    ['username', 'password', 'email'].forEach(checkPropertyExists(user))
  });

  const Url = UrlModel(sequelize, dataTypes)
  const url = new Url()

  checkModelName(Url)('urls')
 
  describe('url properties', () => {
    ['long_url', 'short_url', 'last_accessed','access_count'].forEach(checkPropertyExists(url))
  })
 
  describe('associations', () => {
    beforeAll(() => {
        User.belongsToMany(UrlModel, { through: 'user_url', as: 'urls' });
        Url.belongsToMany(UserModel, { through: 'user_url', as: 'users' })
    })

    it('defined a belongsToMany', () => {
      expect(User.belongsToMany).to.have.been.calledWith(UrlModel, {
        through: 'user_url',
        as: 'urls',
      });
      expect(Url.belongsToMany).to.have.been.calledWith(UserModel, {
        through: 'user_url',
        as: 'users',
      });
    })
  })



  // After all tersts have finished, close the DB connection
  afterAll(async function() {
    return await thisDb.sequelize.close()
  });
})
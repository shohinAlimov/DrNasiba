const { ObjectId } = require("mongodb");

class User {
  constructor(email, password) {
    this._id = new ObjectId();
    this.email = email;
    this.password = password;
  }
}

module.exports = User;

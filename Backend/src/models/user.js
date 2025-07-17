import UserDao from '../dao/userDao.js';
import bcrypt from 'bcrypt';

class User {
    constructor(user) {
        console.log(user);
      this.id = user.id;
      this.username = user.username;
      this.email = user.email;
      this.password = user.password;
    }

    static async create({ email, password, username }) {
      if (!email || !password || !username) {
          throw new Error('Email, password, and username are required');
      }
      if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
      }
      if (username.length < 3) {
          throw new Error('Username must be at least 3 characters');
      }
      const existingUser = await UserDao.findUserByEmail(email);

      if (existingUser) {
          console.log("IN EXISTS")
          throw new Error('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      password = hashedPassword;

      const userId = await UserDao.create({email, password, username});
      console.log(userId);
      const userData = await UserDao.findById(userId);
      console.log(userData);
      return new User(userData);
  }

  static async findById(id) {
      const userData = await UserDao.findById(id);
      if (!userData) {
          return null;
      }
      return new User(userData);
  }

  static async findByUsername(username) {
      const userData = await UserDao.findUserByUsername(username);
      if (!userData) {
          return null;
      }
      return new User(userData);
  }

    static async findByEmail(email) {
        const userData = await UserDao.findUserByEmail(email);
        if (!userData) {
            return null;
        }
        return new User(userData);
    }

  async verifyPassword(password, hashedPassword) {
      return await bcrypt.compare(password, this.password);
  }
}
  
export default User; 

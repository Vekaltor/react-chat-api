import User from "../model/User";
import bcrypt from "bcrypt";
import EmailBusyException from "../exceptions/EmailBusyException";

class UserService {
  addUser = async (body) => {
    const { name, surname, email, pass } = body;
    let salt = parseInt(process.env.BCRYPT_SALT);
    const hashedPassword = await bcrypt.hash(pass, salt);

    let isBusyEmail = await this.#isEmailBusy(email);

    if (!isBusyEmail) {
      const savedUser = new User({
        name: name,
        surname: surname,
        contact: { primary_email: email },
        pass: hashedPassword,
      });
      await savedUser.save();
      return savedUser;
    } else throw new EmailBusyException();
  };

  #isEmailBusy = async (email) => {
    return (await User.findOne({ contact: { primary_email: email } }))
      ? true
      : false;
  };

  existsUser = async (email) => {
    let isExists = await this.#isEmailBusy(email);
    if (isExists) {
      throw new EmailBusyException();
    }
    return isExists;
  };

  getUserById = async (id) => {
    return await User.findById(id).select(
      "name surname role created_at contact"
    );
    // .then((doc) => {
    //   res.status(200).send({
    //     user: doc,
    //   });
    // });
  };

  getUserByFilter = (filter, callback) => {
    return User.findOne(filter).exec((err, user) => {
      if (callback) callback(err, user);
    });
  };

  getAllUsers = async (req, res) => {
    return await User.find()
      .select("name surname role created_at contact")
      .exec()
      .then((docs) => {
        res.status(200).send({
          count: docs.length,
          users: [...docs],
        });
      });
  };

  modifyUser = async (id, update, options = {}) => {
    await User.updateOne({ _id: id }, update, options);
  };
}

export default UserService;

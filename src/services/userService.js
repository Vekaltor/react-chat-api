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
    } else throw new EmailBusyException();
  };

  #isEmailBusy = async (email) => {
    return (await User.findOne({ contact: { primary_email: email } }))
      ? true
      : false;
  };

  getUserById = async (id) => {
    await User.findById(id)
      .select("name surname role created_at contact")
      .then((doc) => {
        res.status(200).send({
          user: doc,
        });
      });
  };

  getAllUsers = async (req, res) => {
    await User.find()
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

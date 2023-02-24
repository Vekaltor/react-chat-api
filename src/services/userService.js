import User from "../model/User";
import bcrypt from "bcrypt";
import EmailBusyException from "../exceptions/EmailBusyException";

class UserService {
  create = async (body) => {
    const { name, surname, email, pass } = body;
    let salt = parseInt(process.env.BCRYPT_SALT);
    let hashedPassword = await bcrypt.hash(pass, salt);

    const savedUser = new User({
      name: name,
      surname: surname,
      email: email,
      pass: hashedPassword,
    });

    if (this.isEmailBusy(email)) throw new EmailBusyException();
    else await savedUser.save();
  };

  isEmailBusy = async (email) =>
    (await User.findOne({ email })) ? true : false;

  getUser = async (id) => {
    await User.findById(id);
  };

  getUsers = async () => {
    await User.find();
  };
}

export default UserService;

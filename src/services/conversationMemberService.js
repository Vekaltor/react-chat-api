import ConversationMember from "../model/ConversationMember";
import UserService from "./userService";

class ConversationMemberService {
  constructor() {
    this.userService = new UserService();
  }

  async getMembersByIdConversation(id) {
    try {
      return await ConversationMember.find({ id_conversation: id });
    } catch (error) {
      return error;
    }
  }

  async createMember(body) {
    const { idConversation, idUser, role = "member" } = body;
    const user = await this.userService.getUserById(idUser);
    const nickName = user.name + " " + user.surname;

    let member = new ConversationMember({
      id_conversation: idConversation,
      id_user: idUser,
      joined_date_time: new Date(),
      nick_name: nickName,
      role: role,
    });

    return await member.save();
  }

  async createMembers(idConversation, members) {
    return Promise.all(
      members.map(async (member) => {
        member.idConversation = idConversation;
        return await this.createMember(member);
      })
    );
  }
}

export default ConversationMemberService;

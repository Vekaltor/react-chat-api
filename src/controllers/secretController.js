const data = [
  { id: 0, name: "dupa", surname: "sraka" },
  { id: 1, name: "dupa2", surname: "sraka2" },
  { id: 2, name: "dupa3", surname: "sraka3" },
  { id: 3, name: "dupa4", surname: "sraka4" },
  { id: 4, name: "dupa5", surname: "sraka5" },
  { id: 5, name: "dupa6", surname: "sraka6" },
];

class SecretController {
  constructor() {}
  getData(req, res, next) {
    return res.status(200).send(data);
  }
}

export default new SecretController();

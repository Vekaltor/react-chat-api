class EmailBusyException {
  constructor() {
    this.status = 409;
    this.message = "EMAIL_EXISTS";
  }
}

export default EmailBusyException;

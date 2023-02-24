class ValidationException {
  constructor(message) {
    this.status = 406;
    this.message = message;
  }
}
export default ValidationException;

class ForbiddenException {
  constructor() {
    this.message = "FORBIDDEN_EXCEPTION";
    this.status = 403;
  }
}

export default ForbiddenException;

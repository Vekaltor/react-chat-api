class BadRequestError extends Error {
    constructor(message = 'Bad request') {
        super(message);
        this.name = 'BadRequestError';
        this.status = 400;
    }
}

export default BadRequestError; 
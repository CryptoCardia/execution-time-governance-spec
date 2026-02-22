export class EtgError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

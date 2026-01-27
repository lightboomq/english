import { makeAutoObservable } from 'mobx';

class Errors_message {
    message: string = '';
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }
    get_message(): string {
        return this.message;
    }
    set_message(err: string): void {
        this.message = err;
    }
}

export default new Errors_message();

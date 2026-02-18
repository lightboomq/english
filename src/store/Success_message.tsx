import { makeAutoObservable } from 'mobx';

class Succes_message {
    is_show: boolean = false;
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }
    get_is_show(): boolean {
        return this.is_show;
    }
    set_is_show(flag: boolean): void {
        this.is_show = flag;
    }
}

export default new Succes_message();

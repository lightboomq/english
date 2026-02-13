import { makeAutoObservable } from 'mobx';
interface Data {
    is_mix_words: boolean;
}
class Settings_store {
    is_mix_words: boolean = false;
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }
    set_is_mix_words(data: Data) {
        this.is_mix_words = data.is_mix_words;
    }
}

export default new Settings_store();

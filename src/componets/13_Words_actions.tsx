import React from 'react';
import s from '../styles/13_words_actions.module.css';
import Success_message from '../store/Success_message';
import Errors_message from '../store/Errors_message';
import { API } from '../API';

export const Words_actions = ({ words, set_words, mix_words }) => {
    const [is_loading, set_is_loading] = React.useState<boolean>(false);
    const reset_all_words = async () => {
        try {
            const ids: string[] = [];
            for (let i = 0; i < words.length; i++) {
                if (words[i].is_correct_translation !== undefined) {
                    ids.push(words[i]._id);
                }
            }
            set_is_loading(true);
            await API.reset_all_words(ids);

            set_words((prev) => prev.map((word) => (ids.includes(word._id) ? { ...word, is_correct_translation: undefined } : word)));

            Success_message.set_is_show(true);
        } catch (err: any) {
            Errors_message.set_message(err.message);
        } finally {
            set_is_loading(false);
        }
    };

    return (
        <div className={s.wrapper_btns}>
            <button className={`${s.btns} ${s.btn_reset}`} onClick={reset_all_words} type='button' disabled={is_loading}>
                Сбросить все
                {is_loading && (
                    <span className={s.loading}>
                        <span className={s.dots}>.</span>
                        <span className={s.dots}>.</span>
                        <span className={s.dots}>.</span>
                    </span>
                )}
            </button>

            <button className={s.btns} onClick={() => mix_words(words)} type='button'>
                Перемешать слова
            </button>
        </div>
    );
};

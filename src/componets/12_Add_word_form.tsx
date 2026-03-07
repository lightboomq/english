import React from 'react';
import s from '../styles/12_add_word_form.module.css';
import Errors_message from '../store/Errors_message';
import { API } from '../API';

export const Add_word_form = ({ words, set_words, limit_words, total_pages, change_page, current_page, set_total_words }) => {
    const [is_disabled, set_is_disabled] = React.useState<boolean>(false);
    const [input_ru, set_input_ru] = React.useState<string>('');
    const [input_en, set_input_en] = React.useState<string>('');
    const [placeholder_ru, set_placeholder_ru] = React.useState<string>('');
    const [placeholder_en, set_placeholder_en] = React.useState<string>('');
    const [is_render_placeholder, set_is_render_placeholder] = React.useState<boolean>(true);
    const input_ref_en = React.useRef<HTMLInputElement>(null);
    const [err, set_err] = React.useState<string>('');
    React.useEffect(() => {
        if (words.length > 0) {
            set_placeholder_en('');
            set_placeholder_ru('');
            return;
        }

        let active = true;

        const dictionary = [
            { en: 'innovate', ru: 'обновлять' },
            { en: 'achieve', ru: 'достигать' },
            { en: 'imagine', ru: 'представить' },
            { en: 'transform', ru: 'изменять' },
            { en: 'deliver', ru: 'доставлять' },
            { en: 'empower', ru: 'усиливать' },
            { en: 'simplify', ru: 'упрощать' },
            { en: 'connect', ru: 'связывать' },
            { en: 'improve', ru: 'улучшать' },
            { en: 'master', ru: 'освоить' },
        ];

        const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

        const write = async (delay: number, str: string, set_placeholder: any) => {
            for (const char of str) {
                await sleep(delay);
                set_placeholder((prev: string) => prev + char);
            }
        };

        const erase = async (delay: number, str: string, set_placeholder: any) => {
            for (const _ of str) {
                await sleep(delay);
                set_placeholder((prev: string) => prev.slice(0, -1));
            }
        };

        const render_placeholder = async () => {
            while (active) {
                for (const item of dictionary) {
                    if (!active) return;
                    await write(130, item.en, set_placeholder_en);
                    await sleep(200);
                    await write(130, item.ru, set_placeholder_ru);
                    await sleep(1000);
                    erase(50, item.en, set_placeholder_en);
                    await erase(50, item.ru, set_placeholder_ru);
                    await sleep(1000);
                }
            }
        };

        render_placeholder();

        return () => {
            active = false;
            set_placeholder_en('');
            set_placeholder_ru('');
        };
    }, [words.length]);

    const add_word = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const en = input_en.trim();
            const ru = input_ru.trim();
            if (!en || !ru) return set_err('Заполните оба поля');

            const is_valid_en = /^[A-Za-z\s]+$/.test(en);
            const is_valid_ru = /^[А-Яа-яЁё\s]+$/.test(ru);

            if (!is_valid_en || !is_valid_ru) return set_err('Проверьте раскладку: EN для английского, RU для русского');
            set_is_disabled(true);
            const new_word = await API.add_word({ en, ru });

            if (words.length !== limit_words) {
                set_words((prev: any[]) => [...prev, new_word]);
            } else {
                if (words.length === limit_words) {
                    change_page(total_pages);
                } else {
                    change_page(current_page + 1);
                }
            }
            set_input_en('');
            set_input_ru('');
            set_err('');

            set_total_words((prev: number) => prev + 1);
            if (input_ref_en.current) input_ref_en.current.focus();
        } catch (err: any) {
            Errors_message.set_message(err.message);
        } finally {
            set_is_disabled(false);
        }
    };
    return (
        <form onSubmit={add_word} className={s.wrapper_form}>
            <input
                className={s.word_input}
                value={input_en}
                onChange={(e) => set_input_en(e.target.value)}
                ref={input_ref_en}
                onFocus={() => set_is_render_placeholder(false)}
                autoComplete='off'
                name='en'
                type='text'
                placeholder={is_render_placeholder && words.length === 0 ? placeholder_en : 'en'}
            />

            <input
                className={s.word_input}
                value={input_ru}
                onChange={(e) => set_input_ru(e.target.value)}
                onFocus={() => set_is_render_placeholder(false)}
                autoComplete='off'
                name='ru'
                type='text'
                placeholder={is_render_placeholder && words.length === 0 ? placeholder_ru : 'ru'}
            />

            <button className={is_disabled ? `${s.add_word_btn} ${s.loading}` : s.add_word_btn} type='submit' disabled={is_disabled}>
                Добавить
            </button>

            {err && <span className={s.err}>{err}</span>}
        </form>
    );
};

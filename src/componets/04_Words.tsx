import React from 'react';
import User_settings from '../store/User_settings';
import { API } from '../API';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import settings_svg from '../assets/settings.svg';
import { Notification } from './07_Notification';
import favorite_word_png from '../assets/favorite_word.png';
import favorite_word_added_png from '../assets/favorite_word_added.png';
import send_svg from '../assets/send_input.svg';
import show_translate_png from '../assets/show_translate_word.png';
import hidden_translate_png from '../assets/hidden_translate_word.png';
import reset_word_png from '../assets/reset_word.png';
import remove_word_png from '../assets/remove_word.png';
import Errors_message from '../store/Errors_message';
import s from '../styles/04_words.module.css';

interface Words {
    _id: string;
    en: string;
    ru: string;
    is_show_translation: boolean;
    is_correct_translation?: boolean;
    user_response?: string;
}

export const Words = observer(() => {
    const [words, set_words] = React.useState<Words[]>([]);
    const [input_en, set_input_en] = React.useState<string>('');
    const [input_ru, set_input_ru] = React.useState<string>('');
    const [is_open_notification, set_is_open_notification] = React.useState<boolean>(false);
    const [selected_word_id, set_selected_word_id] = React.useState<string>('');
    const [input, set_input] = React.useState('');
    const [placeholder_en, set_placeholder_en] = React.useState<string>('');
    const [placeholder_ru, set_placeholder_ru] = React.useState<string>('');
    const [is_render_placeholder, set_is_render_placeholder] = React.useState<boolean>(true);

    const [input_search, set_input_search] = React.useState<string>('');
    const [err, set_err] = React.useState<string>('');
    const input_ref_en = React.useRef<HTMLInputElement>(null);
    const input_ref_translation = React.useRef<HTMLInputElement>(null);
    const [is_loading, set_is_loading] = React.useState<boolean>(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const get_all_words = async () => {
            try {
                set_is_loading(true);
                const [settings, res] = await Promise.all([API.get_settings(), API.get_all_words()]);
                if (settings.is_mix_words) {
                    mix_words(res);
                } else {
                    set_words(res);
                }
            } catch (err: any) {
                Errors_message.set_message(err.message);
            } finally {
                set_is_loading(false);
            }
        };
        get_all_words();
    }, []);

    const mix_words = (arr: Words[]) => {
        const clone_words = [...arr];

        for (let i = clone_words.length - 1; i > 0; i--) {
            const random_index = Math.floor(Math.random() * (i + 1));

            const temp = clone_words[i];
            clone_words[i] = clone_words[random_index];
            clone_words[random_index] = temp;
        }
        set_selected_word_id('');
        set_words(clone_words);
    };

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

    React.useEffect(() => {
        const handler_global_click = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const clicked_word = target.closest(`.${s.wrapper_word}`); //метод closest находит элемент по принципу от себя и выше до родителя
            if (clicked_word === null) {
                set_selected_word_id('');
            } // закрываем слово если клик был не на слово
        };
        document.addEventListener('click', handler_global_click);
        return () => document.removeEventListener('click', handler_global_click);
    }, []);

    React.useEffect(() => {
        const handler_global_key_down = (e: KeyboardEvent) => {
            const current_index = words.findIndex((word) => word._id === selected_word_id);

            if (e.key === 'ArrowUp') {
                const prev_index = (current_index - 1 + words.length) % words.length;
                set_selected_word_id(words[prev_index]._id);
            }
            if (e.key === 'ArrowDown') {
                const next_index = (current_index + 1) % words.length;
                set_selected_word_id(words[next_index]._id);
            }
        };

        document.addEventListener('keyup', handler_global_key_down);

        return () => {
            document.removeEventListener('keyup', handler_global_key_down);
        };
    }, [words, selected_word_id]);

    React.useEffect(() => {
        input_ref_translation.current?.focus();
    }, [selected_word_id]); //смена фокуса на следущее слово , нажатие enter или лкм на send

    const add_word = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const en = input_en.trim();
        const ru = input_ru.trim();
        if (!en || !ru) return set_err('Заполните оба поля');

        const is_valid_en = /^[A-Za-z\s]+$/.test(en);
        const is_valid_ru = /^[А-Яа-яЁё\s]+$/.test(ru);

        if (!is_valid_en || !is_valid_ru) return set_err('Проверьте раскладку: EN для английского, RU для русского');

        API.add_word({ en, ru })
            .then((new_word) => {
                set_words((prev) => [...prev, new_word]);
                set_input_en('');
                set_input_ru('');
                set_err('');
                if (input_ref_en.current) input_ref_en.current.focus();
            })
            .catch((err) => (err.message === 'UNAUTHORIZED' ? navigate('/auth') : console.log(err)));
    };

    const render_word = (word: Words) => {
        if (word.is_correct_translation) return `${word.en} - ${word.ru}`;
        if (word.is_show_translation) return word.ru;
        return word.en;
    };

    const show_translation = (id: string) => {
        set_words((prev) => prev.map((word) => (word._id === id ? { ...word, is_show_translation: !word.is_show_translation } : word)));
    };

    const remove_word = (id: string) => {
        API.remove_word(id)
            .then(() => set_words((prev) => prev.filter((word) => String(word._id) !== String(id))))
            .catch((err) => (err.message === 'UNAUTHORIZED' ? navigate('/auth') : console.log(err)));
    };

    const reset_word = (id: string) => {
        API.reset_word(id)
            .then(() => {
                set_words((prev) =>
                    prev.map((word) => {
                        if (word._id === id) {
                            const { is_correct_translation, ...rest } = word; // rest оператор собрать все остальное
                            return {
                                ...rest, //spread оператор разобрать обратно
                                is_show_translation: false,
                            };
                        }
                        return word;
                    }),
                );
                input_ref_translation.current?.focus();
            })
            .catch((err) => (err.message === 'UNAUTHORIZED' ? navigate('/auth') : console.log(err)));
    };

    const select_word = (e: React.MouseEvent<HTMLOListElement>) => {
        const li = (e.target as HTMLElement).closest('li');
        if (!li) return;
        const id = li.dataset.id || '';
        set_selected_word_id(id);
    };

    const highlight_word = (is_correct: boolean | undefined) => {
        if (is_correct) return s.correct_translation;
        if (is_correct === false) return s.un_correct_translation;
    };

    const give_translation = (e: React.FormEvent, id: string) => {
        e.preventDefault();
        const value = input_ref_translation.current?.value.trim();
        if (!value) return;

        const clone_words = [...words];
        const current_index = clone_words.findIndex((word) => word._id === id);
        const current_word = clone_words[current_index].ru.toLowerCase();
        const is_correct = current_word === input.toLowerCase().trim();

        clone_words[current_index] = { ...clone_words[current_index], is_correct_translation: is_correct, user_response: input };

        let next_index = current_index;

        while (next_index < clone_words.length - 1) {
            next_index++;
            const user_response = clone_words[next_index].user_response;
            if (user_response === undefined) break;
        }

        if (next_index === clone_words.length - 1 && clone_words[next_index].user_response !== undefined) {
            set_selected_word_id('');
        } else {
            set_selected_word_id(clone_words[next_index]._id);
        }
        set_words(clone_words);
        set_input('');

        API.give_translation(id, is_correct).catch((err) => (err.message === 'UNAUTHORIZED' ? navigate('/auth') : console.log(err)));
    };

    const add_word_favorite = () => {};
    const search_query = input_search.toLowerCase().trim();
    const words_filter = words.filter((word) => word.en.toLowerCase().includes(search_query) || word.ru.toLowerCase().includes(search_query));

    return (
        <div className={s.container}>
            <div className={s.test}>
                {words.length >= 1 && <h4>Слов : {words.length}</h4>}
                <img className={s.settings} src={settings_svg} onClick={() => navigate('/settings')} title='Настройки' alt='Настройки' />
            </div>

            <form onSubmit={add_word}>
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
                <button className={s.add_word_btn} type='submit'>
                    Добавить
                </button>
            </form>
            {err && <span className={s.err}>{err}</span>}
            {words.length >= 1 && (
                <div className={s.wrapper_test}>
                    <input
                        className={s.input_filtering}
                        value={input_search}
                        onChange={(e) => set_input_search(e.target.value)}
                        type='search'
                        placeholder='Поиск слов...'
                        autoComplete='off'
                    />
                    <button className={s.mix_words_btn} onClick={() => mix_words(words)} type='button'>
                        Перемешать слова
                    </button>
                </div>
            )}

            {input_search && <p className={s.search_counter}>Найдено: {words_filter.length}</p>}

            <ol className={s.wrapper_words} onClick={select_word}>
                {words.length === 0 ? (
                    <p>Словарь пуст. Добавьте слово</p>
                ) : (
                    words_filter.map((word) => {
                        return (
                            <li className={word._id === selected_word_id ? `${s.wrapper_word} ${s.active_word}` : s.wrapper_word} key={word._id} data-id={word._id}>
                                <span className={highlight_word(word.is_correct_translation)}>{render_word(word)}</span>

                                {word._id === selected_word_id && (
                                    <>
                                        {!word.is_correct_translation && (
                                            <form className={s.wrapper_input_translation} onSubmit={(e) => give_translation(e, selected_word_id)}>
                                                <input
                                                    className={s.input_translation}
                                                    ref={input_ref_translation}
                                                    onChange={(e) => set_input(e.target.value)}
                                                    type='text'
                                                    placeholder='Введите перевод...'
                                                />

                                                <button className={s.send_btn} type='submit'>
                                                    <img src={send_svg} title='Далее' />
                                                </button>
                                            </form>
                                        )}
                                        <div className={s.wrapper_action}>
                                            <img className={s.favorite} onClick={add_word_favorite} src={favorite_word_png} title='Избранное' alt='favorite' />
                                            <img
                                                className={word.is_correct_translation ? `${s.word_action} ${s.disabled}` : s.word_action}
                                                onClick={() => show_translation(word._id)}
                                                draggable='false'
                                                src={word.is_show_translation ? hidden_translate_png : show_translate_png}
                                                title='Показать перевод'
                                                alt='eye'
                                            />
                                            <img
                                                className={s.word_action}
                                                draggable='false'
                                                onClick={() => reset_word(word._id)}
                                                src={reset_word_png}
                                                title='Сбросить'
                                                alt='reset'
                                            />
                                            <img
                                                className={s.word_action}
                                                onClick={() => remove_word(word._id)}
                                                draggable='false'
                                                src={remove_word_png}
                                                title='Удалить'
                                                alt='remove'
                                            />
                                        </div>
                                    </>
                                )}
                            </li>
                        );
                    })
                )}
            </ol>

            {is_open_notification && <Notification text='test' set_is_open_notification={set_is_open_notification} />}
        </div>
    );
});

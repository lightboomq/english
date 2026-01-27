import React from 'react';
import { Modal_window } from './06_Modal_window';
import { Notification } from './07_Notification';
import favorite_word_png from '../assets/favorite_word.png';
import favorite_word_added_png from '../assets/favorite_word_added.png';
import send_svg from '../assets/send_input.svg';
import show_translate_png from '../assets/show_translate_word.png';
import hidden_translate_png from '../assets/hidden_translate_word.png';
import reset_word_png from '../assets/reset_word.png';
import remove_word_png from '../assets/remove_word.png';
import s from '../styles/04_words.module.css';

interface Words {
    id: number;
    en: string;
    ru: string;
    is_show_translation: boolean;
    is_correct_translation?: boolean;
    user_response?: string;
}

export const Words = () => {
    const [words, set_words] = React.useState<Words[]>([
        { id: 1, en: 'catch', ru: 'ловить', is_show_translation: false },
        { id: 2, en: 'go', ru: 'идти', is_show_translation: false },
        { id: 3, en: 'dog', ru: 'собака', is_show_translation: false },
    ]);

    const [is_open_modal, set_is_open_modal] = React.useState<boolean>(false);
    const [is_open_notification, set_is_open_notification] = React.useState<boolean>(false);
    const [selected_word_id, set_selected_word_id] = React.useState<number | null>(null);
    const [input, set_input] = React.useState('');
    const [placeholder_en, set_placeholder_en] = React.useState<string>('');
    const [placeholder_ru, set_placeholder_ru] = React.useState<string>('');
    const [is_render_placeholder, set_is_render_placeholder] = React.useState<boolean>(true);

    const [input_search, set_input_search] = React.useState<string>('');
    const [err, set_err] = React.useState<string>('');
    const input_ref_en = React.useRef<HTMLInputElement>(null);
    const input_ref_translation = React.useRef<HTMLInputElement>(null);

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
                set_selected_word_id(null);
            } // закрываем слово если клик был не на слово
        };
        document.addEventListener('click', handler_global_click);
        return () => document.removeEventListener('click', handler_global_click);
    }, []);

    React.useEffect(() => {
        const handler_global_key_down = (e: KeyboardEvent) => {
            const current_index = words.findIndex((word) => word.id === selected_word_id);

            if (e.key === 'ArrowUp') {
                const prev_index = (current_index - 1 + words.length) % words.length;
                set_selected_word_id(words[prev_index].id);
            }
            if (e.key === 'ArrowDown') {
                const next_index = (current_index + 1) % words.length;
                set_selected_word_id(words[next_index].id);
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

    const add_word = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form_data = new FormData(e.currentTarget);

        const en = form_data.get('en') as string;
        const ru = form_data.get('ru') as string;

        if (!en.trim() || !ru.trim()) return set_err('Заполните оба поля');

        const is_valid_en = /^[A-Za-z\s]+$/.test(en);
        const is_valid_ru = /^[А-Яа-яЁё\s]+$/.test(ru);

        if (is_valid_en && is_valid_ru) {
            const newId: number = Math.max(...words.map((w) => w.id), 0) + 1;

            set_words((prev) => {
                return [...prev, { id: newId, en: en, ru: ru, is_show_translation: false }];
            });
            if (input_ref_en.current) input_ref_en.current.focus();
            set_err('');
            return e.currentTarget.reset();
        }
        set_err('Проверьте правильность ввода');
    };

    const render_word = (word: Words) => {
        if (word.is_correct_translation) return `${word.en} - ${word.ru}`;
        if (word.is_show_translation) return word.ru;
        return word.en;
    };

    const show_translation = (id: number) => {
        set_words((prev) => prev.map((word) => (word.id === id ? { ...word, is_show_translation: !word.is_show_translation } : word)));
    };

    const remove_word = (id: number) => {
        const stored = [...words];
        if (!stored) return;
        const filteredWords = stored.filter((word) => word.id !== id);
        set_words(filteredWords);
    };

    const mix_words = () => {
        const clone_words = [...words];

        for (let i = clone_words.length - 1; i > 0; i--) {
            const random_index = Math.floor(Math.random() * (i + 1));

            const temp = clone_words[i];
            clone_words[i] = clone_words[random_index];
            clone_words[random_index] = temp;
        }
        set_selected_word_id(null);
        set_words(clone_words);
    };

    const reset_word = (id: number) => {
        set_words((prev) =>
            prev.map((word) => {
                if (word.id === id) {
                    const { is_correct_translation, ...rest } = word; // rest оператор
                    return {
                        ...rest, //spread оператор
                        is_show_translation: false,
                    };
                }
                return word;
            }),
        );
        input_ref_translation.current?.focus();
    };

    const select_word = (e: React.MouseEvent<HTMLOListElement>) => {
        const li = (e.target as HTMLElement).closest('li');
        if (!li) return;
        const id = Number(li.dataset.id);
        set_selected_word_id(id);
    };

    const add_word_favorite = () => {};
    const highlight_word = (is_correct: boolean | undefined) => {
        if (is_correct) return s.correct_translation;
        if (is_correct === false) return s.un_correct_translation;
    };

    const give_translation = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        const clone_words = [...words];
        const current_index = clone_words.findIndex((word) => word.id === id);
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
            set_selected_word_id(null);
        } else {
            set_selected_word_id(clone_words[next_index].id);
        }
        set_words(clone_words);
        set_input('');
    };

    const search_query = input_search.toLowerCase().trim();
    const words_filter = words.filter((word) => word.en.toLowerCase().includes(search_query) || word.ru.toLowerCase().includes(search_query));

    const remove_all_words = () => {
        set_words([]);
    };

    return (
        <div className={s.container}>
            {words.length >= 1 && (
                <div className={s.test}>
                    <h4> Слов: {words.length}</h4>
                    <button className={s.remove_all_words} onClick={() => set_is_open_modal(true)} type='button'>
                        Удалить всё
                    </button>
                </div>
            )}
            <form onSubmit={add_word}>
                <input
                    className={s.word_input}
                    ref={input_ref_en}
                    onFocus={() => set_is_render_placeholder(false)}
                    autoComplete='off'
                    name='en'
                    type='text'
                    placeholder={is_render_placeholder && words.length === 0 ? placeholder_en : 'en'}
                />

                <input
                    className={s.word_input}
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
            {words.length > 1 && (
                <div className={s.wrapper_test}>
                    <input
                        className={s.input_filtering}
                        value={input_search}
                        onChange={(e) => set_input_search(e.target.value)}
                        type='search'
                        placeholder='Поиск слов...'
                        autoComplete='off'
                    />
                    <button className={s.mix_words_btn} onClick={mix_words} type='button'>
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
                            <li className={word.id === selected_word_id ? `${s.wrapper_word} ${s.active_word}` : s.wrapper_word} key={word.id} data-id={word.id}>
                                <span className={highlight_word(word.is_correct_translation)}>{render_word(word)}</span>

                                {word.id === selected_word_id && (
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
                                                onClick={() => show_translation(word.id)}
                                                draggable='false'
                                                src={word.is_show_translation ? hidden_translate_png : show_translate_png}
                                                title='Показать перевод'
                                                alt='eye'
                                            />
                                            <img
                                                className={s.word_action}
                                                draggable='false'
                                                onClick={() => reset_word(word.id)}
                                                src={reset_word_png}
                                                title='Сбросить'
                                                alt='reset'
                                            />
                                            <img
                                                className={s.word_action}
                                                onClick={() => remove_word(word.id)}
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
            {is_open_modal && <Modal_window set_is_open_modal={set_is_open_modal} text={'Безвозвратно удалить все слова?'} action={remove_all_words} />}
            {is_open_notification && <Notification text='test' set_is_open_notification={set_is_open_notification} />}
        </div>
    );
};

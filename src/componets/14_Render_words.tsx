import React from 'react';
import { API } from '../API';
import Errors_message from '../store/Errors_message';
import Success_message from '../store/Success_message';
import favorite_word_png from '../assets/favorite_word.png';
import favorite_word_added_png from '../assets/favorite_word_added.png';
import send_svg from '../assets/send_input.svg';
import show_translate_png from '../assets/show_translate_word.png';
import hidden_translate_png from '../assets/hidden_translate_word.png';
import reset_word_png from '../assets/reset_word.png';
import remove_word_png from '../assets/remove_word.png';
import s from '../styles/04_words.module.css';

interface Word {
    _id: string;
    en: string;
    ru: string;
    is_show_translation: boolean;
    is_correct_translation?: boolean;
    user_response?: string;
}

export const Render_words = ({
    word,
    words,
    set_words,
    total_pages,
    set_total_pages,
    set_total_words,
    current_page,
    input_ref_translation,
    change_page,
    selected_word_id,
    set_selected_word_id,
    set_triger_api,
}) => {
    const [input, set_input] = React.useState<string>('');
    const render_word = (word: Word) => {
        if (word.is_correct_translation) return `${word.en} - ${word.ru}`;
        if (word.is_show_translation) return word.ru;
        return word.en;
    };

    const show_translation = (id: string) => {
        set_words((prev: Array<Word>) => prev.map((word) => (word._id === id ? { ...word, is_show_translation: !word.is_show_translation } : word)));
        input_ref_translation.current.focus();
    };

    const remove_word = async (id: string) => {
        try {
            await API.remove_word(id);
            const updated_words = words.filter((word: Word) => String(word._id) !== String(id));

            if (updated_words.length === 0) {
                if (current_page === total_pages && current_page > 1) {
                    change_page(current_page - 1);
                } else {
                    set_triger_api((prev: number) => prev + 1); //Костыль на запрос всех слов на текущей странице
                }
                set_total_pages((prev: number) => prev - 1);
            }

            set_total_words((prev: number) => prev - 1);
            set_words(updated_words);
        } catch (err: any) {
            Errors_message.set_message(err.message);
        }
    };

    const reset_word = async (id: string) => {
        try {
            await API.reset_word(id);
            set_words((prev: Array<Word>) => prev.map((word) => (word._id === id ? { ...word, is_correct_translation: undefined } : word)));
            input_ref_translation.current?.focus();
        } catch (err: any) {
            Errors_message.set_message(err.message);
        }
    };

    const highlight_word = (is_correct: boolean | undefined) => {
        if (is_correct) return s.correct_translation;
        if (is_correct === false) return s.un_correct_translation;
    };

    const give_translation = async (e: React.FormEvent, id: string) => {
        try {
            e.preventDefault();
            const value = input_ref_translation.current?.value.trim();

            if (!value) return;
            const ru_only = /^[а-яё\s-]+$/i;
            // if (!ru_only.test(value)) return set_err('Только ru');

            const clone_words = [...words];
            const current_index = clone_words.findIndex((word) => word._id === id);
            const current_word = clone_words[current_index].ru.toLowerCase();
            const is_correct_translation = current_word === input.toLowerCase().trim();

            clone_words[current_index] = { ...clone_words[current_index], is_correct_translation, user_response: input };

            let next_index = current_index;

            while (next_index < clone_words.length - 1) {
                next_index++;
                const is_correct_translation = clone_words[next_index].is_correct_translation;
                if (is_correct_translation === undefined) break;
            }

            if (next_index === clone_words.length - 1 && clone_words[next_index].is_correct_translation !== undefined) {
                set_selected_word_id('');
            } else {
                set_selected_word_id(clone_words[next_index]._id);
            }
            set_words(clone_words);
            set_input('');

            await API.give_translation(id, is_correct_translation);
        } catch (err: any) {
            Errors_message.set_message(err.message);
        } finally {
        }
    };

    return (
        <li className={word._id === selected_word_id ? `${s.wrapper_word} ${s.active_word}` : s.wrapper_word} data-id={word._id}>
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
                        <img className={s.favorite} src={favorite_word_png} title='Избранное' alt='favorite' />
                        <img
                            className={word.is_correct_translation ? `${s.word_action} ${s.disabled}` : s.word_action}
                            onClick={() => show_translation(word._id)}
                            draggable='false'
                            src={word.is_show_translation ? hidden_translate_png : show_translate_png}
                            title='Показать перевод'
                            alt='eye'
                        />
                        <img className={s.word_action} draggable='false' onClick={() => reset_word(word._id)} src={reset_word_png} title='Сбросить' alt='reset' />
                        <img className={s.word_action} onClick={() => remove_word(word._id)} draggable='false' src={remove_word_png} title='Удалить' alt='remove' />
                    </div>
                </>
            )}
        </li>
    );
};

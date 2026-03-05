import React from 'react';
import s from '../styles/04_words.module.css';
import { API } from '../API';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Skeleton_render } from './07_Skeleton_render';
import settings_svg from '../assets/settings.svg';
import Errors_message from '../store/Errors_message';
import Pagination from './11_Pagination';
import { Add_word_form } from './12_Add_word_form';
import { Words_actions } from './13_Words_actions';
import { Render_words } from './14_Render_words';

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
    const [selected_word_id, set_selected_word_id] = React.useState<string>('');
    const [input, set_input] = React.useState<string>('');
    const [input_search, set_input_search] = React.useState<string>('');
    const input_ref_translation = React.useRef<HTMLInputElement>(null);
    const [is_loading, set_is_loading] = React.useState<boolean>(false);
    // Number(localStorage.getItem('page'))
    const [page, set_page] = React.useState<number>(1);
    const [total_pages, set_total_pages] = React.useState<number>(1);
    const [total_words, set_total_words] = React.useState<number>(0);
    const [limit_words, set_limit_words] = React.useState<number>(20);

    const navigate = useNavigate();

    React.useEffect(() => {
        const get_all_words = async () => {
            try {
                set_is_loading(true);
                const [settings, res] = await Promise.all([API.get_settings(), API.get_all_words(page, limit_words)]);

                set_limit_words(settings.range_value);
                set_total_words(res.total_words);
                set_total_pages(res.total_pages);
                set_page(res.current_page);

                localStorage.setItem('page', res.current_page);
                if (settings.is_mix_words) {
                    mix_words(res.words);
                } else {
                    set_words(res.words);
                }
            } catch (err: any) {
                Errors_message.set_message(err.message);
            } finally {
                set_is_loading(false);
            }
        };
        get_all_words();
    }, [page, limit_words]);

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

    const select_word = (e: React.MouseEvent<HTMLOListElement>) => {
        const li = (e.target as HTMLElement).closest('li');
        if (!li) return;
        const id = li.dataset.id || '';
        set_selected_word_id(id);
    };

    if (is_loading) {
        return <Skeleton_render />;
    }
    const search_value = input_search.toLowerCase().trim();
    const filtered_words = words.filter((word) => word.en.toLowerCase().includes(search_value) || word.ru.toLowerCase().includes(search_value));

    return (
        <div className={s.container}>
            <div className={s.header}>
                {words.length >= 1 && <h4>Слов : {total_words}</h4>}
                <img className={s.settings} src={settings_svg} onClick={() => navigate('/settings')} title='Настройки' alt='Настройки' />
            </div>
            <Add_word_form words={words} set_words={set_words} limit_words={limit_words} set_page={set_page} set_total_words={set_total_words} />
            {words.length >= 1 && (
                <>
                    <Words_actions words={words} set_words={set_words} mix_words={mix_words} />
                    <input
                        className={s.input_filtering}
                        value={input_search}
                        onChange={(e) => set_input_search(e.target.value)}
                        type='search'
                        placeholder='Поиск слов...'
                        autoComplete='off'
                    />
                </>
            )}
            {input_search && <p className={s.search_counter}>Найдено: {filtered_words.length}</p>}

            <ol className={s.wrapper_words} onClick={select_word}>
                {words.length === 0 ? (
                    <li>Словарь пуст. Добавьте слово</li>
                ) : (
                    filtered_words.map((word) => (
                        <Render_words
                            key={word._id}
                            word={word}
                            words={words}
                            set_words={set_words}
                            set_page={set_page}
                            set_total_words={set_total_words}
                            input_ref_translation={input_ref_translation}
                            selected_word_id={selected_word_id}
                            set_selected_word_id={set_selected_word_id}
                        />
                    ))
                )}
            </ol>
            {words.length >= 1 && <Pagination currentPage={page} total_pages={total_pages} onPageChange={(newPage) => set_page(newPage)} />}
        </div>
    );
});

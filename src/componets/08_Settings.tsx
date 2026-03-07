import React from 'react';
import { observer } from 'mobx-react-lite';
import Loader from './09_Loader.tsx';
import Errors_message from '../store/Errors_message.tsx';
import Success_message from '../store/Success_message.tsx';
import { API } from '../API.ts';
import { useNavigate } from 'react-router-dom';
import s from '../styles/08_settings.module.css';

export const Settings = observer(() => {
    const [is_loading, set_is_loading] = React.useState<boolean>(false);
    const [is_disabled, set_is_disabled] = React.useState<boolean>(false);
    const [is_mix, set_is_mix] = React.useState<boolean>(false);
    const [total_words, set_total_words] = React.useState<number>(0);
    const [limit_words, set_limit_words] = React.useState<number>(0);
    const [is_default_limit, set_is_default_limit] = React.useState<boolean>(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const get_settings = async () => {
            try {
                set_is_loading(true);
                const settings = await API.get_settings();
                set_is_mix(settings.is_mix_words);
                set_total_words(settings.total_words);
                set_limit_words(settings.limit_words);
                set_is_default_limit(settings.is_default_limit);
            } catch (err: any) {
                Errors_message.set_message(err.message);
            } finally {
                set_is_loading(false);
            }
        };
        get_settings();
    }, []);

    const remove_all_words = async () => {
        const res = prompt('Для подтверждения введите "Удалить" в поле ниже.');
        if (res !== 'Удалить') return;

        try {
            set_is_loading(true);
            await API.remove_all_words();
            set_is_disabled(true);
            Success_message.set_is_show(true);
        } catch (err: any) {
            Errors_message.set_message(err.message);
        } finally {
            set_is_loading(false);
        }
    };

    const handle_inputs = async (settings: { is_mix_words?: boolean; is_default_limit?: boolean; limit_words?: number }) => {
        if (is_disabled) return;
        if (total_words <= 1) return Errors_message.set_message('Необходимо не менее двух слов на странице.');
        try {
            const { is_mix_words, is_default_limit, limit_words } = settings;
            set_is_disabled(true);

            await API.set_settings(settings);

            if (is_mix_words !== undefined) set_is_mix((prev) => !prev);
            if (is_default_limit !== undefined) {
                set_is_default_limit(true);
                set_limit_words(20);
            }
            if (limit_words !== undefined) set_is_default_limit(false);
        } catch (err: any) {
            Errors_message.set_message(err.message);
        } finally {
            set_is_disabled(false);
        }
    };
    if (is_loading) {
        return (
            <div className={s.wrapper}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={s.wrapper}>
            <button className={s.go_back} onClick={() => navigate('/words')} type='button'>
                Выход
            </button>

            <div className={s.wrapper_btns}>
                <label className={s.wrapper_label}>
                    <input className={s.radio_btn} type='radio' name='sort_type' disabled={is_disabled} checked={!is_mix} onChange={() => handle_inputs({ is_mix_words: false })} />
                    Не перемешивать слова
                </label>

                <label className={s.wrapper_label}>
                    <input className={s.radio_btn} type='radio' name='sort_type' disabled={is_disabled} checked={is_mix} onChange={() => handle_inputs({ is_mix_words: true })} />
                    Перемешивать слова после загрузки страницы.
                </label>
            </div>

            <div>
                <h3 className={s.title_range}>Слов на странице</h3>
                <div className={s.wrapper_range}>
                    <label className={s.wrapper_label}>
                        <input className={s.radio_btn} type='radio' disabled={is_disabled} checked={is_default_limit} onChange={() => handle_inputs({ is_default_limit: true })} />
                        По умолчанию: 20
                    </label>
                    <div className={s.range}>
                        <p className={s.range_text}>Выбрано: {limit_words}</p>
                        <input
                            className={s.range_input}
                            type='range'
                            value={limit_words}
                            disabled={is_disabled}
                            onChange={(e) => {
                                set_limit_words(Number(e.target.value));
                                set_is_default_limit(false);
                            }}
                            onPointerUp={() => handle_inputs({ limit_words })}
                            min='1'
                            max={total_words}
                        />
                    </div>
                </div>
            </div>

            <button className={s.remove_all_words} disabled={is_disabled} onClick={remove_all_words} type='button'>
                Удалить все слова
            </button>
        </div>
    );
});

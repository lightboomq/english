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
    const [is_active, set_is_active] = React.useState<boolean>(false);
    const navigate = useNavigate();
    React.useEffect(() => {
        const get_settings = async () => {
            try {
                set_is_loading(true);
                const res = await API.get_settings();
                set_is_active(res.is_mix_words);
            } catch (err: any) {
                Errors_message.set_message(err.message);
            } finally {
                set_is_loading(false);
            }
        };
        get_settings();
    }, []);
    const handle_radio_btn = async (is_mix_words: boolean) => {
        try {
            set_is_disabled(true);
            const res = await API.set_settings(is_mix_words);
            set_is_active(res.is_mix_words);
            set_is_disabled(false);
            Success_message.set_is_show(true);
        } catch (err: any) {
            Errors_message.set_message(err.message);
        }
    };
    const remove_all_words = async () => {
        const res = prompt('Для подтверждения введите "Удалить" в поле ниже.');
        if (res !== 'Удалить') return;

        try {
            set_is_loading(true);
            await API.remove_all_words();
            Success_message.set_is_show(true);
        } catch (err: any) {
            Errors_message.set_message(err.message);
        } finally {
            set_is_loading(false);
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
            <div className={s.wrapper_radio_btn}>
                <label className={s.wrapper_label}>
                    <input type='radio' name='sort_type' disabled={is_disabled} checked={!is_active} className={s.radio_btn} onChange={() => handle_radio_btn(false)} />
                    Не перемешивать слова
                </label>

                <label className={s.wrapper_label}>
                    <input type='radio' name='sort_type' disabled={is_disabled} checked={is_active} className={s.radio_btn} onChange={() => handle_radio_btn(true)} />
                    Перемешивать слова после загрузки страницы.
                </label>
            </div>

            <button className={s.remove_all_words} onClick={remove_all_words} type='button'>
                Удалить все слова
            </button>
        </div>
    );
});

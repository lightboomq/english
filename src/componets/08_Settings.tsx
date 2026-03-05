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
    const [max_range, set_max_range] = React.useState<number>(0);
    const [range_value, set_range_value] = React.useState<number>(0);
    const navigate = useNavigate();

    React.useEffect(() => {
        const get_settings = async () => {
            try {
                set_is_loading(true);
                const res = await API.get_settings();
                set_is_mix(res.is_mix_words);
                set_range_value(res.range_value);
                set_max_range(res.total_words);
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
            Success_message.set_is_show(true);
        } catch (err: any) {
            Errors_message.set_message(err.message);
        } finally {
            set_is_loading(false);
        }
    };

    const handle_inputs = async (settings: { is_mix_words?: boolean; range_value?: number }) => {
        try {
            const { is_mix_words } = settings;

            set_is_disabled(true);
            await API.set_settings(settings);
            if (is_mix_words !== undefined) set_is_mix((prev) => !prev);

            Success_message.set_is_show(true);
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
            <button className={s.go_back} disabled={is_disabled} onClick={() => navigate('/words')} type='button'>
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
            <div className={s.wrapper_btns}>
                <p className={s.range_text}>Показать слов: {range_value}</p>
                <input
                    className={s.range_input}
                    type='range'
                    value={range_value}
                    disabled={is_disabled}
                    onChange={(e) => set_range_value(Number(e.target.value))}
                    onPointerUp={() => handle_inputs({ range_value })}
                    min='1'
                    max={max_range}
                />
            </div>

            <button className={s.remove_all_words} disabled={is_disabled} onClick={remove_all_words} type='button'>
                Удалить все слова
            </button>
        </div>
    );
});

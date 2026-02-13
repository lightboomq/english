import { observer } from 'mobx-react-lite';
import { API } from '../API.ts';
import { useNavigate } from 'react-router-dom';
import User_settings from '../store/User_settings.tsx';
import s from '../styles/08_settings.module.css';

export const Settings = observer(() => {
    const navigate = useNavigate();

    const handle_radio_btn = (is_mix_words: boolean) => {
        API.settings(is_mix_words)
            .then((res) => User_settings.set_is_mix_words(res))
            .catch((err) => (err.message === 'UNAUTHORIZED' ? navigate('/auth') : console.log(err)));
    };
    const remove_all_words = () => {
        const res = prompt('Для подтверждения введите "Удалить" в поле ниже.');
        if (res !== 'Удалить') return;

        API.remove_all_words().catch((err) => (err.message === 'UNAUTHORIZED' ? navigate('/auth') : console.log(err)));
    };

    return (
        <div className={s.wrapper}>
            <button className={s.go_back} onClick={() => navigate('/words')} type='button'>
                Выход
            </button>
            <div className={s.wrapper_radio_btn}>
                <label className={s.wrapper_label}>
                    <input type='radio' name='sort_type' checked={!User_settings.is_mix_words} className={s.radio_btn} onChange={() => handle_radio_btn(false)} />
                    Не перемешивать слова
                </label>

                <label className={s.wrapper_label}>
                    <input type='radio' name='sort_type' checked={User_settings.is_mix_words} className={s.radio_btn} onChange={() => handle_radio_btn(true)} />
                    Перемешивать слова после загрузки страницы.{' '}
                </label>
            </div>

            <button className={s.remove_all_words} onClick={remove_all_words} type='button'>
                Удалить все слова
            </button>
        </div>
    );
});

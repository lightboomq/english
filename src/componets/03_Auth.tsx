import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../API';
import Loader from './09_Loader.tsx';
import Errors_message from '../store/Errors_message.tsx';

import s from '../styles/03_auth.module.css';

export const Auth = () => {
    const [is_loading, set_is_loading] = React.useState(false);
    const [login, set_login] = React.useState('');
    const [password, set_password] = React.useState('');
    const [err, set_err] = React.useState('');
    const navigate = useNavigate();

    const sign_in = async () => {
        if (!login.trim() || !password.trim()) return set_err('Заполните поля!');
        try {
            set_is_loading(true);
            await API.get_auth({ login, password });
            navigate('/words');
        } catch (err: any) {
            Errors_message.set_message(err.message);
        } finally {
            set_is_loading(false);
        }
    };

    return (
        <form className={s.wrapperForm}>
            <h2>Авторизация</h2>
            <label className={s.wrapperInput}>
                Login
                <input type='search' autoComplete='off' onChange={(e: React.ChangeEvent<HTMLInputElement>) => set_login(e.target.value)} value={login} />
            </label>

            <label className={s.wrapperInput}>
                Password
                <input type='password' autoComplete='off' onChange={(e: React.ChangeEvent<HTMLInputElement>) => set_password(e.target.value)} value={password} />
            </label>

            <p className={s.err}>{err && err}</p>
            <button onClick={sign_in} type='button' className={s.sign_btn}>
                Войти
            </button>
            {is_loading && <Loader />}
            <Link to='/Registration'>Нету аккаунта? Зарегестрируйтесь</Link>
        </form>
    );
};

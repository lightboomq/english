import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../API';
import Loader from './09_Loader.tsx';
import Errors_message from '../store/Errors_message.tsx';

import s from '../styles/03_auth.module.css';

export const Auth = () => {
    React.useEffect(() => {
        //с бекенда, 401 статус - Сообщение юзеру на истекший токен или 404 статус - Юзер на найден.
        const saved_error = sessionStorage.getItem('auth_error');
        if (saved_error) {
            Errors_message.set_message(saved_error);
            sessionStorage.removeItem('auth_error');
        }
    }, []);

    const [is_loading, set_is_loading] = React.useState(false);
    const [login, set_login] = React.useState('');
    const [password, set_password] = React.useState('');
    const [err, set_err] = React.useState('');
    const navigate = useNavigate();

    const sign_in = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
        <form onSubmit={sign_in} className={s.wrapper_form}>
            <h2 className={s.title}>Авторизация</h2>

            <label className={s.wrapper_input}>
                Login
                <input type='search' autoComplete='off' onChange={(e: React.ChangeEvent<HTMLInputElement>) => set_login(e.target.value)} value={login} />
            </label>

            <label className={s.wrapper_input}>
                Password
                <input type='password' autoComplete='off' onChange={(e: React.ChangeEvent<HTMLInputElement>) => set_password(e.target.value)} value={password} />
            </label>

            {err && <p className={s.err}>{err}</p>}
            <div className={s.wrapper_btns}>
                <button type='submit' className={s.sign_btn}>
                    Войти
                </button>
                {is_loading && <Loader />}
                <Link className={s.link} to='/Registration'>
                    Нету аккаунта? Зарегестрируйтесь
                </Link>
            </div>
        </form>
    );
};

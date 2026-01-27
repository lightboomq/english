import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Errors from '../store/Errors_message.tsx';

import s from '../styles/03_auth.module.css';

export const Auth = () => {
    const [login, set_login] = React.useState('');
    const [password, set_password] = React.useState('');
    const [err, set_err] = React.useState('');
    const navigate = useNavigate();
    const sign_in = async () => {
        try {
            const res = await fetch('http://localhost:3000/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login,
                    password,
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Произошла ошибка при регистрации');
            }
            // !navigate('/words');
        } catch (err: any) {
            set_err(err.message);
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

            <p className={s.err}>{Errors.get_message() && Errors.get_message()}</p>
            <button onClick={sign_in} type='button'>
                Войти
            </button>
            <Link to='/Registration'>Нету аккаунта? Зарегестрируйтесь</Link>
        </form>
    );
};

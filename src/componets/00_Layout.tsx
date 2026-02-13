import React from 'react';
import { API } from '../API';
import User_settings from '../store/User_settings';
import { Outlet } from 'react-router-dom';
import s from '../styles/00_layout.module.css';

export const Layout = () => {
    const [is_loading, set_is_loading] = React.useState<boolean>(true);

    // Настройки пользователя
    React.useEffect(() => {
        API.mix_all_words()
            .then((res) => {
                User_settings.set_is_mix_words(res);
            })
            .catch((err) => console.log(err))
            .finally(() => {
                set_is_loading(false);
            });
    }, []);

    // if (is_loading) {
    //     return <div>Загрузка настроек...</div>;
    // }

    return (
        <main className={s.wrapper}>
            <Outlet />
        </main>
    );
};

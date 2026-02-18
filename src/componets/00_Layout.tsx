import React from 'react';
import { API } from '../API';
import Success_notification from './10_Success_notification';
import Success_message from '../store/Success_message';
import Error_notification from './05_Error_notification';
import Errors_message from '../store/Errors_message';
import User_settings from '../store/User_settings';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import s from '../styles/00_layout.module.css';

export const Layout = observer(() => {
    const [is_loading, set_is_loading] = React.useState<boolean>(true);

    // Настройки пользователя

    // if (is_loading) {
    //     return <div>Загрузка настроек...</div>;
    // }

    return (
        <main className={s.wrapper}>
            {Success_message.get_is_show() && <Success_notification />}
            <Outlet />
            {Errors_message.get_message() && <Error_notification />}
        </main>
    );
});

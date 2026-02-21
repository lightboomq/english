import React from 'react';
import err_icon from '../assets/errorIcon.svg';
import close_err from '../assets/close_success.svg';
import Error_messages from '../store/Errors_message';
import { observer } from 'mobx-react-lite';
import s from '../styles/05_error_notification.module.css';

const Error_notification = () => {
    React.useEffect(() => {
        const timer_id = setTimeout(() => {
            Error_messages.set_message('');
        }, 10000);

        return () => {
            clearTimeout(timer_id);
        };
    }, []);

    return (
        <div className={s.wrapper}>
            <div className={s.header}>
                <img src={err_icon} className={s.err_icon} width={20} height={20} alt='err_icon' />
                <p className={s.title}>Ошибка</p>
                <img onClick={() => Error_messages.set_message('')} src={close_err} className={s.close_err} alt='close_err' />
            </div>

            <p className={s.text}>{Error_messages.get_message()}</p>

            <div className={s.line}> </div>
        </div>
    );
};

export default observer(Error_notification);

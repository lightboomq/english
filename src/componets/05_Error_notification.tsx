import React from 'react';
import errorIcon from '../assets/errorIcon.svg';
import close_err from '../assets/close_success.svg';
import Error_messages from '../store/Errors_message';
import { observer } from 'mobx-react-lite';
import s from '../styles/05_error_notification.module.css';

const Error_notification = () => {
    React.useEffect(() => {
        const timer_id = setTimeout(() => {
            Error_messages.set_message('');
        }, 210000);

        return () => {
            clearTimeout(timer_id);
        };
    }, []);

    return (
        <div className={s.wrapper}>
            <div className={s.header}>
                <div className={s.test}>
                    <img src={errorIcon} alt='err' />
                    <p className={s.icon}>Ошибка</p>
                </div>
                <img onClick={() => Error_messages.set_message('')} src={close_err} className={s.closeError} alt='close' />
            </div>

            <p className={s.textErr}>{Error_messages.get_message()}</p>
            <div className={s.line}> </div>
        </div>
    );
};

export default observer(Error_notification);

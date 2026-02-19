import React from 'react';
import successfully_png from '../assets/successfully.svg';
import close_success from '../assets/close_success.svg';
import Succes_message from '../store/Success_message';
import { observer } from 'mobx-react-lite';
import s from '../styles/10_success_notification.module.css';

const Error_notification = () => {
    React.useEffect(() => {
        const timer_id = setTimeout(() => {
            Succes_message.set_is_show(false);
        }, 1500);

        return () => {
            clearTimeout(timer_id);
        };
    }, []);

    return (
        <div className={s.wrapper}>
            <img src={successfully_png} width={25} height={25} alt='err' />
            <p className={s.text}>Успешно!</p>

            {/* <img onClick={() => Succes_message.set_is_show(false)} src={close_success} className={s.close} alt='close' /> */}
            <div className={s.line}> </div>
        </div>
    );
};

export default observer(Error_notification);

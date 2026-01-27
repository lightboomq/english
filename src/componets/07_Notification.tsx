// import checkMarker from '../../../assets/check-marker.png'
import React from 'react';
import s from '../styles/07_notification.module.css';

export function Notification({ text, set_is_open_notification }) {
    React.useEffect(() => {
        const id = setTimeout(() => {
            set_is_open_notification(false);
        }, 3000);

        return () => clearTimeout(id);
    }, [set_is_open_notification]);
    return (
        <div className={s.wrapper}>
            {/* <img className={s.checkMarker} src={checkMarker} alt="checkmarker" /> */}
            <p>{text}</p>
        </div>
    );
}

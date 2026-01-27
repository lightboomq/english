import s from '../styles/06_modal_window.module.css';

export function Modal_window({ set_is_open_modal, text, action }) {
    return (
        <div className={s.wrapperModalWindow}>
            <div className={s.modalWindow}>
                <p className={s.text}>{text}</p>

                <div className={s.wrapperBtns}>
                    <button
                        onClick={() => {
                            action();
                            set_is_open_modal(false);
                        }}
                        className={`${s.btn} ${s.btnYes}`}
                        type='button'
                    >
                        Подтверждаю
                    </button>

                    <button onClick={() => set_is_open_modal(false)} className={`${s.btn} ${s.btnNo}`} type='button'>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}

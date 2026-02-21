import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../API';
import Success_message from '../store/Success_message';
import Errors_message from '../store/Errors_message';
import Loader from './09_Loader';
import visible_password_svg from '../assets/visible_password.svg';
import invisible_password_svg from '../assets/invisible_password.svg';
import valid_png from '../assets/valid.png';
import invalid_png from '../assets/invalid.png';
import s from '../styles/02_registration.module.css';

// Для onChange: React.ChangeEvent<HTMLInputElement>
// Для onBlur: React.FocusEvent<HTMLInputElement>
// Для onClick: React.MouseEvent<HTMLButtonElement>
// Для onSubmit: React.FormEvent<HTMLFormElement>

interface Types_property {
    id: number;
    title: string;
    value: string;
    type: string;
    is_has_err: boolean;
    rules: Rules[];
}
interface Rules {
    message: string;
    is_valid: boolean;
    regexp: RegExp;
}

export const Registration = () => {
    const [is_show_password, set_is_show_password] = React.useState<boolean>(false);
    const [fields, set_fields] = React.useState<Types_property[]>([
        {
            id: 1,
            title: 'login',
            value: '',
            type: 'search',
            is_has_err: false,
            rules: [
                {
                    message: 'От 3 до 12 символов. Допустимы латинские буквы|цифры|нижнее подчеркивание. ',
                    regexp: /^[a-zA-Z0-9_]{3,12}$/,
                    is_valid: false,
                },

                // {
                //     message: 'Используйте латиницу (цифры и спецсимволы по желанию).',
                //     regexp: /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>_]+$/,
                //     is_valid: false,
                // },
            ],
        },

        {
            id: 2,
            title: 'email',
            value: '',
            type: 'email',
            is_has_err: false,
            rules: [
                {
                    message: 'Введите корректный адрес электронной почты (например, example@mail.com)',
                    regexp: /^([0-9A-Za-z]{1}[-0-9A-Za-z\._]{1,}[0-9A-Za-z]{1}@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/,
                    is_valid: false,
                },
            ],
        },

        {
            id: 3,
            title: 'password',
            value: '',
            type: 'password',
            is_has_err: false,
            rules: [
                {
                    message: 'От 6 до 16 символов. Запрещены русские буквы и пробелы. Можно использовать любые другие символы и спецсимволы',
                    regexp: /^[^\sа-яА-ЯёЁ]{6,16}$/,
                    is_valid: false,
                },
                // {
                //     message: 'Латиница или цифры и хотя бы 1 спецсимвол(!@#$%^&*(),.?":{}|<>_)',
                //     regexp: /^(?=.*[A-Za-z0-9])(?=.*[!@#$%^&*(),.?":{}|<>_])[A-Za-z0-9!@#$%^&*(),.?":{}|<>_]+$/,
                //     is_valid: false,
                // },
            ],
        },
    ]);
    const [err, set_err] = React.useState('');
    const [index_field, set_index_field] = React.useState<null | number>(null);
    const [is_loading, set_is_loading] = React.useState<boolean>(false);
    const navigate = useNavigate();

    const handle_input = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const { value } = e.currentTarget;
        const arr = structuredClone(fields);
        const index = arr.findIndex((item) => item.id === id);

        arr[index].value = value;
        arr[index].is_has_err = false;
        for (let i = 0; i < arr[index].rules.length; i++) {
            const result_regexp = arr[index].rules[i].regexp.test(value);
            if (result_regexp) {
                arr[index].rules[i].is_valid = true;
            } else {
                arr[index].rules[i].is_valid = false;
            }
        }

        set_fields(arr);
    };
    const handle_blur = (e: React.FocusEvent<HTMLInputElement>, id: number) => {
        const { value } = e.currentTarget;
        const arr = structuredClone(fields);
        const index = arr.findIndex((item) => item.id === id);
        arr[index].value;

        for (let i = 0; i < arr[index].rules.length; i++) {
            const is_valid = arr[index].rules[i].is_valid;
            if (value.trim() !== '' && !is_valid) {
                arr[index].is_has_err = true;
                break;
            }
        }
        set_is_show_password(false);
        set_index_field(null);
        set_fields(arr);
    };
    const handle_focus = (e: React.FocusEvent<HTMLInputElement>) => {
        const id = Number(e.currentTarget.dataset.id);
        const index = fields.findIndex((item) => item.id === id);
        set_index_field(index);
    };
    const handle_on_mouse_down = (e: React.MouseEvent<HTMLImageElement>) => {
        e.preventDefault();
        set_is_show_password(!is_show_password);
    };

    const set_type_password = (title: string) => {
        if (title === 'password') {
            if (is_show_password) {
                return 'text';
            }
            return 'password';
        }
    };

    const send_data = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        for (let i = 0; i < fields.length; i++) {
            if (fields[i].value.trim() === '') {
                return set_err('Не должно быть пустых полей');
            }
            if (fields[i].is_has_err) {
                return set_err('Заполните правильно все поля');
            }
        }

        const obj = {};

        for (let i = 0; i < fields.length; i++) {
            const key = fields[i].title.trim();
            const value = fields[i].value.trim();
            obj[key] = value;
        }

        try {
            set_is_loading(true);
            await API.get_registration(obj);
            Success_message.set_is_show(true);
            navigate('/auth');
        } catch (err: any) {
            Errors_message.set_message(err.message);
        } finally {
            set_is_loading(false);
        }
    };

    return (
        <form onSubmit={send_data} className={s.wrapper_form}>
            <div className={s.column_top}>
                {index_field !== null &&
                    fields[index_field].rules.map((item, i) => {
                        return (
                            <div key={i}>
                                <img width={14} height={14} src={item.is_valid ? valid_png : invalid_png} alt='png' />
                                <span className={s.message}>{item.message}</span>
                            </div>
                        );
                    })}
            </div>

            <div className={s.column_bottom}>
                <h2 className={s.title}>Регистрация</h2>
                {fields.map((field) => {
                    return (
                        <div key={field.id} className={s.wrapper_input}>
                            <label className={s.label_title}>{field.title}</label>
                            <input
                                type={set_type_password(field.title)}
                                data-id={field.id}
                                onFocus={(e) => handle_focus(e)}
                                onChange={(e) => handle_input(e, field.id)}
                                onBlur={(e) => handle_blur(e, field.id)}
                                autoComplete='off'
                                value={field.value}
                                className={field.is_has_err ? s.input_err : s.input_unerr}
                                style={{ height: '27px', fontSize: '14px' }}
                            />
                            {field.type === 'password' && field.value.trim() !== '' ? (
                                <img
                                    className={s.eye}
                                    width={20}
                                    height={20}
                                    onMouseDown={handle_on_mouse_down}
                                    src={is_show_password ? invisible_password_svg : visible_password_svg}
                                />
                            ) : null}
                        </div>
                    );
                })}
                <div className={s.wrapper_btns}>
                    {err && <p className={s.err}>{err}</p>}
                    <button className={s.btns} type='submit'>
                        Зарегистрироваться
                        {is_loading && <Loader />}
                    </button>
                    <Link className={s.btns} to='/auth'>
                        Уже есть аккаунт?
                    </Link>
                </div>
            </div>
        </form>
    );
};

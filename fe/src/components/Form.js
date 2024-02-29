import { useState } from "react";
import styles from "./Form.module.css";

export default function Form({
    value = "",
    onEnter,
    placeholder = "",
    onBlur = () => { }
}) {
    const [val, setVal] = useState(value);

    return <form
        className={styles.form}
        onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onEnter(val);
            setVal('');
        }}>
        <input
            onBlur={onBlur}
            autoFocus={true}
            placeholder={placeholder}
            type="text" value={val} onChange={(e) => {
                setVal(e.target.value);
            }} />
    </form>;
}
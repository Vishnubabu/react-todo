import styles from "./Todo.module.css";
import { useEffect, useMemo, useState } from "react"
import Form from "./Form";
import Loader from "./Loader";
import cn from 'classnames';

let listPromise;
function list() {
    if (!listPromise) {
        listPromise = fetch('/api/todo')
            .then(r => r.json())
            .catch(e => {
                console.error(e);
                return [];
            });
    }

    return listPromise;
}

async function create(todo) {
    const { title } = todo;
    return fetch('/api/todo', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            title,
        })
    })
        .then(r => r.json())
        .catch(e => {
            console.error(e);
        })
}

function remove(todo) {
    const { _id } = todo;
    fetch(`/api/todo/${_id}`, { method: 'DELETE' })
        .catch(e => {
            console.error(e);
        });
}

function update(todo) {
    const { _id, title, checked } = todo;
    fetch(`/api/todo/${_id}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            title,
            checked
        })
    })
        .catch(e => {
            console.error(e);
        });
}

let repaint;
export default function Todo() {
    const [todos, setTodos] = useState();
    const [editing, setEditing] = useState();
    const [filter, setFilter] = useState("All");

    const uncheckedItmCnt = useMemo(() => todos?.filter(({ checked }) => !checked)?.length ?? 0,
        [todos]);

    const filteredTodos = useMemo(() => {
        if (filter === 'All' || !todos) return todos;
        return todos.filter(({ checked }) => filter === 'Active' ? !checked : checked)
    }, [todos, filter]);

    useEffect(() => {
        list()
            .then(result => {
                setTodos(result);
            })
    }, []);

    repaint = () => {
        setTodos([...todos]);
    };

    return <section className={styles.todos}>
        <h1>Todos</h1>

        {!filteredTodos ?
            <Loader /> :
            <div className={styles.box}>
                <Form
                    onEnter={(title) => {
                        const todo = { title, checked: false };
                        todos.unshift(todo);
                        repaint();
                        create(todo)
                            .then(({ _id } = {}) => {
                                if (!_id) return;
                                todo._id = _id;
                                repaint();
                            })
                    }}
                    placeholder="What needs to be done?"
                />

                {filteredTodos.length > 0 && <ul>
                    {filteredTodos.map(({ title, checked, _id = null }, key) => <li key={key}>
                        {editing === _id ?
                            <Form value={title}
                                onBlur={() => {
                                    setEditing();
                                }}
                                onEnter={(newTitle) => {
                                    const todo = filteredTodos[key];
                                    todo.title = newTitle;
                                    setEditing();
                                    repaint();
                                    update(todo);
                                }} /> :
                            <>
                                <input type="checkbox" checked={checked} onChange={() => {
                                    const todo = filteredTodos[key];
                                    todo.checked = !checked;
                                    repaint();
                                    update(todo);
                                }} />
                                <span
                                    className={cn({
                                        [styles.done]: checked
                                    })}
                                    title="double click to edit"
                                    onDoubleClick={() => {
                                        setEditing(_id);
                                    }}>{title}</span>
                                <button className={styles.close} onClick={() => {
                                    const todo = filteredTodos[key];
                                    todos.splice(todos.indexOf(todo), 1);
                                    repaint();
                                    remove(todo);
                                }}>X</button>
                            </>
                        }
                    </li>)}
                </ul>}

                <div className={styles.footer}>
                    <span>{uncheckedItmCnt} {uncheckedItmCnt <= 1 ? 'item' : 'items'} left!</span>

                    {['All', 'Active', 'Completed'].map((f, k) => <span
                        key={k}
                        className={cn({
                            [styles.selected]: filter === f
                        })}
                        onClick={() => {
                            setFilter(f);
                        }}
                    >{f}</span>)}

                    <span onClick={() => {
                        const notCompleted = [];
                        for (const todo of todos) {
                            const { checked } = todo;
                            if (checked) {
                                remove(todo);
                            } else {
                                notCompleted.push(todo);
                            }
                        }
                        setTodos(notCompleted);
                    }}>Clear Completed</span>
                </div>
            </div>
        }
    </section>
}

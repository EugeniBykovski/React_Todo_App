import React, {Component} from 'react'

import AppHeader from '../app-header/app-header'
import SearchPanel from '../search-panel/search-panel'
import TodoList from '../todo-list/todo-list'
import ItemStatusFilter from '../item-status-filter/item-status-filter'
import ItemAddForm from '../item-add-form/item-add-form'

import './app.css';

export default class App extends Component {
    maxId = 100

    state = {
        todoData: [
            this.createTodoItem('Drink Coffee'),
            this.createTodoItem('Make Awesome App'),
            this.createTodoItem('Hav a lunch')
        ],
        term: '',
        filter: 'all' // active, all, done
    }

    // функция, которая умеет создавать новый элемент для нашего списка
    createTodoItem(label) {
        return {
            label,
            important: false,
            done: false,
            id: this.maxId++ // maxId никак не влияет на рендеринг
        }
    }

    deleteItem = (id) => {
        // удаляем элемент списка, передаем функцию, которая будет возвращать новое состояние
        this.setState(({todoData}) => {
            const idx = todoData.findIndex(el => el.id === id) // индекс элемента, который мы хотим удалять

            // [a, b, c, d, e] -> [a, b,  , d, e]
            const newArr = [
                ...todoData.slice(0, idx),
                ...todoData.slice(idx + 1)
            ]

            return {
                todoData: newArr
            }
        })
    }

    addItem = (text) => {
        // generate id
        const newItem = this.createTodoItem(text)

        // add element in array
        this.setState(({todoData}) => {
            const newArr = [
                ...todoData,
                newItem
            ]

            return {
                todoData: newArr
            }
        })
    }

    toggleProperty(arr, id, propName) {
        const idx = arr.findIndex(el => el.id === id) // индекс элемента, который мы хотим удалять

        // нужно обновить объект, который содержится в нужном месте в массиве
        const oldItem = arr[idx] // наш старый item
        const newItem = {
            ...oldItem,
            [propName]: !oldItem[propName] // кроме этого значения
        } // создали объект, у которого все те же свойства и значения, что и у oldItem

        // ! нужно сконструировать новый массив, поскольку мы не можем изменять существующий массив
        return [
            ...arr.slice(0, idx), // создаем новый массив со всеми значениями, которые были в старом массиве до того элемента, который мы хотим обновить
            newItem, // вставляем новый элемент, который точно такой же, как старый, только с противоположным значением done
            ...arr.slice(idx + 1) // затем вставялем все остальные элементы, которые идут после обновленного элемента
        ]
    }

    // функция, которая вызывается тогда, когда один из элементов стал done / important
    onToggleImportant = id => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'important')
            }
        })
    }

    onToggleDone = id => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'done')
            }
        })
    }

    onSearchChange = term => {
        this.setState({term})
    }

    onFilterChange = filter => {
        this.setState({filter})
    }

    search(items, term) {
        if (term.length === 0) {
            return items // если поле поиска пустое, то значит, что мы ничего не хотим искать
        }

        return items.filter((item) => {
            return item.label
                .toLowerCase()
                .indexOf(term.toLowerCase()) > -1; // больше 1 даст нам все те элементы, у которых label содержит строку term
        })
    }

    filter(items, filter) {
        switch(filter) {
            case 'all':
                return items
            case 'active':
                return items.filter(item => !item.done)
            case 'done':
                return items.filter(item => item.done)
            default:
                return items
        }
    }

    render() {
        const {todoData, term, filter} = this.state

        const visibleItems = this.filter(
            this.search(todoData, term), // сначала ищем
            filter // затем фильтруем
        )

        // получаем кол-во выполненных элементов
        const doneCount = todoData.filter(el => el.done).length // отфильтровали наш массив из state, создали новый массив, сохранили только те элементы, у которых есть значение done, затем мы посчитали длину массива
        const todoCount = todoData.length - doneCount

        return (
            <div className="todo-app">
                <AppHeader toDo={todoCount} done={doneCount} />

                <div className="top-panel d-flex">
                    <SearchPanel onSearchChange={this.onSearchChange} />
                    <ItemStatusFilter
                        filter={filter}
                        onFilterChange={this.onFilterChange}
                    />
                </div>

                <TodoList
                    todos={visibleItems}
                    onDeleted={this.deleteItem}
                    onToggleImportant={this.onToggleImportant}
                    onToggleDone={this.onToggleDone}
                />

                <ItemAddForm onItemAdded={this.addItem} />
            </div>
        );
    }
}

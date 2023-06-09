import './Home.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TodoList from './TodoList'
import Input from './Input'
import Search from './Search'

const URL = 'https://jsonplaceholder.typicode.com/todos'

const InitialInputData = {
  title: '',
  userId: '',
  completed: false,
}

const Home = () => {
  const [todos, setTodos] = useState([])
  const [showData, setShowData] = useState([])
  const [error, setError] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [inputData, setInputData] = useState(InitialInputData)
  const [edit, setEdit] = useState(false)
  const [search, setSearch] = useState('')

  const fetchTodos = async () => {
    // async await code
    try {
      const response = await axios.get(URL)
      setTodos(response.data)
      setShowData(response.data)
      setError(false)
    } catch (error) {
      setError(true)
      setTodos([])
      setShowData([])
    }

    // Promise code
    // axios
    //   .get(URL)
    //   .then((res) => console.log('PROMISE : ', res.data))
    //   .catch((err) => console.log('ERROR ', err))
  }

  const handleDeleteById = (id) => {
    console.log('ID : ', id)
    setShowData((prevState) => prevState.filter((todo) => todo.id !== id))
  }

  const handleCompletedTodos = () => {
    setShowData(todos.filter((item) => item.completed))
  }

  const handleIncompleteTodos = () => {
    setShowData(todos.filter((item) => !item.completed))
  }

  const handleShowAllTodos = () => {
    setShowData(todos)
  }

  const handleTodosAscendingOrder = () => {
    const tempTodos = todos.slice()
    setShowData(tempTodos.sort((a, b) => a.id - b.id))
  }

  const handleTodosDescendingOrder = () => {
    const tempTodos = todos.slice()
    setShowData(tempTodos.sort((a, b) => b.id - a.id))
  }

  const handleShowInputModel = () => {
    setShowInput(true)
  }

  const handleCloseInputModel = () => {
    setShowInput(false)
  }

  const handleAddTodo = () => {
    if (!edit) {
      setTodos((prevState) => [
        ...prevState,
        { ...inputData, id: todos.length + 1 },
      ])
      setShowData((prevState) => [
        ...prevState,
        { ...inputData, id: todos.length + 1 },
      ])
    } else {
      const tempTodos = todos.slice()
      tempTodos.forEach((item) => {
        if (item.id === inputData.id) {
          item.userId = inputData.userId
          item.title = inputData.title
          item.completed = inputData.completed
        }
      })
      setTodos(tempTodos)
      setShowData(tempTodos)
      setEdit(false)
    }

    setInputData(InitialInputData)
    setShowInput(false)
  }

  const handleCancelTodo = () => {
    setInputData(InitialInputData)
    setShowInput(false)
  }

  const handleEdit = (id) => {
    setEdit(true)
    setShowInput(true)
    const todo = todos.find((item) => item.id === id)
    setInputData(todo)
  }

  const handleSearch = (value) => {
    if (value === '') {
      setShowData(todos)
    } else {
      setShowData((prevState) =>
        prevState.filter((item) => item?.title?.includes(value))
      )
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className='home'>
      <h1>Welcome to our crud app</h1>
      <div>
        <Search handleSearch={handleSearch} search={search} />
        <button onClick={handleShowAllTodos}>Show All Todos</button>
        <button onClick={handleCompletedTodos}>Show Completed Todos</button>
        <button onClick={handleIncompleteTodos}>Show Incomplete Todos</button>
        <button onClick={handleTodosAscendingOrder}>
          Ascending Order of Ids
        </button>
        <button onClick={handleTodosDescendingOrder}>
          Descending order of Ids
        </button>
        <button onClick={handleShowInputModel}>Show Input Model</button>
        <button onClick={handleCloseInputModel}>Close the Input Model</button>
      </div>
      {showInput && (
        <Input
          inputData={inputData}
          setInputData={setInputData}
          handleAddTodo={handleAddTodo}
          handleCancelTodo={handleCancelTodo}
        />
      )}
      <div className='todos-list'>
        <TodoList
          todoList={showData}
          handleDeleteById={handleDeleteById}
          handleEdit={handleEdit}
        />
      </div>
    </div>
  )
}

export default Home

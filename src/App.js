import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: ''
  })

  useEffect(() => {
    getUsers()
  }, [])

  // get users
  const getUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users')
      setUsers(response.data)
      setIsLoading(false)
    } catch (err) {
      setError('Failed to fetch users!')
      setIsLoading(false)
    }
  }

  // input change handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // add new user
  const addUser = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/users', formData)
      setUsers([...users, {...formData, id: users.length + 1}])
      setShowForm(false)
      setFormData({ name: '', email: '', department: '' })
    } catch (err) {
      setError('Failed to add user!')
    }
  }

  // delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      // remove user from state
      setUsers(users.filter(user => user.id !== id))
    } catch (err) {
      setError('Failed to delete user!')
    }
  }

  // edit user
  const updateUser = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${editUser.id}`, formData)
      // updating users
      setUsers(users.map(user => 
        user.id === editUser.id ? {...formData, id: editUser.id} : user
      ))
      setEditUser(null)
      setFormData({ name: '', email: '', department: '' })
    } catch (err) {
      setError('Failed to update user!')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="App">
      <h1>User Management</h1>
      
      <button onClick={() => setShowForm(true)}>Add New User</button>

      {(showForm || editUser) && (
        <form onSubmit={editUser ? updateUser : addUser}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
          />
          <button type="submit">
            {editUser ? 'Update User' : 'Add User'}
          </button>
          <button onClick={() => {
            setShowForm(false)
            setEditUser(null)
          }}>Cancel</button>
        </form>
      )}

      <div className="users-list">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Department: {user.department || 'N/A'}</p>
            <button onClick={() => {
              setEditUser(user)
              setFormData({
                name: user.name,
                email: user.email,
                department: user.department || ''
              })
            }}>Edit</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
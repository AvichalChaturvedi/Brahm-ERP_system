import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function App() {
  const [page, setPage] = useState('login')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [tasks, setTasks] = useState([])
  const [boms, setBoms] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      fetchUser()
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const res = await API.get('/auth/me')
      setUser(res.data)
      setPage('dashboard')
    } catch (err) {
      localStorage.removeItem('token')
      setToken(null)
      setPage('login')
    }
  }

  const login = async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value
    setLoading(true)
    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.access_token)
      setToken(res.data.access_token)
      setUser(res.data.user)
      setPage('dashboard')
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const signup = async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value
    const full_name = e.target.full_name.value
    setLoading(true)
    try {
      const res = await API.post('/auth/register', { email, password, full_name })
      localStorage.setItem('token', res.data.access_token)
      setToken(res.data.access_token)
      setUser(res.data.user)
      setPage('dashboard')
      e.target.reset()
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setPage('login')
  }

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks')
      setTasks(res.data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    }
  }

  const fetchBoms = async () => {
    try {
      const res = await API.get('/boms')
      setBoms(res.data)
    } catch (err) {
      console.error('Failed to fetch BOMs:', err)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users')
      setUsers(res.data)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  const createTask = async (e) => {
    e.preventDefault()
    const title = e.target.title.value
    const description = e.target.description.value
    const assigned_to = e.target.assigned_to.value
    const priority = e.target.priority.value
    try {
      await API.post('/tasks', {
        title,
        description,
        assigned_to: assigned_to ? parseInt(assigned_to) : null,
        priority
      })
      fetchTasks()
      e.target.reset()
      alert('Task created!')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create task')
    }
  }

  const updateTaskStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status })
      fetchTasks()
    } catch (err) {
      alert('Failed to update task')
    }
  }

  const addUser = async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const full_name = e.target.full_name.value
    const password = e.target.password.value
    try {
      await API.post('/admin/users', {
        email,
        full_name,
        password,
        is_admin: false
      })
      fetchUsers()
      e.target.reset()
      alert('User added!')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add user')
    }
  }

  const uploadBOM = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.file.files[0])
    formData.append('project_name', e.target.project_name.value)
    try {
      await API.post('/boms/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      fetchBoms()
      e.target.reset()
      alert('BOM uploaded and pricing queried!')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to upload BOM')
    }
  }

  const syncGitHub = async () => {
    setLoading(true)
    try {
      await API.post('/github/sync', {
        github_username: user.github_username
      })
      alert('GitHub sync completed!')
    } catch (err) {
      alert(err.response?.data?.error || 'GitHub sync failed')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Hardware Portal</h1>
          {page === 'login' ? (
            <>
              <h2>Login</h2>
              <form onSubmit={login}>
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
              </form>
              <p>Don't have an account? <a href="#" onClick={() => setPage('signup')}>Sign up</a></p>
            </>
          ) : (
            <>
              <h2>Sign Up</h2>
              <form onSubmit={signup}>
                <input type="text" name="full_name" placeholder="Full Name" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
              </form>
              <p>Already have an account? <a href="#" onClick={() => setPage('login')}>Login</a></p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">Hardware Portal</div>
        <div className="nav-menu">
          {user?.is_admin && (
            <>
              <button className={page === 'dashboard' ? 'active' : ''} onClick={() => setPage('dashboard')}>Dashboard</button>
              <button className={page === 'tasks' ? 'active' : ''} onClick={() => { setPage('tasks'); fetchTasks() }}>Tasks</button>
              <button className={page === 'bom' ? 'active' : ''} onClick={() => { setPage('bom'); fetchBoms() }}>BOM</button>
              <button className={page === 'github' ? 'active' : ''} onClick={() => setPage('github')}>GitHub</button>
              <button className={page === 'team' ? 'active' : ''} onClick={() => { setPage('team'); fetchUsers() }}>Team</button>
            </>
          )}
          {!user?.is_admin && (
            <>
              <button className={page === 'my-tasks' ? 'active' : ''} onClick={() => { setPage('my-tasks'); fetchTasks() }}>My Tasks</button>
              <button className={page === 'github' ? 'active' : ''} onClick={() => setPage('github')}>GitHub</button>
            </>
          )}
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="container">
        {page === 'dashboard' && user?.is_admin && (
          <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{users.length}</div>
                <div className="stat-label">Team Members</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{tasks.length}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{boms.length}</div>
                <div className="stat-label">BOMs</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">Ready</div>
                <div className="stat-label">System Status</div>
              </div>
            </div>
          </div>
        )}

        {page === 'tasks' && (
          <div className="section">
            <h1>Task Management</h1>
            <form className="form-card" onSubmit={createTask}>
              <h3>Create New Task</h3>
              <input type="text" name="title" placeholder="Task Title" required />
              <textarea name="description" placeholder="Description" rows="3"></textarea>
              <select name="assigned_to">
                <option value="">Assign to...</option>
                {users.filter(u => !u.is_admin).map(u => (
                  <option key={u.id} value={u.id}>{u.full_name}</option>
                ))}
              </select>
              <select name="priority">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button type="submit">Create Task</button>
            </form>

            <div className="tasks-list">
              <h3>All Tasks</h3>
              {tasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                  </div>
                  <p>{task.description}</p>
                  <select value={task.status} onChange={(e) => updateTaskStatus(task.id, e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="task-footer">
                    <small>Assigned to: {task.assigned_user?.full_name || 'Unassigned'}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'my-tasks' && !user?.is_admin && (
          <div className="section">
            <h1>My Tasks</h1>
            <div className="tasks-list">
              {tasks.filter(t => t.assigned_to === user.id).map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                  </div>
                  <p>{task.description}</p>
                  <div className="task-footer">
                    <small>Status: {task.status}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'bom' && (
          <div className="section">
            <h1>BOM Management</h1>
            <form className="form-card" onSubmit={uploadBOM}>
              <h3>Upload BOM (CSV)</h3>
              <input type="text" name="project_name" placeholder="Project Name" required />
              <input type="file" name="file" accept=".csv" required />
              <button type="submit">Upload & Query Pricing</button>
            </form>

            <div className="bom-list">
              <h3>Your BOMs</h3>
              {boms.map(bom => (
                <div key={bom.id} className="bom-card">
                  <h4>{bom.name}</h4>
                  <p>Project: {bom.project_name}</p>
                  <p>Parts: {bom.parts.length}</p>
                  <details>
                    <summary>View Parts & Pricing</summary>
                    <table className="bom-table">
                      <thead>
                        <tr>
                          <th>MPN</th>
                          <th>Qty</th>
                          <th>OctoParts</th>
                          <th>JLC</th>
                          <th>Lion</th>
                          <th>Best Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bom.parts.map(part => (
                          <tr key={part.id}>
                            <td>{part.mpn}</td>
                            <td>{part.quantity}</td>
                            <td>${part.octoparts_price?.toFixed(2) || 'N/A'}</td>
                            <td>${part.jlc_price?.toFixed(2) || 'N/A'}</td>
                            <td>${part.lion_price?.toFixed(2) || 'N/A'}</td>
                            <td>
                              <strong>${part.best_price?.toFixed(2) || 'N/A'}</strong>
                              <small>({part.best_supplier})</small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                  <button className="order-btn">Place Order</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'github' && (
          <div className="section">
            <h1>GitHub Integration</h1>
            <div className="form-card">
              <h3>Set GitHub Username</h3>
              <form onSubmit={(e) => {
                e.preventDefault()
                const gh_username = e.target.gh_username.value
                if (gh_username) {
                  setUser({...user, github_username: gh_username})
                  e.target.reset()
                  alert('GitHub username updated')
                }
              }}>
                <input type="text" name="gh_username" placeholder="GitHub username" defaultValue={user?.github_username || ''} />
                <button type="submit">Set Username</button>
              </form>
            </div>

            <div className="form-card" style={{ marginTop: '2rem' }}>
              <h3>Sync GitHub Activity</h3>
              <p>Current: {user?.github_username || 'Not set'}</p>
              <button onClick={syncGitHub} disabled={loading || !user?.github_username}>
                {loading ? 'Syncing...' : 'Sync Latest Commits'}
              </button>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                Sync your latest commits and releases from GitHub.
              </p>
            </div>
          </div>
        )}

        {page === 'team' && user?.is_admin && (
          <div className="section">
            <h1>Team Management</h1>
            <form className="form-card" onSubmit={addUser}>
              <h3>Add Team Member</h3>
              <input type="text" name="full_name" placeholder="Full Name" required />
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Temporary Password" required />
              <button type="submit">Add Member</button>
            </form>

            <div className="users-list">
              <h3>Team Members</h3>
              {users.map(u => (
                <div key={u.id} className="user-card">
                  <h4>{u.full_name}</h4>
                  <p>{u.email}</p>
                  <small>{u.is_admin ? 'Admin' : 'Member'}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

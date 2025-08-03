"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      navigate("/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchData(token)
  }, [navigate])

  const fetchData = async (token) => {
    try {
      // Fetch users (only for managers)
      const usersResponse = await fetch("/api/v1/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.data.users)
      }

      // Fetch teams
      const teamsResponse = await fetch("/api/v1/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json()
        setTeams(teamsData.data.teams)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "GET",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      navigate("/login")
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>
            Welcome, {user?.name} ({user?.role})
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="section">
          <h2>Profile Information</h2>
          <div className="profile-card">
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong> {user?.role}
            </p>
            <p>
              <strong>Reference ID:</strong> {user?.refId}
            </p>
          </div>
        </div>

        {user?.role === "manager" && (
          <div className="section">
            <h2>All Users</h2>
            <div className="users-list">
              {users.map((u) => (
                <div key={u._id} className="user-card">
                  <p>
                    <strong>{u.name}</strong>
                  </p>
                  <p>Email: {u.email}</p>
                  <p>Role: {u.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="section">
          <h2>Teams</h2>
          <div className="teams-list">
            {teams.length > 0 ? (
              teams.map((team) => (
                <div key={team._id} className="team-card">
                  <h3>{team.name}</h3>
                  <p>{team.description}</p>
                  <p>
                    <strong>Manager:</strong> {team.manager?.name}
                  </p>
                </div>
              ))
            ) : (
              <p>No teams available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

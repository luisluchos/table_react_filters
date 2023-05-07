import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types'
import { UsersList } from './assets/components/UsersList'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const originalUsers = useRef<User[]>([])
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const toggleColors = () => {
    setShowColors(!showColors)
  }
  const toggleCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }
  const deleteUsers = () => {
    setUsers([])
  }

  const handleDeleteUser = (id: string) => {
    const newUsers = users.filter((user) => user.login.uuid !== id)
    setUsers(newUsers)
  }

  const handleResetUsers = () => {
    setUsers(originalUsers.current)
  }

  const getUsers = async () => {
    const response = await fetch('https://randomuser.me/api?results=100')
    const data = await response.json()
    setUsers(data.results)
    originalUsers.current = data.results
  }

  const filteredUsers = useMemo(() => {
    return typeof filterCountry === 'string' && filterCountry.length > 0
      ? users.filter((user) => {
          return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
        })
      : users
  }, [users, filterCountry])
  /**
   *
   */
  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers
    if (sorting === SortBy.COUNTRY) {
      return [...filteredUsers].sort((a, b) => {
        return a.location.country.localeCompare(b.location.country)
      })
    }
    if (sorting === SortBy.NAME) {
      return [...filteredUsers].sort((a, b) => {
        return a.name.first.localeCompare(b.name.first)
      })
    }
    if (sorting === SortBy.LAST) {
      return [...filteredUsers].sort((a, b) => {
        return a.name.last.localeCompare(b.name.last)
      })
    }

    /*  const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: (user) => user.location.country,
      [SortBy.NAME]: (user) => user.name.first,
      [SortBy.LAST]: (user) => user.name.last
    }

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      console.log('A', extractProperty(a))
      return extractProperty(a).localeCompare(extractProperty(b))
    })  */
  }, [filteredUsers, sorting])

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  useEffect(() => {
    getUsers().catch((error) => {
      console.log(error)
    })
  }, [])

  return (
    <>
      <h1>Prueba técnica</h1>
      <header>
        <button onClick={toggleColors}>Show colors</button>
        <button onClick={toggleCountry}>Ordenar por pais</button>
        <button onClick={deleteUsers}>Delete Users</button>
        <button onClick={handleResetUsers}>Reset Users</button>
        <input
          placeholder='Filtrar por pais'
          onChange={(e) => {
            setFilterCountry(e.target.value)
          }}
        />
      </header>
      <UsersList
        changeSorting={handleChangeSort}
        showColors={showColors}
        users={sortedUsers}
        deleteUser={handleDeleteUser}
      />
    </>
  )
}

export default App

import { SortBy, type User } from '../../types'

interface Props {
  users: User[]
  showColors: boolean
  deleteUser: (id: string) => void
  changeSorting: (sort: SortBy) => void
}
export const UsersList = ({ changeSorting, showColors, users, deleteUser }: Props) => {
  return (
    <div>
      <table width='100%' className={showColors ? 'table--showColors' : 'table'}>
        <thead>
          <tr>
            <th>Foto</th>
            <th
              className='pointer'
              onClick={() => {
                changeSorting(SortBy.NAME)
              }}
            >
              Nombre
            </th>
            <th
              className='pointer'
              onClick={() => {
                changeSorting(SortBy.LAST)
              }}
            >
              Apellido
            </th>
            <th
              className='pointer'
              onClick={() => {
                changeSorting(SortBy.COUNTRY)
              }}
            >
              Pais
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.login.uuid}>
                <img src={user.picture.thumbnail} alt={user.name.first} />
                <td>{user.name.first}</td>
                <td>{user.name.last}</td>
                <td>{user.location.country}</td>
                <td>
                  <button
                    onClick={() => {
                      deleteUser(user.login.uuid)
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

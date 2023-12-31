import { useQuery } from '@apollo/client'
import { GET_USER, BOOKS_BY_GENRE } from '../queries'

const Recommended = ({ genre, show }) => {
  const user = useQuery(GET_USER)
  const result = useQuery(BOOKS_BY_GENRE, { variables: { genre: genre }, fetchPolicy: 'network-only' })

  if (!show) {
    return null
  }

  if (user.loading || result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.booksByGenre
  const name = user.data.me.username

  if (books.length === 0) {
    return (
      <div>
        <h2>recommendations for { name }</h2>
        <div>
          <p>No books in your favorite genre: <strong>{ genre }</strong></p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>recommendations for { name }</h2>
      <div>
        <p>books in your favorite genre: <strong>{ genre }</strong></p>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended

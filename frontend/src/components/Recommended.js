import { useQuery } from '@apollo/client'
import { GET_USER, ALL_BOOKS } from '../queries'

const Recommended = ({ show }) => {
  const user = useQuery(GET_USER)
  const result = useQuery(ALL_BOOKS)

  if (!show) {
    return null
  }

  if (user.loading || result.loading) {
    return <div>loading...</div>
  }

  const genre = user.data.me.favoriteGenre
  const books = result.data.allBooks
  const genreBooks = books.filter(b => b.genres.includes(genre))

  if (genreBooks.length === 0) {
    return (
      <div>
        <h2>recommendations</h2>
        <div>
          <p>No books in your favorite genre: <strong>{genre}</strong></p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        <p>books in your favorite genre: <strong>{genre}</strong></p>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {genreBooks
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

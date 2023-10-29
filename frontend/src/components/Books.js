import { useQuery } from '@apollo/client'
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries'
import { useState } from 'react'

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState('')
  const result = useQuery(ALL_BOOKS)
  const genreResult = useQuery(BOOKS_BY_GENRE, { variables: { genre: selectedGenre }, fetchPolicy: 'network-only' })

  if (!show) {
    return null
  }

  if (result.loading || genreResult.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const genreBooks = genreResult.data.booksByGenre

  const allGenres = []
  books.forEach(b => {
    b.genres.forEach(g => {
      if (!allGenres.includes(g)) {
        allGenres.push(g)
      }
    })
  })

  const booksToShow = selectedGenre === '' ? books : genreBooks
  const genre = selectedGenre === '' ? 'All Genres' : selectedGenre

  return (
    <div>
      <h2>books</h2>
      <div>
        <p>in genre: <strong>{genre}</strong></p>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow
            .map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <button  onClick={() => setSelectedGenre('')}>All Genres</button>
        {allGenres.map(g =>
          <button key={g} value={g} onClick={() => setSelectedGenre(g)}>{g}</button>
        )}
      </div>
    </div>
  )
}

export default Books

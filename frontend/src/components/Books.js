import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('All Genres')
  const result = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  console.log('Books result:', result)
  const books = result.data.allBooks

  const allGenres = []
  books.forEach(b => {
    b.genres.forEach(g => {
      if (!allGenres.includes(g)) {
        allGenres.push(g)
      }
    })
  })

  return (
    <div>
      <h2>books</h2>
      <div>
        <p>in genre: <strong>{selectedGenre}</strong></p>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter(b => b.genres.includes(selectedGenre) || selectedGenre === 'All Genres')
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <button value={'All Genres'} onClick={() => setSelectedGenre('All Genres')}>All Genres</button>
        {allGenres.map(g =>
          <button key={g} value={g} onClick={() => setSelectedGenre(g)}>{g}</button>
        )}
      </div>
    </div>
  )
}

export default Books

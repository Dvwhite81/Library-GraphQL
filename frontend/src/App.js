import { useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import Notification from './components/Notification'
import { GET_USER } from './queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter(item => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const userResult = useQuery(GET_USER)
  if (userResult.loading) {
    return <div>loading...</div>
  }
  const favoriteGenre = userResult.data.me.favoriteGenre

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <Notification notify={notify} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} notify={notify} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommended')}>recommended</button>
      </div>
      <Notification errorMessage={errorMessage} />
      <button onClick={logout}>logout</button>
      <Authors notify={notify} show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook notify={notify} show={page === 'add'} />

      <Recommended genre={favoriteGenre} show={page === 'recommended'} />
    </div>
  )
}

export default App

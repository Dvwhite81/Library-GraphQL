import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, SET_BIRTHYEAR } from '../queries'

const BirthyearForm = ({ notify, authors }) => {
  const options = []
  authors.forEach(a => {
    options.push(
      { value: a.name, label: a.name }
    )
  })

  console.log('options:', options)

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      notify(messages)
    }
  })

  const submit = (event) => {
    event.preventDefault()
    editAuthor({ variables: { name, born } })
    console.log('set birthyear')

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map(a => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born <input value={born} onChange={({ target }) => setBorn(parseInt(target.value))} />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default BirthyearForm

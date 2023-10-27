require('dotenv').config()
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('../models/author')
const Book = require('../models/book')
const User = require('../models/user')

const resolvers = {
  Query: {
    bookCount: async () => {
      const books = await Book.find({})
      return books.length
    },
    authorCount: async () => {
      const authors = await Author.find({})
      return authors.length
    },
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate('author')
      if (!args.author && !args.genre) {
        return books
      }
      if (args.author && !args.genre) {
        return books.filter(b => b.author.name === args.author)
      }
      if (!args.author && args.genre) {
        return books.filter(b => b.genres.includes(args.genre))
      }
      if (args.author && args.genre) {
        return books.filter(b => b.author.name === args.author && b.genres.includes(args.genre))
      }
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      return authors
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id })
      return books.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error: 'no context.currentUser'
          }
        })
      }


      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author, born: undefined })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }

      const book = new Book({
        ...args,
        author
      })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error: 'no context.currentUser'
          }
        })
      }
      const author = await Author.findOne({ name: args.name })
      console.log('resolvers author:', author)

      try {
        author.born = args.setBornTo
        console.log('resolvers author 2:', author)
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
      return author
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
        password: 'secret'
      })

      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
}

module.exports = resolvers

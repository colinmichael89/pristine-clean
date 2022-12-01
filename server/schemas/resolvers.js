const { AuthenticationError } = require('apollo-server-express');
const { User, Book, Thought, Location } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async (parent, args, context) => {
      // if (context.user) {
      return User.find().populate('locations');
      // }
      // throw new AuthenticationError("You need to be logged in!");
    },
    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },
    books: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Book.find(params).sort({ createdAt: -1 });
    },
    me: async (parent, { _id }, context) => {
      // if (context.user) {
      return User.findById({ _id }).populate('locations');;
      // }
      // throw new AuthenticationError("You need to be logged in!");
    },

    thoughts: async () => {
      return Thought.find().sort({ createdAt: -1 });
    },

    thought: async (parent, { thoughtId }) => {
      return Thought.findOne({ _id: thoughtId });
    },

    locations: async () => {
      return Location.find().sort({ createdAt: -1 });
    },

    location: async (parent, { locationId }) => {
      console.log('resolve js line 38 = ', locationId);

      return Location.findOne({ _id: locationId });
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email }).populate('books');

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addBook: async (
      parent,
      {
        _id,
        bookId,
        authors,
        description,
        image,
        title,
        infoLink,
        previewLink,
        publishedDate,
      },
      context
    ) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id },
          {
            $addToSet: {
              savedBooks: {
                bookId: bookId,
                authors,
                description,
                image,
                title,
                infoLink,
                previewLink,
                publishedDate,
              },
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, { _id, bookId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id },
          {
            $pull: {
              savedBooks: {
                bookId: bookId,
              },
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    updateAvailability: async (parent, {
      _id,
      username,
      mondayAm,
      mondayPm,
      tuesdayAm,
      tuesdayPm,
      wednesdayAm,
      wednesdayPm,
      thursdayAm,
      thursdayPm,
      fridayAm,
      fridayPm,
      saturdayAm,
      saturdayPm,
      sundayAm,
      sundayPm
    },
      context) => {
      // if (context.user) {
      return User.findOneAndUpdate(
        { _id },
        {
          availability: {
            mondayAm,
            mondayPm,
            tuesdayAm,
            tuesdayPm,
            wednesdayAm,
            wednesdayPm,
            thursdayAm,
            thursdayPm,
            fridayAm,
            fridayPm,
            saturdayAm,
            saturdayPm,
            sundayAm,
            sundayPm,
          }
        },
        { new: true }
      );
      // }
      // throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;

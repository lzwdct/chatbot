//import { extractFragmentReplacements } from 'prisma-binding'
const { Query } = require('./Query')
const { Mutation } = require('./Mutation')
//import Subscription from './Subscription'
//import User from './User'
//import Post from './Post'
//import Comment from './Comment'

const resolvers = {
    Query,
    Mutation
}

//const fragmentReplacements = extractFragmentReplacements(resolvers)

module.exports.resolvers = resolvers;
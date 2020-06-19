
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { getUserId } = require('../utils/getUserId')

const Query = {
    menu: async (parent, args, ctx, info) => {
        getUserId(ctx.request)
        let opArgs = {
            
        }
        if (args) {
            opArgs.where = {
                OR: [{
                    ...args
                }]
            }
        }

        return prisma.menu.findMany(opArgs);
    },
    shop: async (parent, args, ctx, info) => {
        let opArgs = {
            
        }
        if (args) {
            opArgs.where = {
                OR: [{
                    ...args
                }]
            }
        }
        return await prisma.shop.findMany(opArgs)
    }
}

module.exports.Query = Query;
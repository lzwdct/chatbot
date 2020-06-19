const bcrypt = require('bcryptjs')
const { getUserId } = require('../utils/getUserId')
const { generateToken } = require('../utils/generateToken')
const { hashPassword } = require('../utils/hashPassword')

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const Mutation = {
    async createUser(parent, args, ctx, info) {
        const password = await hashPassword(args.data.password)
        const user = await prisma.user.create({
            data: {
                ...args.data,
                password
            }
        })

        const token = generateToken(user.id);

        return {
            user,
            token
        }
    },
    async login(parent, args, ctx, info) {
        const [user] = await prisma.user.findMany({
            where: {
                username : args.where.username
            }
        })

        if (!user) {
            throw new Error('Unable to login')
        }

        const isMatch = await bcrypt.compare(args.where.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async deleteUser(parent, args, ctx, info) {
        const userId = getUserId(ctx.request)

        return prisma.user.delete({
            where: {
                id: userId
            }
        })
    },
    async createShop(parent, args, ctx, info) {
        getUserId(ctx.request)

        const shop = await prisma.shop.create({
            data: {
                ...args.data
            }
        })

        return {
            ...shop
        }
    },
    async updateShop(parent, args, ctx, info) {
        getUserId(ctx.request)

        const shop = await prisma.shop.update({
            data: {
                ...args.data
            },
            where: {
                ...args.where
            }
        })

        return shop
    },
    async deleteShop(parent, args, ctx, info) {
        getUserId(ctx.request)

        return prisma.shop.delete({
            where: {
                idshop: args.where.idshop
            }
        })
    },
    async addMenu(parent, args, ctx, info) {
        getUserId(ctx.request)

        const [menu] = await prisma.menu.findMany({
            where: {
                menu_name : args.data.menu_name
            }
        })

        if(menu){
            const shop_menu = await prisma.shop_menu.create({
                data: {
                    menu: {
                        connect: {
                            idmenu: menu.idmenu
                        }
                    },
                    shop: {
                        connect: {
                            idshop: args.data.idshop
                        }
                    }
                }
            })

            return {
                menu
            }
        }else{
            const menu = await prisma.menu.create({
                data: {
                    menu_name : args.data.menu_name
                }
            })

            const shop_menu = await prisma.shop_menu.create({
                data: {
                    menu: {
                        connect: {
                            idmenu: menu.idmenu
                        }
                    },
                    shop: {
                        connect: {
                            idshop: args.data.idshop
                        }
                    }
                }
            })

            return {
                menu
            }
        }
    },
    async getMenu(parent, args, ctx, info){
        const menu_ids = await prisma.shop_menu.findMany({
            where: {
                shop_id: args.where.shop_id
            }
        })

        const menu_id = menu_ids.map(item => item.menu_id);

        const menus = await Promise.all(menu_id.map(async (item) => {
            const [menu] = await prisma.menu.findMany({
                where: {
                    idmenu : item
                }
            })
            return menu
        }))

        return menus

    },
    async deleteMenu(parent, args, ctx, info) {
        getUserId(ctx.request)

        const { count } = await prisma.shop_menu.deleteMany({
            where: {
                AND : [
                    {menu_id: args.where.menu_id},
                    {shop_id: args.where.shop_id}
                ]
                
            }
        })
        
        if(count){
            return {
                ...args.where
            }
        }

        return {
            menu_id: null,
            shop_id: null
        }
    }
}

module.exports.Mutation = Mutation;
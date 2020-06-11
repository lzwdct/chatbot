const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class Log{
    async saveLog(text){
		await prisma.search_sentence.create({
			data: {
				sentence: text
			},
		})
	}
}

exports.Log = Log;
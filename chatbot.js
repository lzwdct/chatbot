'use strict';

const { Chatbot } = require('./src/chatbot');
const { Log } = require('./src/log');
const { Thumbnail } = require('./src/thumbnail');

module.exports.chatbot = async (event, context) => {
    const request = JSON.parse(event.body);
    const content = request["userRequest"]["utterance"];
    //const content = '@비빔냉면';

    const chatbot = new Chatbot();
    const saveLog = new Log();
    const thumbnail = new Thumbnail();

    const result = await chatbot.chat(content);
    saveLog.saveLog(content);
    const image = await thumbnail.getRandomThumbnail();
    let simpleText;

    if(typeof result === "object"){
        const buttons = result.map((item) => {
            return {
                "action": "message",
                "label": item,
                "messageText": encodeURIComponent(item)
            }
        });

        simpleText = {
            "basicCard": {
                "title": `${content} 의 검색 결과 입니다`,
                "description": `아래 원하시는 정보를 눌러주세요.`,
                "thumbnail": {
                    "imageUrl": image
                },
                "buttons" : [
                    ...buttons
                ]
            }
        }
    }else{
        simpleText = {
            "simpleText":{
                "text": result
            }
        }
    }
    const response = {
        "version": "2.0",
        "template": {
            "outputs": [simpleText]
        }
    }
    context.callbackWaitsForEmptyEventLoop = false
    return {
        statusCode: 200,
        body: JSON.stringify(response)
      };
};


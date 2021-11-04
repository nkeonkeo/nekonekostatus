"use strict";
// const config=require("../config");
// const db=require("../database")();
const TelegramBot = require('node-telegram-bot-api');
module.exports=(token,chatIds)=>{
const bot=new TelegramBot(token,{});
function isPm(msg){return msg.from.id==msg.chat.id;}
var Masters=new Set();
// console.log(masters);
// for(var chatId of masters)Masters.add(chatId);
async function notice(str){
    for(var chatId of chatIds){
        try{
            await bot.sendMessage(chatId,str);
        } catch(e){}
    }
}
var funcs={
    isPm,
    notice,
    // Masters,
},cmds=[];
for(var mod of [])cmds.push.apply(cmds,mod(bot,funcs,db));
return {
    bot,
    funcs,
    cmds
}
}
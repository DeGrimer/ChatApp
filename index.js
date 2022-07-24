const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors');
app.use(cors());

const io = new Server(server, {
    cors:  {
        origin: "http://localhost:3000",
        methods: ['GET','POST',]
    },
});

async function getLastMessage() {
    let lastTime = Date.now() - (60000*5);
    lastTime = new Date(lastTime).toISOString();
    const info = await prisma.message.findMany({
        where : {
            sentAt : {
                gte : lastTime,
            },
        },
    });
    return info;
}
async function main() {    
    io.on('connection', async (socket) => {
        let lastMessage = getLastMessage();
        lastMessage.then(function(result) {
            io.emit('show message',result);
        })
        socket.on('disconnect', () => {
        });
        socket.on('chat message', async (msg, author = 'noname') => {
            await prisma.message.create({
                data : {
                    content : msg,
                    nickname : author,
                }
            })
            io.emit('chat message', msg, author);
            console.log('messsage: ' + msg);
        });
    })
    
    server.listen(3001, () =>{
        console.log('listening on *:3001');
    })
  }
  
  main()
    .catch((e) => {
      throw e
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
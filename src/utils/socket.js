
const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../model/chat");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex")
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",   // your frontend URL

        }
    });


    // Start listening / Accepting to connections
    io.on("connection", (socket) => {


        //handle Events


        socket.on("joinChat", ({ firstName, lastName, userId, targetUserId }) => {
            const room = getSecretRoomId(userId, targetUserId);
            console.log(firstName + " : " + "Joined Room : " + room);
            socket.join(room);
        })
        socket.on("sendMessage", async ({ firstName, userId, lastName, targetUserId, text }) => {
            // Save MEssage to DataBase
            try {
                const roomId = getSecretRoomId(userId, targetUserId);
                console.log(firstName + " : " + text);

                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                });

                if (!chat) {
                    chat = await new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    });
                }

                chat.messages.push({ senderId: userId, text });

                await chat.save();
                io.to(roomId).emit("messageRecieved", { firstName, lastName, text })

            }
            catch (err) {
                console.log(err);
            }

        })
        socket.on("disconnect", () => {

        })
    })
}


module.exports = initializeSocket;
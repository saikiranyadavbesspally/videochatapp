const express = require("express")
const app = new express();
const server = require("http").createServer(app);
const cors = require("cors")
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


app.use(cors());
const port = process.env.PORT || 4500;




app.get("/", (req, res) => {
    res.send("server is running");
})



// sending to or sharing the details
io.on('connection', (socket) => {
    socket.emit('me', socket.id);
    socket.on('disconnect', () => {
        socket.broadcast.emit("callended")
    });

    socket.on("callUser", ({ usertocall, signaldata, from, name }) => {
        io.to(usertocall).emit("calluser", { signal: signaldata, from, name })

    })

    socket.on("answercall",(data)=>{
        io.to(data.to).emit("callaccepted",data.signal)
    });

});




server.listen(port, () => {
    console.log(`server is listening in http://localhost:${port}`)
})

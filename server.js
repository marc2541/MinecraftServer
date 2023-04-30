import { WebSocketServer } from 'ws';
import express from 'express';
import expressWs from 'express-ws';


const wss = new WebSocketServer({ port: 8080 });
const app = express()
var expressWSS = expressWs(app);
const port = 3000
var str = "basic";




wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.send('something');
    ws.on('message', function message(msg) {
        app.emit('websocket_message', msg);
        console.log('received: %s', msg);
    });
  
    
  });

app.use(express.static('public'))
app.use(express.json())
app.enable('trust proxy')

app.use(function(request, response, next) {

    if (process.env.NODE_ENV != 'development' && !request.secure) {
       return response.redirect("https://" + request.headers.host + request.url);
    }

    next();
})

app.use((req, res, next) => {
    console.log('Middleware executed');
    next();
  });

app.on('websocket_message', (message) => {
    str = message.toString();
    console.log(`WebSocket message received: ${str}`);
    // Handle the message here
  });

app.get('/info/:dynamic', (req, res) => {
    const { dynamic } = req.params
    const { key } = req.query
    console.log(dynamic, key)
    res.status(200).json({info: str})
})

/*app.post('/', (req, res) => {
    const { parcel }  = req.body
    console.log(parcel)
    if (!parcel) {
        return res.status(400).send({status: 'error'})
    }
    res.status(200).json({status: 'received' })
})
*/
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
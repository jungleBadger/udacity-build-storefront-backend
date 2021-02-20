
import * as dotenv from "dotenv";
let dotEnvProps: any = {"silent": true};
dotenv.config(dotEnvProps);

import * as express from 'express'
import * as bodyParser from 'body-parser'

const app: express.Application = express()


app.use(bodyParser.json())

app.get('/', function (req: express.Request, res: express.Response) {
    res.send('Hello xWorld!')
})

app.listen(process.env.APP_PORT, function () {
    console.log(`Server started at port: ${process.env.APP_PORT}`)
})

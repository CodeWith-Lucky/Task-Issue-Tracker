import express, { json } from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";
import router from './router/routerController.js';

const port=3005;
const app = express();


app.use(cors({
    origin: "http://localhost:3000",
    // credentials: true
  }));
  


  app.use(express.static('public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
  }));

  app.use(express.json({limit: "64kb"}));
  app.use(express.urlencoded({extended: true,limit: "64kb"}));
  app.use(express.static("public"));
  app.use(cookieParser());

  app.listen(port,(req,res)=>{
    console.log(`Server is running on port ${port}`);
})


app.use('/', router);


export default app;
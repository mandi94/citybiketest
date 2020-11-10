const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach"
const {addCityBikes,  getCityBikes}=require('./utils/cityBykes')



const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();


app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
let interval;

io.on("connection", socket => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log('New connection ' + socketId + ' from ' + clientIp);
  getCityBikeStations(socket)

  interval = setInterval(() => getApiAndEmit(socket), 10000);

  socket.on("go_back_time",(index)=>{
    const {auxList}=  getCityBikes(index)
    console.log(auxList)
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

});

const getApiAndEmit = socket => {
  http
  .get(citybikeurl, resp => {
      let data = ''        
      
      resp.on('data', chunk => {
          data += chunk
      })        
      .on('end', () => {
          let stations = JSON.parse(data)
          console.log('cada 10 segundos')
          socket.emit("get_data",stations)
      })
      resp.on('error', (err) => {
        // This prints the error message and stack trace to `stderr`.
        console.error(err.stack);
      });

  })
};

const getCityBikeStations = socket => {
  http
  .get(citybikeurl, resp => {
      let data = ''        
      
      resp.on('data', chunk => {
          data += chunk
      })        
      .on('end', () => {
          let stations = JSON.parse(data)
          addCityBikes(stations.network.stations)
          socket.emit("city_bikes_stations",stations.network.stations)
      })
      resp.on('error', (err) => {
        // This prints the error message and stack trace to `stderr`.
        console.error(err.stack);
      });

  })
};




server.listen(port, () => console.log(`Listening on port ${port}`));




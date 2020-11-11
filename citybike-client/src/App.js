import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import bici from './assets/bicycle.png';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";



const customMarker = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40]
});


var socket

class App extends Component {
  constructor() {
    super();

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lat: 25.801,
      lng: -80.18888,
      zoom: 13,
      bikeMarkers: [],
      goBackValue:0,
      stationsTimeSize:0
    };

    socket = socketIOClient(this.state.endpoint);
    
  }

  
  componentDidMount() {
    socket.on("city_bikes_stations",(data)=>{
      this.setState({
        bikeMarkers:data,
        response:true
      })
    });
    
    socket.emit("streaming");
    socket.emit("get_bikes_list_size");

    socket.on("receive_bikes_list_size",(data)=>{
      this.setState({
        stationsTimeSize:data
      })
    });
  
    socket.on("get_data", (data)=>{
      this.setState({
        bikeMarkers:data.network.stations,
        response:true
      })
    });
  }


  goBackStreaming() {
    socket.emit("streaming");
  }

	handleChanges = (e) => {
    socket.emit("go_back_time",e.target.value)
    socket.on("bikes_time_state",(data)=>{
      console.log(e.target.value)
      this.setState({
        bikeMarkers:data,
        goBackValue:e.target.value
      })
    })

  };


  render() {
    const {goBackValue,  bikeMarkers, stationsTimeSize } = this.state;
    const position = [this.state.lat, this.state.lng]

    return (
      <main>
        <div className="map-container">
          <div className="city-bikes-header">
            <h1> City Bikes in Miami </h1>
          </div>
          <div className="city-bikes-container">
            <div id="mapid">
              <Map center={position} zoom={this.state.zoom}>
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {bikeMarkers.map(({ latitude, longitude, free_bikes, extra}, index) => (
                  <Marker position={[latitude, longitude]} icon={customMarker} key={index}>
                    <Popup>
                      {extra.address} has <br/>{free_bikes} free bikes.
                    </Popup>
                  </Marker>
                ))}
              </Map>
            </div>
            <div className="side-bar">
              <div className="valueSpan">
                <span className="font-weight-bold text-primary ml-2 valueSpan2">You can use the slider to go back a maximum of 10 hours in the data of the day if it is available.</span>
              </div>

              <div className="d-flex justify-content-center my-4">
                  <div className="w-75">
                    <input type="range" value={goBackValue} className="custom-range" id="customRange11" min="0" max={stationsTimeSize} onChange={this.handleChanges}/>
                  </div>
                  <span className="font-weight-bold text-primary ml-2 valueSpan2">{goBackValue}</span>
              </div>

              <div className="button-div">
                <button className="real-time-btn" onClick={this.goBackStreaming}>
                  Real time bikes aviability
                </button>
              </div>       
              <div className='items-station'>
                
                {bikeMarkers.map((station,index)=>(
                    <div className="item-station" key={index} >
                        <div className="item-image">
                          <img src={bici}>
                          </img>
                        </div>
                        <div className="station-details">
                              <p>{station.extra.address}</p>
                              <p>Free bikes: {station.free_bikes}</p>
                        </div>

                    </div>
                ))}
              </div>
            </div>
            
            
          </div>
        </div>
        Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>        
      </main>

    );
  }
}
export default App;

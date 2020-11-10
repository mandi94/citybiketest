import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";



const customMarker = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40]
});




class App extends Component {
  constructor() {
    super();

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lat: 25.790654,
      lng: -80.1300455,
      zoom: 13,
      bikeMarkers: []
    };
  }

  
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("city_bikes_stations",(data)=>{
      // console.log(data)
      this.setState({
        bikeMarkers:data,
        response:true
      })
    })
    socket.on("get_data", (data)=>{
      this.setState({
        bikeMarkers:data.network.stations,
        response:true
      })
      // console.log(data)
    });
  }

  goBackTime() {
    socket.on()
  }


  render() {
    const { response , bikeMarkers } = this.state;
    const position = [this.state.lat, this.state.lng]
    // console.log(bikeMarkers)
    // console.log(position)
    // this.state.bikeMarkers.map(data => {
    //   console.log(data.latitude)
    // })
    return (
      <main>
        <div className="map-container">
          <div className="map">
            <h1> City Bikes in Miami </h1>
            <Map center={position} zoom={this.state.zoom}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* {response && bikeMarkers.map(data => 				
              {
              return <Marker key={data.id} position={{position: [data.latitude, data.longitude]}} icon={customMarker}></Marker>
              })}     */}
              {bikeMarkers.map(({ latitude, longitude, free_bikes, extra}, index) => (
                <Marker position={[latitude, longitude]} icon={customMarker} key={index}>
                  <Popup>
                    {extra.address} has {free_bikes} free bikes.
                  </Popup>
                </Marker>
              ))}
            </Map>
          </div>
          <div className='btn'>
            <button onClick={goBackTime()}>
              Go Bak in time 1 hour
            </button>
          </div>
        </div>

      </main>

    );
  }
}
export default App;

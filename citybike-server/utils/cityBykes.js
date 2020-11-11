const cityBikesList =[]
var count=36

const addCityBikes =(cityBikes)=>{
    if (cityBikesList.length<20){
       cityBikesList.push(cityBikes)
    }else{
        cityBikesList.splice(0,1)
        cityBikesList.push(cityBikes)
    }
}

const getCityBikes=(index)=>{
    const bikesOnStations= cityBikesList[index]
    return({bikesOnStations})
}

const getCityBikesSize=()=>{
    return(cityBikesList.length)
}


module.exports={
    addCityBikes,
    getCityBikes,
    getCityBikesSize
}

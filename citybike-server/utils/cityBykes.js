const cityBikesList =[]
const count=0

const addCityBikes =(cityBikes)=>{
    if (count<=10){
        cityBikesList.push(cityBikes)
    }
    // console.log(cityBikesList)
}

const getCityBikes=({index})=>{
    const auxList= cityBikesList[index]
    return({auxList})
}


module.exports={
    addCityBikes,
    getCityBikes
}

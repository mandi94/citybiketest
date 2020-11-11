const express = require("express");
const router = express.Router();
const Stations = require('../utils/cityBykes')

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

router.get('/stations',async (req,res)=>{
  let citybikes=Stations.getCityBikes(0)
  res.send({response: citybikes}).status(200);

  // const match= {}
  // const sort ={}

  // if(req.query.completed){
  //     match.completed= req.query.completed==='true'
  // }

  // if(req.query.sortBy){
  //     const parts= req.query.sortBy.split(':')
  //     sort[parts[0]]= parts[1] === 'desc'? -1: 1
  // } 

  // try{
  //     await req.user.populate({
  //         path:'tasks',
  //         match,
  //         options:{
  //             limit:parseInt(req.query.limit),
  //             skip:parseInt(req.query.skip),
  //             sort
  //         }
  //     }).execPopulate()
  //     res.send(req.user.tasks)
  // }catch(e){
  //     res.status(400).send(e)
  // }
})

module.exports = router;
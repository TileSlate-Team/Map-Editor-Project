const auth = require('../auth')
const express = require('express')
const UserController = require('../controllers/user-controller')
const MapController = require('../controllers/map-controller')
const MapInfoController = require('../controllers/mapInfo-controller')
const TileSetController = require('../controllers/tileset-controller')

const router = express.Router()

router.post('/register', UserController.registerUser)
router.get('/loggedIn', UserController.getLoggedIn)
router.post('/login', UserController.login)
router.get('/logout', UserController.logout)
router.put('/user', UserController.updateUser)
router.delete('/user', UserController.deleteUser)

router.post('/registerMap', MapController.registerMap)
router.delete('/deleteMap', MapController.deleteMap)
router.put('/updateMap', MapController.updateMap)
router.get('/getMap', MapController.getMap)

router.post('/registerMapInfo', MapInfoController.registerMapInfo)
router.delete('/deleteMapInfo', MapInfoController.deleteMapInfo)
router.put('/updateMapInfo', MapInfoController.updateMapInfo)
router.get('/getMapInfo', MapInfoController.getMapInfo)
router.get('/getAllMapInfoByUser', MapInfoController.getAllMapInfoByUser)

router.post('/registerTileSet', TileSetController.registerTileSet)
router.delete('/deleteTileSet', TileSetController.deleteTileSet)
router.put('/updateTileSet', TileSetController.updateTileSet)
router.get('/getTileSet', TileSetController.getTileSet)

module.exports = router
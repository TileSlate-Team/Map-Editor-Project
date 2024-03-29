import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: '/api',
})

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.post(`/login/`, payload)
export const logoutUser = () => api.get(`/logout/`)
export const updateUser = (payload) => api.put(`/user/`, payload)
export const deleteUser = (payload) => api.delete(`/user/`, {data: {_id: payload}})


export const registerMap = (payload) => api.post(`/registerMap/`, payload)
export const deleteMap = () => api.delete(`/deleteMap/`)
export const updateMap = (payload) => api.put(`/updateMap/`, payload)
export const getMap = () => api.get(`/getMap/`)

export const registerMapInfo = (payload) => api.post(`/registerMapInfo/`, payload)
export const deleteMapInfo = () => api.delete(`/deleteMapInfo/`)
export const updateMapInfo = (payload) => api.put(`/updateMapInfo/`, payload)
export const updateMapgetMapInfo = () => api.get(`/updateMapgetMapInfo/`)
export const getAllMapInfoByUser = () => api.get(`/getAllMapInfoByUser/`)

export const registerTileSet = (payload) => api.post(`/registerTileSet/`, payload)
export const deleteTileSet = () => api.delete(`/deleteTileSet/`)
export const updateTileSet = (payload) => api.put(`/updateTileSet/`, payload)
export const getTileSet = () => api.get(`/getTileSet/`)


const apis= {
    registerUser,
    getLoggedIn,
    loginUser,
    logoutUser,
    updateUser,
    registerMap,
    deleteMap,
    updateMap,
    getMap,
    registerMapInfo,
    deleteMapInfo,
    updateMapInfo,
    getAllMapInfoByUser,
    registerTileSet,
    deleteTileSet,
    updateTileSet,
    getTileSet
}

export default apis;
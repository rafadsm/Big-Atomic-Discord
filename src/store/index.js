import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

var Promise = require('promise');

Vue.use(Vuex)

const FETCH_DATA = "LOGIN"

const getters = {
    GetAllChannels: state => state.Channels,
    GetAllUsers: state => state.Users,
    GetToken: state => state.Token,
    Logged: state => state.Logged   
	
}

const actions = {
    FetchData({commit}, token)
    {
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:8080/check', {params:{token: token}}).then((response) => {
                    if(response.data.error == 0)
                        commit(FETCH_DATA, {token: token, data: response.data})
                    resolve(response.data);
                }, error => {
                    reject(error);
                })
        });

    },
    Login({commit})
    {
        commit(FETCH_DATA)
    }
}

const mutations = {
    [FETCH_DATA] (state, {token, data}) {
        state.Token = token
        state.Users = data.users
        state.Channels = data.channels
        state.Logged = true
    }
}

export default  new Vuex.Store({
    state:
    {
        Logged: false,
        Token: '',
        Channels: [],
        Users: []
    },
    getters,
    actions,
    mutations,
})
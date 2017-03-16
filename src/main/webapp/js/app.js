// vendor node modules
import React from 'react'
import ReactDOM from 'react-dom'
import '../vendors/font-awesome-4.6.3/css/font-awesome.min.css'
import '../vendors/jquery-1.7.1/jquery-1.7.1.min.js'
import '../styles/main.css'
import Factory from './factory'
import App from '../components/App/App'
import Auth from './auth'

// get app id
const app_id = getParameterByName('id');
// get configurationId
const configurationId = getParameterByName('configurationId');


let instanceList = []; // instanceList        main object. Stores all instance webhook objects.


/* get parameters from url */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


/* SYMPHONY API */
SYMPHONY.remote.hello().then(function(data) {
    setTheme(data.themeV2);
    function setTheme(theme) {
        document.getElementsByTagName('html')[0].className = 'symphony-external-app '+ theme.name +' '+theme.size;
    }
    function onThemeChange(theme) {
        setTheme(theme);
    }
    SYMPHONY.application.connect(app_id, ['ui', 'modules', 'applications-nav', "extended-user-service", "integration-config", "stream-service"], [app_id+':module']).then(function(response) {
        //set theme
        let uiService = SYMPHONY.services.subscribe('ui');
        uiService.listen('themeChangeV2', onThemeChange.bind(this));
        // subscribe services
        // exteded user service
        let extendedUserService = SYMPHONY.services.subscribe("extended-user-service");
        // integration config services
        let integrationConfService = SYMPHONY.services.subscribe("integration-config");
        // get botUserId
        let botUserId = getParameterByName('botUserId');
        // store all user chat rooms
        let userChatRooms = [];
        // userId
        let userId;
        // user instances list
        let instanceList = [];
        let dataResponse
        // get configurationId

        /** PROMISES **/
        /* promise 1: get user rooms from api
        /* promise 2: get user id from api
        /* promise 3: get baseUrl from api
        /* promise 4: get user's instances list from api
        */
        //--> (promise 1)
        let promisedRooms = extendedUserService.getRooms();
        //--> (promise 2)
        let promisedUserId = extendedUserService.getUserId();
        //--> (promise 3)
        const baseURL = window.location.protocol + "//" + window.location.hostname + "/integration";
        //--> (promise 4)
        let promisedList = integrationConfService.getConfigurationInstanceList(configurationId);
        /** END PROMISES **/


        Promise.all([promisedRooms, promisedUserId, promisedList]).then(values => {
            getUserRooms(values[0]);
            userId = values[1];
            Factory.userId = userId;
            Factory.botUserId = botUserId;
            Factory.configurationId = configurationId;
            Factory.baseURL = baseURL;
            Factory.appId = app_id;
            getUserInstanceList(values[2]);
            getTrelloAuth();
        });

        /* Get Trello Authorization */
        function getTrelloAuth() {
            var auth = new Auth(configurationId, callback);
            function callback(val) {
                if (val) {
                    Factory.token = auth.token;
                    ReactDOM.render(<App configurationId={configurationId} />, document.getElementById('app'));
                }
            }
        }

        /* getUserRooms      retrives all user's rooms
        *  @param            data          data returned from the first promise
        */
        function getUserRooms(data) {
            for(let prop in data) {
                if(data[prop].userIsOwner) {
                    userChatRooms.push(data[prop]);
                }
            }
            let regExp = /\//g;
            // normalize all rooms threadIds
            userChatRooms.map( (room, idx) => {
                room.threadId = room.threadId.replace(regExp,'_').replace("==","");
            });
            Factory.userChatRooms = userChatRooms.slice();
        }


        /* getUserInstanceList      retrieves all user's webhook instances
        *  @param                   data        data returned from the fourth promise
        */
        function getUserInstanceList(data) {
            dataResponse = data.length || 0;
            if(dataResponse == 0) Factory.dataResponse = 0;
            // retrieve all webhook instances
            for(let obj in data) {
                let op = data[obj].optionalProperties;
                let obj_op = JSON.parse(op);
                instanceList.push(
                        {
                            streams: obj_op.streams, // rooms threadId's (string) that are posting locations
                            name: data[obj].name,
                            configurationId: data[obj].configurationId,
                            postingLocationRooms: [], // user rooms (object) that are posting locations
                            notPostingLocationRooms: [], // user rooms (object) that are NOT posting locations
                            instanceId: data[obj].instanceId,
                            lastPostedTimestamp: obj_op.lastPostedDate,
                            modelId: obj_op.modelId,
                            boardName: obj_op.boardName,
                            notifications: obj_op.notifications,
                            streamType: obj_op['streamType'],
                            notifications: obj_op.notifications,
                            lastPosted: obj_op.lastPostedDate ? timestampToDate(obj_op.lastPostedDate) : 'not available',
                            created: data[obj].createdDate ? timestampToDate(data[obj].createdDate) : 'not available'
                        }
                    );
            };
            // stores all posting locations (object) into instanceList
            let aux_rooms = [];
            instanceList.map(function(inst, i) {
                inst.streams.map(function(stream, j) {
                    userChatRooms.map(function(room, k) {
                        if(stream == room.threadId) {
                            inst.postingLocationRooms.push(clone(room));
                        }
                    });
                });
            });
            // stores all indexes of the rooms (object) that are not posting locations into an array
            let pl, idx, aux;
            instanceList.map(function(inst, i){
                pl=false;
                idx = [];
                aux=userChatRooms.slice();
                inst.streams.map(function(stream, j){
                    for(let k=0,n=aux.length; k<n; k++) {
                      if(aux[k].threadId == stream) {
                         idx.push(k);
                      }
                    }
                })
                // remove from the user rooms array all those are posting locations rooms
                for(let i=0, n=aux.length; i<n; i++) {
                  for(let j=0, l=idx.length; j<l; j++) {
                    if(i == idx[j]) {
                      aux.splice(i,1);
                      idx.splice(j,1);
                      for(let k=0, s=idx.length; k<s; k++) idx[k]--;
                      i--;
                      break;
                    }
                  }
                }
                inst.notPostingLocationRooms = aux.slice();
            });

            Factory.instanceList = instanceList.slice();
        }


        /********** HELPER FUNCTIONS *********/
        /* timestampToDate          format unix timestamp in date format */
        function timestampToDate(_ts) {
            let date = new Date(Number(_ts));
            let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let month = monthNames[date.getMonth()];
            return month  +' '+ date.getDate() +', '+date.getFullYear();
        }
        /* javascript clone object function */
        function clone(obj) {
            if (null == obj || "object" != typeof obj) return obj;
            let copy = obj.constructor();
            for (let attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        }

    }.bind(this))
}.bind(this));


import Factory from './factory';
const Utils = {

	sendWelcomeMessage(streams, instanceId) {
		const query = Factory.baseURL +'/v1/whi/'+ Factory.appId +'/'+ Factory.configurationId +'/'+ instanceId +'/welcome';
		const payload = {
    		streams: streams
    	}
		$.ajax({
			url: query,
			type:'POST',
			data: JSON.stringify(payload),
			dataType: "json",
			contentType: "application/json",
			success: success,
			error: error
		});
    	const success = data => {
    		console.log('success welcome:', data);
    	}
    	const error = err => {
    		console.log('error welcome: ', err);
    	}		
    },

    getUpdatedRooms(_service, _cb) {
    	const promisedRooms = _service.getRooms();
		
		// store all user chat rooms
        const userChatRooms = [];
		promisedRooms.then(data => {
			for(let prop in data) {
		        if(data[prop].userIsOwner) {
		            userChatRooms.push(data[prop]);
		        }
	        }
	        const regExp = /\//g;
	        // normalize all rooms threadIds
	        userChatRooms.map(function(room, idx) {
	            room.threadId = room.threadId.replace(regExp,'_').replace("==","");
	        }, this);
	        Factory.userChatRooms = userChatRooms.slice();
	        _cb();
	    }, function(err) {
			console.log('Error retrieving user rooms. ', err);
		});
    }
}


export default Utils;
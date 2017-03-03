var Auth = function(configId, callback) {
	this.configId = configId;
	this.token = null;
	var that = this;
	localStorage.clear();
	
	this.checkSBEToken(function(val) {
		if(val) callback(true);
	});
	
}

Auth.prototype.checkSBEToken = function(callback) {
	var thisAuth = this;
	var integrationConfService = getSymphonyService();
	var promisedToken = integrationConfService.getConfigurationToken(this.configId);
	promisedToken.then(function(data) {
		//if there is no token, call Trello Authorize
    	if(data.token === undefined) {
			thisAuth.trelloAuthorize(function(val) {
				if(val) callback(true);
			});
		} else {
			// if there is a token in SBE, is no need to call Trello Authorize
			console.log('Successfully returned token from SBE');
			thisAuth.token = data.token;
			callback(true);
		}
    },function(error) {
    	console.log('Error requesting token from SBE: ',error);
    });
}

Auth.prototype.trelloAuthorize = function(callback) {
	var thisAuth = this;
	return Trello.authorize({
				type: 'popup',
				name: 'Trello for Symphony',
				persist: 'true', // the token will be saved on localstorage
				scope: {
					read: 'true',
					write: 'true'
				},
				expiration: 'never',
				success: success,
				error: fail
			});

	function success() {
		if(typeof(Storage) !== 'undefined') {
			thisAuth.token =  window.localStorage.trello_token;
			callback(true);
			// promise,  save the Trello token provided by the API into the SBE
	   		var integrationConfService = getSymphonyService();
			var storeToken = integrationConfService.saveConfigurationToken(thisAuth.configId, {'token': thisAuth.token});
			storeToken.then(function(data){
				console.log('Successfully stored token in SBE: ',data);
			},function(error){
				console.log('Error attempting to store token in SBE', error);
			})
		} else {
			console.log('Your browser does not support localStorage!');
		}
	}

	function fail() {
		console.log('Fail attempting to call Trello API');
	}
}

function getSymphonyService() {
	return SYMPHONY.services.subscribe("integration-config");
}

module.exports = Auth;
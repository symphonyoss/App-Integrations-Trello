import alt from '../js/alt'

class SaveWebHookActions {
	constructor() {
		this.generateActions(
			'getToken'
		);

	}

	getToken() {
		console.log('Actions get token');
		this.getToken();
	}	

}

export default alt.createActions(SaveWebHookActions);
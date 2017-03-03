import alt from '../js/alt'
import Actions from '../actions/SaveWebHookActions'
import Factory from '../js/factory'

class SaveWebHookStore {
	constructor() {
		this.bindActions(Actions);
		this.token = null;
	}
	
	onGetToken() {
		this.token = Factory.token;
	}
}

export default alt.createStore(SaveWebHookStore)
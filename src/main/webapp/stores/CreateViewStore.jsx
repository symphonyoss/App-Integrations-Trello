import alt from '../js/alt'
import CreateViewActions from '../actions/CreateViewActions'
import Factory from '../js/factory'

class CreateViewStore {
	constructor() {
		this.bindActions(CreateViewActions)
		this.token = null;
		this.messages = [];
		this.showWarning = true;
	}
	
	onGetToken() {
		this.token = Factory.token;
	}
}

export default alt.createStore(CreateViewStore)
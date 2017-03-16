import alt from '../js/alt'
import EditViewActions from '../actions/EditViewActions'
import Factory from '../js/factory'

class EditViewStore {
	constructor() {
		this.bindActions(EditViewActions);
		this.messages = [];
		this.token = null;
		this.instance = null;
	}

	onGetToken() {
		this.token = Factory.token;
	}
}

export default alt.createStore(EditViewStore)
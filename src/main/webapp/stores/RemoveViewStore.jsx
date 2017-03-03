import alt from '../js/alt'
import Actions from '../actions/RemoveViewActions'
import Factory from '../js/factory'

class RemoveViewStore {
	constructor() {
		this.bindActions(Actions);
		this.instance = null;
	}

}

export default alt.createStore(RemoveViewStore)
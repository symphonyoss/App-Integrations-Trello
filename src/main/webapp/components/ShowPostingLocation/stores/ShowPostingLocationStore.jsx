import alt from '../../../js/alt'
import Actions from '../actions/ShowPostingLocationActions'
import Factory from '../../../js/factory';

class ShowPostingLocationStore {
	constructor() {
		this.bindActions(Actions)
		this.filters = [];
	}
	
	
}

export default alt.createStore(ShowPostingLocationStore)
import alt from '../../../js/alt'
import Actions from '../actions/SearchRoomsActions'
import Factory from '../../../js/factory'

class SearchRoomsStore {
	constructor() {
		this.bindActions(Actions);
		this.filters = [];
		this.disabled = false;
		this.filled = false;
		this.required = true;
		this.focused = -1;
		this.listening = false;
	}
	

}

export default alt.createStore(SearchRoomsStore)
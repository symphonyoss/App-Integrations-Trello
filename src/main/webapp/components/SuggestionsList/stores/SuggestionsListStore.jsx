import alt from '../../../js/alt'
import Actions from '../actions/SuggestionsListActions'
import Factory from '../../../js/factory'

class SuggestionsListStore {
	constructor() {
		this.bindActions(Actions)
		this.items = [];
	}
	

}

export default alt.createStore(SuggestionsListStore)
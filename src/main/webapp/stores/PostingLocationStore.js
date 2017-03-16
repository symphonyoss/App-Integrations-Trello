import alt from '../js/alt';
import PostingLocationActions from '../actions/PostingLocationActions'

class PostingLocationStore {
	constructor() {
		this.bindActions(PostingLocationActions);
		
	}
}

export default alt.createStore(PostingLocationStore)
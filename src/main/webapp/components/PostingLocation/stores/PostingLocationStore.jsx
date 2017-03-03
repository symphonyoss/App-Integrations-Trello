import alt from '../../../js/alt'
import Actions from '../actions/PostingLocationActions'
import Factory from '../../../js/factory';

class PostingLocationStore {
	constructor() {
		this.bindActions(Actions)
		this.checked = true;
		this.showSearch = false;
		this.rooms = [];
		this.filteredRooms = [];
		this.filters = [];
		this.required = true;
		this.oneOneLabel = 'New one-on-one chat';
	}
	
	onUpdateChatRooms() {
		this.rooms = Factory.userChatRooms.slice();
	}

}

export default alt.createStore(PostingLocationStore)
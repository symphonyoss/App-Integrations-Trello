import alt from '../../../js/alt';
import Actions from '../actions/EditPostingLocationActions';
import Factory from '../../../js/factory';

class EditPostingLocationStore {
	constructor() {
		this.bindActions(Actions)
		this.checked = false;
		this.showSearch = false;
		this.rooms = [];
		this.filteredRooms = [];
		this.filters = [];
		this.oneOneLabel = 'New one-on-one chat';
	}
	
	onUpdateChatRooms() {
		this.rooms = Factory.userChatRooms.slice();
	}

}

export default alt.createStore(EditPostingLocationStore)
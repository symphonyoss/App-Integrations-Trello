import alt from '../../../js/alt'
import Factory from '../../../js/factory';

class PostingLocationActions {
	constructor() {
		this.generateActions(
			'updateChatRooms'
		);

	}

	updateUserChatRooms() {
		this.updateChatRooms();
	}

	
}

export default alt.createActions(PostingLocationActions)
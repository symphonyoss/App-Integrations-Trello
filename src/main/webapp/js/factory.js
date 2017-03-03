'use strict';
export default {
	
	userId: null,

	botUserId: null,

	configurationId: null,

	baseURL: null,

	appId: null,

	instanceList: [],

	userChatRooms: [],
	
	token: null,

	dataResponse: 1,

	timeout: 10000,

	required: {
		name: true,
		rooms: false, // streamType IM is default,
		board: true,
		notifications: true
	},

	notifications: ['boardRenamed', 'listArchivedUnarchived', 'listCreated', 'listMovedToOtherBoard', 'listRenamed', 'memberAddedToBoad', 'attachmentAddedToCard', 'cardArchivedUnarchived', 'cardCreated', 'cardDescriptionChanged', 'cardDueDateChanged', 'cardLabelChanged', 'cardMoved', 'cardRenamed', 'commentAddedToCard', 'memberAddedToCard', 'convertToCardFromCheckItem', 'checklistCreated', 'checklistItemCreated', 'checklistItemUpdated'],

	messages: {
		created: "You have successfully configured a new Trello Integration.",
		updated: "You have successfully updated your Trello Integration.",
		deactivated: "Trello Integration successfully removed.",
		error: "An error has ocurred and the operation could not be completed. Please try again later.",
		not_found: "No webhook instances were found.",
		loading: "Searching for instances...",
		working: "Working...",
		name_required: "Description is required!",
		rooms_required: "Posting Location is required!",
		board_required: "Please, select a Trello Board!",
		notifications_required: "Please select at least one Trello event!",
		popup: "Please, check if your browser is blocking popups from Trello.",
		crossChecking: "Cannot find this configuration on your Trello account.",
		revoked: "You have unauthorized Symphony from accessing your account. All instances listed below have been removed. Please authorize Symphony again."
	},

	labelPostingLocations: "One-on-one with ",

	instance: {
		name: '',
		instanceId: null,
		streamType: 'IM',
		postingLocationRooms: [],
		notPostingLocationRooms: [],
		newPostingLocationsRooms: [],	// Rooms used to check welcome message
		lastPostedDate: null,
		modelId: null,
		boardName: null,
		notifications: []
	},

	resetInstance: function() {
		this.instance = {
			name: '',
			instanceId: null,
			streamType: 'IM',
			postingLocationRooms: [],
			notPostingLocationRooms: [],
			newPostingLocationsRooms: [],	// Rooms used to check welcome message
			lastPostedDate: null,
			modelId: null,
			boardName: null,
			notifications: []
		}
	},

	setNewInstance: function(_elem) {
		this.instanceList.push(_elem);
		this.dataResponse = 1;
	},

	updateInstance: function(_id, _item) {
		this.instanceList.map((item, idx) => {
			if(_id == item.instanceId) {
				this.instanceList[idx] = _item;
				return;
			}
		});
	},

	removeInstanceById: function(_id) {
		this.instanceList.map((item, idx) => {
			if(_id == item.instanceId) {
				this.instanceList.splice(idx,1);
				return;
			}
		});
		if(this.instanceList.length == 0) {
			this.dataResponse = 0;
		}
	}
}



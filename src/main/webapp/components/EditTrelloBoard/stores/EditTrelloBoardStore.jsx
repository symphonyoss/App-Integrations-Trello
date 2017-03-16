import alt from '../../../js/alt'
import Actions from '../actions/EditTrelloBoardActions'
import Factory from '../../../js/factory'
import Events from '../../../js/events.service'

class EditTrelloBoardStore {
	constructor() {
		this.bindActions(Actions);
		this.token = null;
		this.boards = [];
		this.showBoards = false;
		this.callback = false; // triggers when Trello sends all boards
		this.maxHeight = 0;
		this.styles = {
			maxHeight: 0,
			transition: 'max-height 0.25s ease-in'
		}
		this.showEvents = {
			maxHeight: 1000,
			overflow: 'visible',
			transition: 'max-height 0.25s ease-in'
		};
		this.hideEvents = {
			maxHeight: 0,
			overflow: 'hidden',
  			transition: 'max-height 0.25s ease-in'	
		};
		this.lists = [];
		this.checked = [];
		this.selectedBoard = null; 
		this.hasEvents = true;
		this.itemHeight = 46;

		this.trelloEvents = Events;
	}

	onGetToken() {
		this.token = Factory.token;
	}
}

export default alt.createStore(EditTrelloBoardStore)
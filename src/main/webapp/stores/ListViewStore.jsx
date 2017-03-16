import alt from '../js/alt';
import ListViewActions from '../actions/ListViewActions';

class ListViewStore {
	constructor() {
		this.bindActions(ListViewActions);
		this.intances = [];
		this.status = false;
		this.showWarning = true;
	    this.loading = false;
	    this.message = "";
	    this.error = false;
	    this.failInstances = [];		// stores all instances in SBE that has not related webhook in Trello API
	    this.revokedInstances = []; 	// stores all instances for revoked applications
	    this.crossCheck = false;		// check if there is a releated webhook in Trello for each instance in SBE. After the check, this state becomes true
	    this.showBalloon = false;		// manages the show hide ballon message
	    this.trelloStatus = 'OK';		// manage the status returned from a Trello API Call. 'OK', 'NOT_FOUND' (if the instance has not related webhook), and 'REVOKED', (if the app was revoked at Trello)
	    this.showIntances = false;		
	}
}

export default alt.createStore(ListViewStore);
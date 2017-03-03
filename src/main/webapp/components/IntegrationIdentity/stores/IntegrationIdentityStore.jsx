import alt from '../../../js/alt'
import Actions from '../actions/IntegrationIdentityActions'

class IntegrationIdentityStore {
	constructor() {
		this.bindActions(Actions)
		this.name = '';
		this.filled = false;
		this.required = true;
	}

	

	

}

export default alt.createStore(IntegrationIdentityStore)
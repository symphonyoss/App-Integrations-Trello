import alt from '../../../js/alt'

class IntegrationIdentityActions {
	constructor() {
		this.generateActions(
			'getConfigurationId'
		);

	}

	/*getConfigurationIdFromParams() {
		let confId = this.getParameterByName('configurationId');
		this.getConfigurationId(confId);
	}*/


}

export default alt.createActions(IntegrationIdentityActions)
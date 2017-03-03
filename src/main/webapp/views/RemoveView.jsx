import React from 'react';
import { hashHistory } from 'react-router'
import Store from '../stores/RemoveViewStore'
import Actions from '../actions/RemoveViewActions'
import IntegrationIdentity from '../components/IntegrationIdentity/IntegrationIdentity'
import ShowPostingLocation from '../components/ShowPostingLocation/ShowPostingLocation'
import ShowTrelloBoard from '../components/ShowTrelloBoard/ShowTrelloBoard'
import Factory from '../js/factory'

class RemoveView extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.state = Store.getState();
		this.onRemove = this.onRemove.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	componentWillMount() {
		Store.listen(this.onChange);
		let _instance = Factory.instanceList.filter((item) => item.instanceId === this.props.params.instance_id).slice();
		this.setState({
			instance: _instance[0]
		});
		Factory.instance.instanceId = _instance[0].instanceId;
		Factory.instance.postingLocationRooms = _instance[0].postingLocationRooms;
		Factory.instance.boardName = _instance[0].boardName;
		Factory.instance.modelId = _instance[0].modelId;
		Factory.instance.notifications = _instance[0].notifications.slice();
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	onRemove() {
		if(this.props.params.only_instance !== undefined) {
			hashHistory.push('/save-webhook/remove-instance');
		} else {
			hashHistory.push('/save-webhook/remove');
		}
		//hashHistory.push('/save-webhook/remove');
	}

	onCancel() {
		hashHistory.push('/list-view');
	}

	render() {
		let appName = this.props.params.app_name;
		return(
			<div className='remove-container block'>
				<IntegrationIdentity appName={appName} instanceName={this.state.instance.name} disabled={true} />
				<ShowPostingLocation />
				<ShowTrelloBoard boardName={this.state.instance.boardName} notifications={this.state.instance.notifications} />
				<div className="remove-btn-container">
					<button className="button" onClick={this.onRemove} >Remove</button>
					<button className="button cancel-link" onClick={this.onCancel} >Cancel</button>
				</div>
			</div>
		);
	}
}
RemoveView.propTypes = {
	params: React.PropTypes.object
}
export default RemoveView
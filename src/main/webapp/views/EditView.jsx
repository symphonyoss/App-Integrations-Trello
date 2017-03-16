import React from 'react';
import Store from '../stores/EditViewStore'
import Actions from '../actions/EditViewActions'
import IntegrationIdentity from '../components/IntegrationIdentity/IntegrationIdentity'
import EditPostingLocation from '../components/EditPostingLocation/EditPostingLocation'
import SubmitWebHook from '../components/SubmitWebHook/SubmitWebHook'
import Warning from '../components/Warning/Warning'
import EditTrelloBoard from '../components/EditTrelloBoard/EditTrelloBoard'
import Factory from '../js/factory'

class EditView extends React.Component {
	constructor(props) {
		super(props);
		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
		this.showMessage = this.showMessage.bind(this);
		this.onCloseMessage = this.onCloseMessage.bind(this);
	}

	componentWillMount() {
		Store.listen(this.onChange);
		Actions.getToken();
		let _instance = Factory.instanceList.filter((item) => item.instanceId === this.props.params.instance_id)[0];
		this.setState({
			instance: _instance
		});
		Factory.instance.modelId = _instance.modelId;
		Factory.instance.instanceId = _instance.instanceId;
	}
	
	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	showMessage(_msg) {
		this.setState({
			messages: _msg.slice()
		});
		window.scrollTo(0, 0);
	}

	onCloseMessage(item) {
		let _msgs = this.state.messages.slice();
		_msgs.map( (__item, i) => {
			if(item == __item) {
				_msgs.splice(i, 1);
			}
		} )
		this.setState({
			messages: _msgs.slice()
		})
	}

	render() {
		let instanceId = this.props.params.instance_id;
		let appName = this.props.params.app_name;
		return(
			<div className="block createview">
				<section className="webhook-step">
					<h1>Step 1 - Configure Webhook</h1>
					{ this.state.messages.map((item, i) => <Warning message={item} ref={i} category={"REQUIRED"} onClose={this.onCloseMessage.bind(this, item)} key={i} />) }
					<IntegrationIdentity appName={appName} instanceName={this.state.instance.name} />
					<EditPostingLocation instanceId={instanceId} />
				</section>
				{/* this.state.token && ( */}
				<section className="trello-step">
					<h1>Step 2 - Configure Trello Events</h1>
					<EditTrelloBoard notifications={this.state.instance.notifications} modelId={this.state.instance.modelId} />
				</section>
				{/*})*/}
				<section>
					<SubmitWebHook showMessage={this.showMessage} operation='update' />
				</section>
			</div>
		);
	}
}
EditView.propTypes = {
	params: React.PropTypes.object
}

export default EditView;
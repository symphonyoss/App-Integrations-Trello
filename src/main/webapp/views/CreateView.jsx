import React from 'react'
import Store from '../stores/CreateViewStore'
import Actions from '../actions/CreateViewActions'
import IntegrationIdentity from '../components/IntegrationIdentity/IntegrationIdentity'
import PostingLocation from '../components/PostingLocation/PostingLocation'
import SubmitWebHook from '../components/SubmitWebHook/SubmitWebHook'
import Warning from '../components/Warning/Warning'
import TrelloBoard from '../components/TrelloBoard/TrelloBoard'

class CreateView extends React.Component {
	constructor(props) {
		super(props);
		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
		this.showMessage = this.showMessage.bind(this);
	}

	componentWillMount() {
		Store.listen(this.onChange);
		Actions.getToken();
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

	onClose(item) {
		let _msgs = this.state.messages.slice();
		_msgs.map((__item, i) => {
			if(item == __item) {
				_msgs.splice(i, 1);
			}
		});
		this.setState({
			messages: _msgs.slice()
		});
	}

	render() {
		let appName = this.props.params.app_name;
		return(
			<div className="block createview">
				<section className="webhook-step">
					<h1>Step 1 - Configure Webhook</h1>
					{ this.state.messages.map((item, i) => <Warning message={item} ref={i} category={"REQUIRED"} onClose={this.onClose.bind(this, item)} key={i} />) }
					<IntegrationIdentity appName={appName} />
					<PostingLocation />
				</section>
				{ this.state.token !== null && (
					<section className="trello-step">
						<h1>Step 2 - Configure Trello Events</h1>
						<TrelloBoard />
					</section>
				)}
				<section>
					<SubmitWebHook showMessage={this.showMessage} operation='create' />
				</section>	
			</div>
		);
	}
}

export default CreateView;
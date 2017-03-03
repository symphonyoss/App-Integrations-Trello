import React from 'react'
import { hashHistory } from 'react-router'
import Factory from '../../js/factory'

class SubmitWebHook extends React.Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	onSubmit() {
		let msg = [];
		if(Factory.required.name) {
			msg.push(Factory.messages.name_required);
		} 
		if(Factory.required.rooms) {
			msg.push(Factory.messages.rooms_required);
		} 
		if(Factory.required.board) {
			msg.push(Factory.messages.board_required);
		}
		if(Factory.required.notifications) {
			if(!Factory.required.board)
				msg.push(Factory.messages.notifications_required);
		}
		if(msg.length > 0) {
			this.props.showMessage(msg);	
		} else {
			hashHistory.push('/save-webhook/'+ this.props.operation);	
		}
	}

	onCancel() {
		hashHistory.push('/list-view');
	}

	render() {
		return(
			<div className="submit-webhook">
				<div className="btn-container">
					<button className="button" onClick={this.onSubmit} type="button" >{ this.props.operation === 'create' ? 'Add' : 'Update'}</button>
					<button className="button cancel-link" onClick={this.onCancel} type="button" >Cancel</button>
				</div>
			</div>
		)
	}
}
SubmitWebHook.propTypes = {
	showMessage: React.PropTypes.func,
	operation: React.PropTypes.string.isRequired
}

export default SubmitWebHook
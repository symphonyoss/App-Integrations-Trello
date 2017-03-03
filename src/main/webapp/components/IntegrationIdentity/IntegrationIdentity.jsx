import React from 'react'
import Store from './stores/IntegrationIdentityStore'
import Factory from '../../js/factory'

class IntegrationIdentity extends React.Component {
	constructor(props) {
		super(props);
		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
		this.onNameChange = this.onNameChange.bind(this);
	}
	
	componentWillMount() {
		if(this.props.instanceName !== "") { 
			Factory.required.name = false;
			this.setState({
				name: this.props.instanceName,
				filled: true
			});
		} else {
			Factory.required.name = true;
		}
		this.setState({
			required: Factory.required.name
		});
	}	

	componentDidMount() {
		Store.listen(this.onChange);
		this.refs.instanceName.focus();
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	onNameChange(e) {
		if(e.target.value !== "") {
			Factory.required.name = false;
			this.setState({
				filled: true,
				required: false
			})
		} else { 
			Factory.required.name = true;
			this.setState({
				filled: false,
				required: true
			})
		}
		this.setState({
			name: e.target.value
		});
		Factory.instance.name = e.target.value;
	}

	render() {
		return (
			<div className='integration-identity-container'>
				<div className="integration-identity">
					<figure>
						<img src={require('./img/logo.png')} alt={this.props.appName} />
					</figure>
					<h5>{this.props.appName}</h5>
				</div>
				<h3>{Factory.configurationName} WebHook Integration</h3>
				<div>
					<h5><label htmlFor="ii-name">Description</label></h5>
					<div className="integration-identity-input">
						<input type="text" className="text-input" ref="instanceName" id="ii-name" placeholder="Add a short description here" value={this.state.name} onChange={this.onNameChange} disabled={this.props.disabled} />
						{ !this.state.filled && (<span className="required"><i className="fa fa-asterisk" aria-hidden="true"></i></span>)}
					</div>
				</div>
			</div>
		);
	}
}
IntegrationIdentity.propTypes = {
	appName: React.PropTypes.string,
    instanceName: React.PropTypes.string,
    disabled: React.PropTypes.bool
}

IntegrationIdentity.defaultProps = {
	instanceName: '',
	disabled: false
}

export default IntegrationIdentity;
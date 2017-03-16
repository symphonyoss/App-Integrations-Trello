import React from 'react';
import { hashHistory } from 'react-router';
import Store from '../stores/ListViewStore';
import Actions from '../actions/ListViewActions';
import config from '../js/config';
import Factory from '../js/factory';
import Warning from '../components/Warning/Warning';

class ListView extends React.Component {
	constructor(props) {
		super(props);
		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
		this.onCloseStatus = this.onCloseStatus.bind(this);
		this.onConfigureNew = this.onConfigureNew.bind(this);
		//this.crossChecking = this.crossChecking.bind(this);
		this.showBalloon = this.showBalloon.bind(this);
		this.hideBalloon = this.hideBalloon.bind(this);
	}

	componentWillMount() {
		Store.listen(this.onChange);
		let _msg;

		if(this.props.params) {
			if(this.props.params.status !== undefined){
				switch(this.props.params.status) {
					case "created": _msg = Factory.messages.created;
					break;
					case "updated": _msg = Factory.messages.updated;
					break;
					case "deactivated": 
						_msg = Factory.messages.deactivated;
						this.setState({
							showIntances: true
						})
					break;
					case "error": 
						_msg = Factory.messages.error;
						this.setState({
							error: true
						})
					break;
					default: 
						this.setState({
							error: false
						})
					break;
				}
				this.setState({
					message: _msg,
					status: true
				}) 
			}
		}
		if(Factory.dataResponse == 1) {
			this.setState({
				showWarning: false,
				loading: true,
			});
		} else {
			this.setState({
				showWarning: true,
				loading: false,
				message: Factory.messages.not_found
			});
		}
	}

	onChange(state) {
		this.setState(state);
	}

	onConfigureNew() {
		hashHistory.push('/create-view/'+config.app_title);
	}

	onCloseStatus() {
		this.setState({
	      status: false,
	      message: ""
	    })
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	componentDidMount() {
		let that, url, webhooks = [];
		let instances = Factory.instanceList.slice();
		let fail_instances = []; // Instances that has not related webhook
		let query = '/tokens/'+ Factory.token +'/webhooks';
        Trello.get(query, success, error);
        that = this;
        function success(data) {
        	webhooks = data.slice();
        	instances.map((item,idx) => {
        		url = Factory.baseURL +'/v1/whi/'+ Factory.appId +'/'+ Factory.configurationId + '/' + item.instanceId;
        		// url for debug below
				// url = 'http://www.google.com?configurationId='+ Factory.configurationId +'&instanceId='+ item.instanceId; 
        		item.broked = false;
        		if(webhooks.filter((webhook) => url === webhook.callbackURL).length === 0) {
        			item.broked = true;
        			fail_instances.push(item);
        		}
        	});

        	if(fail_instances.length > 0) {
        		that.setState({
        			failInstances: fail_instances.slice()
        		})
    		} 
    		that.setState({
    			crossCheck: true
    		});

    		checkLoaded();
    	}
        function error(err) {
        	if(err.responseText == 'token not found' && err.status == '404') {
        		that.setState({
        			trelloStatus: 'REVOKED'
        		})
        		let promises = [];
        		// integration config services
	        	let integrationConfService = SYMPHONY.services.subscribe("integration-config");

	        	// Promise #1,  remove token
	        	promises.push(integrationConfService.removeConfigurationToken(Factory.configurationId));
	        	
	        	// Promise #2, remove all instances from SBE...
	        	instances.map((item, idx) => {
	        		promises.push(integrationConfService.deactivateConfigurationInstanceById(Factory.configurationId, item.instanceId));
	        	});

	        	Promise.all(promises).then((data) => {
	        		console.log('Successfully removed all instances from SBE');
	        		that.setState({
						showWarning: false,
						loading: false,
						showIntances: true,
						revokedInstances: Factory.instanceList.slice()
					});
	        	},(error) => {
	        		console.log('Error attempting remove all instances from SBE');
	        	});
	        }
        }

        function checkLoaded() {
        	if(that.refs.instanceTable.getElementsByTagName("td").length > 0) {
				that.setState({
					showWarning: false,
					loading: false,
					showIntances: true
				});
			} 
			if(that.props.params) {
				if(that.props.params.status == "error") {
					that.setState({
						loading: false
					});
				}
			}	
        }
	
	}

	showBalloon() {
		this.setState({
			showBalloon: true
		})
	}

	hideBalloon() {
		this.setState({
			showBalloon: false
		})
	}

	render() {
		let rows = Factory.instanceList.slice() || [];
		let _cat;
		if(this.state.error) {
	      _cat = "ERROR";
	    } else if(this.state.showWarning) {
	      _cat = "WARNING";
	    } else {
	      _cat = "SUCCESS";
	    }
	    let revoked = this.state.revokedInstances.slice();
	    return (
			<div>
				<div className={ this.state.showBalloon ? 'balloon show' : 'balloon'}>
					<span><i className="fa fa-exclamation-triangle" aria-hidden="true"></i></span>
					<p>{Factory.messages.crossChecking}</p>
					<a href="javascript:void(null)" onClick={this.hideBalloon} ><i className="fa fa-times"></i></a>
				</div>
				{this.state.status && (<Warning message={this.state.message} category={_cat} onClose={this.onCloseStatus} />)}
				<div className={ this.state.showIntances ? "whi-table block" : "hide"} >
					{this.state.trelloStatus !== 'REVOKED' && (
						<div id="header">
							<h2>Configured Integrations</h2>
							<button className="button" onClick={this.onConfigureNew} >Configure New</button>
						</div>
					)}
					{revoked.length > 0 && (
						<div className='revoke'>
							<p>{Factory.messages.revoked}</p>
							<ul className='revoked-instances'>
								{revoked.map((elem,idx) => <li><i className="fa fa-trello" aria-hidden="true"></i><span>{elem.name}</span></li>)}
							</ul>
						</div>
					)}

					{ this.state.crossCheck && (
						<table ref="instanceTable" className={this.state.showWarning ? "hide" : ""}>
							<thead>
								<tr>
									<th>Description</th>
									<th>Active In</th>
									<th>Trello Board</th>
									<th>Last Posted</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{rows.map((item, idx) => <DataRow key={idx} instance={item} warning={item.broked ? true : false} showMessage={this.showBalloon} />)}
							</tbody>
						</table>
					)}					
				</div>
				{this.state.loading && (<div className="spinner"><div><i className="fa fa-circle-o-notch fa-spin"></i></div><p>{Factory.messages.loading}</p></div>)}
			</div>
		);
	}
}

class DataRow extends React.Component {
	constructor(props) {
		super(props);
		this.onClickEdit = this.onClickEdit.bind(this);
		this.onClickRemove = this.onClickRemove.bind(this);
		this.showBalloon = this.showBalloon.bind(this);
		this.onClickRemoveInstance = this.onClickRemoveInstance.bind(this);
	}
	
	onClickRemove() {
		hashHistory.push('/remove-view/'+ this.props.instance.instanceId +'/'+ config.app_title);
		return false;
	}

	onClickRemoveInstance() {
		hashHistory.push('/remove-view/'+ this.props.instance.instanceId +'/'+ config.app_title +'/onlyInstance');
		return false;	
	}

	onClickEdit() {
		hashHistory.push('/edit-view/'+ this.props.instance.instanceId + '/' + config.app_title);
		return false;
	}

	showBalloon(e) {
		this.props.showMessage();
		return false;
	}

	render() {
		let posting_locations_names = [];
	    this.props.instance.postingLocationRooms.map((item,i) => {
	      posting_locations_names.push(item.name);
	    })
	    let that =  this;
	    console.log('warning: ', this.props.warning);
	    return(
			<tr>
				<td>
					{ this.props.warning ? <a href='#' onClick={this.showBalloon}><span>{this.props.instance.name}</span><i className="fa fa-exclamation-triangle" aria-hidden="true"></i></a> : <span>{this.props.instance.name}</span>}
					
				</td>
				<td>
					<ul>
						{posting_locations_names.map((e, i) => <li key={i} ><span>{this.props.instance.streamType == "IM" ? Factory.labelPostingLocations : e} { (i < posting_locations_names.length-1) ? ", " : ""}</span></li>)}
						{posting_locations_names.length === 0 && this.props.instance.streamType == "IM" && (<li><span>{Factory.labelPostingLocations +  config.app_title}</span></li>)}
					</ul>
				</td>
				<td>
					<span>My Trello Board</span>
				</td>
				<td>
					<span>{this.props.instance.lastPosted}</span>
				</td>
				<td>
					<div>
						{ this.props.warning ? <span>Edit</span> : <a href="javascript:void(null)" onClick={this.onClickEdit} >Edit</a> }
						{ this.props.warning ? <a href="javascript:void(null)" className="btn-remove" onClick={this.onClickRemoveInstance} >Remove</a> : <a href="javascript:void(null)" className="btn-remove" onClick={this.onClickRemove} >Remove</a>}
					</div>
				</td>
			</tr>
	    )
	}
}
DataRow.propTypes = {
	instance: React.PropTypes.object.isRequired,
	warning: React.PropTypes.bool,
	showMessage: React.PropTypes.func.isRequired
}
DataRow.defaultProps = {
	warning: false
}

export default ListView;

import React from 'react';
import { hashHistory } from 'react-router';
import Store from '../stores/SaveWebHookStore';
import Actions from '../actions/SaveWebHookActions';
import Factory from '../js/factory';
import Utils from '../js/utils.service';

class SaveWebHook extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.state = Store.getState();
		this.callSetNewInstance = this.callSetNewInstance.bind(this);
		this.createTrelloWebhook = this.createTrelloWebhook.bind(this);
		this.updateTrelloWebhook = this.updateTrelloWebhook.bind(this);
		this.removeTrelloWebhook = this.removeTrelloWebhook.bind(this);
		this.callUpdateInstance = this.callUpdateInstance.bind(this);
		this.callRemoveInstance = this.callRemoveInstance.bind(this);
		this.getService = this.getService.bind(this);
		this.clearTimeoutError = this.clearTimeoutError.bind(this);
		this.getStreamService = this.getStreamService.bind(this);
		this.checkExistingIM = this.checkExistingIM.bind(this);
		this.timestampToDate = this.timestampToDate.bind(this);
		this.streams = [];
		this.timeout = setTimeout(() => {
			hashHistory.push('/list-view/error');
		}, Factory.timeout);
	}

	componentWillMount() {
		Store.listen(this.onChange);
		Actions.getToken();
	}

	getStreamService() {
		return SYMPHONY.services.subscribe('stream-service');
	}

	componentDidMount() {
		// integration config services
        let integrationFactory = this.getService();
        // IM service
        let streamService = this.getStreamService();

        // Build Optional Properties
        let str_notifications = '', str_streams = str_notifications;
        let postingLocationRooms = Factory.instance.postingLocationRooms.slice();
        let notifications = Factory.instance.notifications.slice();
        postingLocationRooms.map((item,i) => {
    		str_streams += "\""+ item.threadId +"\"";
			if(i < postingLocationRooms.length-1) {
				str_streams += ",";
			}	
        });
        notifications.map((item,i) => {
        	str_notifications += "\""+ item +"\"";
			if(i < notifications.length-1) {
				str_notifications += ",";
			}
        });

        let optionalProperties;
		Factory.instance.postingLocationRooms.map((item,i) => {
			this.props.streams.push(item.threadId);
		})
		
		// TYPE STREAM IS IM
        if(Factory.instance.streamType == "IM") {
        	
        	// UPDATE IM
			if(this.props.params.operation === 'update') {
				let streamId;
				let promisedIM = streamService.createIM([Factory.botUserId]);
				promisedIM.then((data) => {
					streamId = data.id;
					optionalProperties = "{\"owner\":\""+ Factory.userId +"\",\"streams\":[\""+ data.id +"\"],\"streamType\":\""+ Factory.instance.streamType +"\",\"modelId\":\""+ Factory.instance.modelId +"\",\"boardName\":\""+ Factory.instance.boardName +"\",\"notifications\":["+ str_notifications +"]}";
					let payload = {
			        	instanceId: Factory.instance.instanceId,
						configurationId: Factory.configurationId,
						name: Factory.instance.name,
						optionalProperties: optionalProperties
					}
					let updateInstance = integrationFactory.updateConfigurationInstanceById(Factory.configurationId, Factory.instance.instanceId, payload);
					updateInstance.then((res) => {
						if (!this.checkExistingIM()) {
							Utils.sendWelcomeMessage([data.id], res.instanceId);
						}
						this.updateTrelloWebhook(res);
					},(error) => {
						this.clearTimeoutError();
						hashHistory.push('/list-view/error');
					})
				},(error) => {
					this.clearTimeoutError();
					hashHistory.push('/list-view/error');
				});
				
			}
			// REMOVE IM
			else if(this.props.params.operation === 'remove') {
				this.removeTrelloWebhook();
			} 
			// REMOVE ONLY THE INSTANCE
			else if(this.props.params.operation === 'remove-instance') {
				this.callRemoveInstance();
			}
			// CREATE IM
			else if(this.props.params.operation === 'create') {
				let streamId;
				// request the IM stream from service
				let promisedIM = streamService.createIM([Factory.botUserId]);
				promisedIM.then((data) => {
					streamId = data.id;
					optionalProperties = "{\"owner\":\""+ Factory.userId +"\",\"streams\":[\""+ data.id +"\"],\"streamType\":\""+ Factory.instance.streamType +"\",\"modelId\":\""+ Factory.instance.modelId +"\",\"boardName\":\""+ Factory.instance.boardName +"\",\"notifications\":["+ str_notifications +"]}";
					let payload = {
						configurationId: Factory.configurationId,
						name: Factory.instance.name,
						creatorId: Factory.userId,
						optionalProperties: optionalProperties
					}
					let saveInstance = integrationFactory.createConfigurationInstance(Factory.configurationId, payload);
					saveInstance.then((res) => {
						if (!this.checkExistingIM()) {
							Utils.sendWelcomeMessage([data.id], res.instanceId);
						}
						this.createTrelloWebhook(res);
					}, (error) => {
						this.clearTimeoutError();
						hashHistory.push('/list-view/error');
					})
				},(error) => {	
					this.clearTimeoutError();
					hashHistory.push('/list-view/error');
				})
			}
        } 
        // TYPE STREAM IS CHATROOM
        else if(Factory.instance.streamType == "CHATROOM") {
        	// UPDATE Chat room
        	if(this.props.params.operation === 'update') {
        		optionalProperties = "{\"owner\":\""+ Factory.userId +"\",\"streams\":["+ str_streams +"],\"streamType\":\""+ Factory.instance.streamType +"\",\"modelId\":\""+ Factory.instance.modelId +"\",\"boardName\":\""+ Factory.instance.boardName +"\",\"notifications\":["+ str_notifications +"]}";
        		if(this.props.streams.length > 0) {
					var promises = [];
					for(var str in this.props.streams) {
						promises.push(streamService.addRoomMembership(this.props.streams[str],Factory.botUserId));
					}
					Promise.all(promises).then((data) => {
						updateRooms(data);
					},(err) => {
						this.clearTimeoutError();
						hashHistory.push('/list-view/error');
					})	
				} else {
					updateRooms();
				}
				let that = this;
				function updateRooms(dataRoom) {
					let streamId = dataRoom.streamId;
					// #2 after the bot user was added to all rooms, call the service to update the instance ...
					var payload = {
			        	instanceId: Factory.instance.instanceId,
			        	configurationId: Factory.configurationId,
						name: Factory.instance.name,
						optionalProperties: optionalProperties
					}
					var updateInstance = integrationFactory.updateConfigurationInstanceById(Factory.configurationId, Factory.instance.instanceId, payload);
					updateInstance.then((data) => {
						Utils.sendWelcomeMessage(Factory.instance.newPostingLocationsRooms, data.instanceId);
						that.updateTrelloWebhook(data);
					},(error) => {
						that.clearTimeoutError();
						hashHistory.push('/list-view/error');
					})
				}
        	}

        	// REMOVE Chat room
			else if(this.props.params.operation === 'remove') {
				this.removeTrelloWebhook();
			} 
			// REMOVE ONLY THE INSTANCE
			else if(this.props.params.operation === 'remove-instance') {
				this.callRemoveInstance();
			}
			// CREATE Chat room
			else if(this.props.params.operation === 'create') {
				optionalProperties = "{\"owner\":\""+ Factory.userId +"\",\"streams\":["+ str_streams +"],\"streamType\":\""+ Factory.instance.streamType +"\",\"modelId\":\""+ Factory.instance.modelId +"\",\"boardName\":\""+ Factory.instance.boardName +"\",\"notifications\":["+ str_notifications +"]}";
				if(this.props.streams.length > 0) {
					let promises = [];
					for(var str in this.props.streams) {
						promises.push(streamService.addRoomMembership(this.props.streams[str],Factory.botUserId));
					}
					Promise.all(promises).then((data) => {
						createRooms(data);
					},(err) => {
						this.clearTimeoutError();
						hashHistory.push('/list-view/error');
					});
				} else {
					createRooms();
				}
				let that = this;
				function createRooms(dataRoom) {
					let streamId = dataRoom.streamId;
					// #2 after the bot user was added to all rooms, call the service to create a new instance ...
					let payload = {
						configurationId: Factory.configurationId,
						name: Factory.instance.name,
						creatorId: Factory.userId,
						optionalProperties: optionalProperties
					}
					let saveInstance = integrationFactory.createConfigurationInstance(Factory.configurationId, payload);
					saveInstance.then((data) => {
						Utils.sendWelcomeMessage(Factory.instance.newPostingLocationsRooms, data.instanceId);
						that.createTrelloWebhook(data);
					}, (error) => {
						that.clearTimeoutError();
						hashHistory.push('/list-view/error');
					})
				}
			}
        }
    }

    checkExistingIM() {
    	const im = Factory.instanceList.filter(item => item.streamType === 'IM');
    	return im.length > 0 ? true : false;
    }

    createTrelloWebhook(data) {
    	let url = Factory.baseURL +'/v1/whi/'+ Factory.appId +'/'+ Factory.configurationId + '/' + data.instanceId;
		// url for debug below
		// let url = 'http://www.google.com?configurationId='+ Factory.configurationId +'&instanceId='+ data.instanceId;
		
		let that = this;
		let query = 'https://api.trello.com/1/webhooks?key=fe8bc43a2d11ecfc6d093d354be708d6&token='+ this.state.token;
		let params = {
			description: Factory.instance.name,
			callbackURL: url,
			idModel: Factory.instance.modelId
		}
		$.ajax({
			url: query,
			type:'POST',
			data: params,
			success: success,
			error: error
		});
		function success(msgSuccess) {
			that.callSetNewInstance(data);
			hashHistory.push('/list-view/created');
		}
		function error(msgError) {
			Factory.resetInstance();
			that.clearTimeoutError();
			hashHistory.push('/list-view/error');
		}
	}

	updateTrelloWebhook(data) {
		let url = Factory.baseURL +'/v1/whi/'+ Factory.appId +'/'+ Factory.configurationId + '/' + data.instanceId;
		// url for debug below
		// let url = 'http://www.google.com?configurationId='+ Factory.configurationId +'&instanceId='+ data.instanceId;

		let that = this;
		let query = '/tokens/'+ this.state.token +'/webhooks';
		Trello.get(query, success, error);
		function success(res) {
			// catch the webhook to be updated
			let webhook_id = res.filter((item) => item.callbackURL === url)[0].id;
			//Update Trello Webhook
			let queryPut = 'https://api.trello.com/1/webhooks/'+ webhook_id + '/idModel?key=fe8bc43a2d11ecfc6d093d354be708d6&token='+ that.state.token;
			$.ajax({
				url: queryPut,
				type:'PUT',
				data: { value: Factory.instance.modelId },
				success: successUpdate,
				error: errorUpdate
			});
			function successUpdate(msg) {
				that.callUpdateInstance(data);
				hashHistory.push('/list-view/updated');
			} 
			function errorUpdate(msg) {
				Factory.resetInstance();
				that.clearTimeoutError();
				hashHistory.push('/list-view/error');
			}
		}
		function error(msgError) {
			Factory.resetInstance();
			that.clearTimeoutError();
			hashHistory.push('/list-view/error');
		}
	}

	removeTrelloWebhook() {
		let url = Factory.baseURL +'/v1/whi/'+ Factory.appId +'/'+ Factory.configurationId + '/' + Factory.instance.instanceId;
		// url for debug below
		// let url = 'http://www.google.com?configurationId='+ Factory.configurationId +'&instanceId='+ Factory.instance.instanceId;

		let query = '/tokens/'+ this.state.token +'/webhooks';
		Trello.get(query, success, error);
		let that = this;
		function success(res) {
			// catch the webhook to be removed
			let webhook_id = res.filter((item) => item.callbackURL === url)[0].id;
			let queryDelete = '/webhooks/'+ webhook_id +'?token='+ that.state.token;
			Trello.delete(queryDelete, successDeleted, errorDeleted);
			function successDeleted(msg) {
				that.callRemoveInstance();
			}
			function errorDeleted(msgError) {
				Factory.resetInstance();
				that.clearTimeoutError();
				hashHistory.push('/list-view/error');
			}
		}
		function error(msgError) {
			Factory.resetInstance();
			that.clearTimeoutError();
			hashHistory.push('/list-view/error');

		}		
	}

	// callSetNewInstance 		set new instance on configurator service
	callSetNewInstance(_data) {
		Factory.instance.instanceId = _data.instanceId;
		let obj_OP = JSON.parse(_data.optionalProperties);
		Factory.setNewInstance({
			streams: this.props.streams,
			name: Factory.instance.name,
			configurationId: Factory.configurationId,
			postingLocationRooms: Factory.instance.postingLocationRooms.slice(),
			notPostingLocationRooms: Factory.instance.notPostingLocationRooms.slice(),
			instanceId: Factory.instance.instanceId,
			lastPosted: obj_OP.lastPostedDate ? this.timestampToDate(obj_OP.lastPostedDate) : 'not available',
			notifications: Factory.instance.notifications,
			modelId: Factory.instance.modelId,
			boardName: Factory.instance.boardName,
			streamType: Factory.instance.streamType
		});
		Factory.resetInstance();
		this.clearTimeoutError();
	}

	callUpdateInstance(_data) {
		Factory.instance.instanceId = _data.instanceId;
		let obj_OP = JSON.parse(_data.optionalProperties);
		Factory.updateInstance(Factory.instance.instanceId ,{
			streams: this.props.streams,
			name: Factory.instance.name,
			configurationId: Factory.configurationId,
			postingLocationRooms: Factory.instance.postingLocationRooms.slice(),
			notPostingLocationRooms: Factory.instance.notPostingLocationRooms.slice(),
			instanceId: Factory.instance.instanceId,
			lastPosted: obj_OP.lastPostedDate ? this.timestampToDate(obj_OP.lastPostedDate) : 'not available',
			notifications: Factory.instance.notifications,
			modelId: Factory.instance.modelId,
			boardName: Factory.instance.boardName,
			streamType: Factory.instance.streamType
		});
		Factory.resetInstance();
		this.clearTimeoutError();
	}

	// callRemoveInstance 		remove the instance on configurator service
	callRemoveInstance() {
		let integrationFactory = this.getService();
		let deactivateInstance = integrationFactory.deactivateConfigurationInstanceById(Factory.configurationId, Factory.instance.instanceId);
		deactivateInstance.then((data) => {
			Factory.removeInstanceById(Factory.instance.instanceId);
			Factory.resetInstance();
			this.clearTimeoutError();
			hashHistory.push('/list-view/deactivated');
		},(error) => {
			Factory.resetInstance();
			this.clearTimeoutError();
			hashHistory.push('/list-view/error');
		})
	}

	getService() {
		return SYMPHONY.services.subscribe("integration-config");
	}

	clearTimeoutError() {
		let tmr = this.timeout;
		clearTimeout(tmr);
	}

	onChange(state) {
		this.setState(state);
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	// timestampToDate          format unix timestamp in date format
	timestampToDate(_ts) {
		const date = new Date(Number(_ts));
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        return month  +' '+ date.getDate() +', '+date.getFullYear();
	}

	render() {
		return(
			<div>
				<div className="spinner"><div><i className="fa fa-circle-o-notch fa-spin"></i></div><p>{Factory.messages.working}</p></div>
			</div>
		);
	}
}
SaveWebHook.propTypes = {
	streams: React.PropTypes.arrayOf(React.PropTypes.string),
	params: React.PropTypes.object,
	timeout: React.PropTypes.number
}
SaveWebHook.defaultProps = {
	streams: [] 
}
export default SaveWebHook
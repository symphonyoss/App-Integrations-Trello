import React from 'react';
import Store from './stores/EditPostingLocationStore'
import Actions from './actions/EditPostingLocationActions'
import SearchRooms from '../SearchRooms/SearchRooms'
import Factory from '../../js/factory'
import config from '../../js/config';
import Utils from '../../js/utils.service';

let extendedUserService;

class EditPostingLocation extends React.Component {
	constructor(props) {
		super(props);

		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
		this.onChangeRadio = this.onChangeRadio.bind(this);
		this.onChangeSearch = this.onChangeSearch.bind(this);
		this.addFilter = this.addFilter.bind(this);
		this.removeFilter = this.removeFilter.bind(this);
		this.clearInput = this.clearInput.bind(this);
	}

	componentWillMount() {
		extendedUserService = SYMPHONY.services.subscribe("extended-user-service");	
	}

	componentDidMount() {
		Store.listen(this.onChange);

		let _instance = Factory.instanceList.filter((item)	=> item.instanceId == this.props.instanceId);
		Factory.instance.instanceId = _instance[0].instanceId;
		Factory.instance.name = _instance[0].name;
		Factory.instance.creatorId = Factory.userId;
		Factory.instance.postingLocationRooms = _instance[0].postingLocationRooms.slice();
		Factory.instance.created = _instance[0].created;
		Factory.instance.lastPostedDate = _instance[0].lastPostedTimestamp;
		Factory.instance.notPostingLocationRooms = _instance[0].notPostingLocationRooms.slice();
		Factory.instance.streamType = _instance[0].streamType;
		if(Factory.instance.streamType == "IM") {
			this.refs.oneOne.checked = true;
			Factory.instance.streamType = "IM";
		} else if(_instance[0].postingLocationRooms.length > 0) {
			this.refs.chatRoom.checked = true;
			this.setState({
				showSearch: true,
				rooms: _instance[0].notPostingLocationRooms.slice(), //rooms: SYMPHONY.getRooms
				filters: _instance[0].postingLocationRooms.slice(),
			});
		} else {
			this.setState({
				rooms: Factory.userChatRooms.slice(),
				showSearch: true
			})	
			this.refs.chatRoom.checked = true;
			Factory.required.rooms = true;
		}

		let oneOneLabel = 'New one-on-one chat';
		for(var instance of Factory.instanceList){
			if(instance.streamType === "IM"){
				oneOneLabel = 'Existing one-on-one chat with '+ config.app_title;
				break;
			}
		}
		this.setState({
			oneOneLabel: oneOneLabel
		});
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChangeRadio(e) {
		this.setState({
			checked: e.target.checked
		})
		if(e.target.id === 'chat-room') {
			Factory.instance.streamType = "CHATROOM";
			this.setState({
				showSearch: true,
				rooms: Factory.userChatRooms.slice()//rooms: SYMPHONY.getRooms
			});
		} else if(e.target.id == 'one-one') {
			Factory.instance.streamType = "IM";
			Factory.required.rooms = false;
			this.setState({
				showSearch: false,
				filteredRooms: [],
				filters: [],
			});
			Factory.instance.postingLocationRooms = [];
			Factory.instance.notPostingLocationRooms = Factory.userChatRooms.slice();
		}
	}

	onChangeSearch(e) {
		Utils.getUpdatedRooms(extendedUserService, () => {
			this.setState({
	        	rooms: Factory.userChatRooms
	        });
	    });
		let suggestionList = this.state.rooms.slice();
		this.setState({
			filteredRooms: suggestionList
		})
		if(e.target.value === "") {
			this.setState({
				filteredRooms: []
			});
			return;
		} 
		var _filters = this.state.filters.slice();
		_filters.map((item, i) => {
			suggestionList.map((_item, j) => {
				if(item['threadId'] === _item['threadId'])
					suggestionList.splice(j,1);
			})
		})
		suggestionList = suggestionList.filter((item) => item['name'].toLowerCase().search(e.target.value.toLowerCase()) !== -1);
		this.setState({
			filteredRooms: suggestionList
		});
	}

	addFilter(elem, event) {
		let _filters = this.state.filters.concat([elem]);
		this.setState({
			filters: _filters,
			filteredRooms: []
		})
		Factory.instance.newPostingLocationsRooms.push(elem.threadId);
		let _postingRooms = Factory.instance.postingLocationRooms.length > 0 ? Factory.instance.postingLocationRooms.slice() : [] ;
		let _notPostingRooms = Factory.instance.notPostingLocationRooms.length > 0 ? Factory.instance.notPostingLocationRooms.slice() : Factory.userChatRooms.slice();
		_postingRooms.push(elem);
		_notPostingRooms.map((item, i) => {
			if(item['threadId'] == elem['threadId']) {
				_notPostingRooms.splice(i,1);
				this.setState({
					rooms: _notPostingRooms.slice()
				})
				return;
			}
		})
		Factory.instance.postingLocationRooms = _postingRooms.slice();
		Factory.instance.notPostingLocationRooms = _notPostingRooms.slice();
		return false;
	}

	removeFilter(elem, target) {
		let suggestionsList = Factory.instance.notPostingLocationRooms.slice();
		let _filteredRooms = this.state.filteredRooms.slice();
		let _filters = this.state.filters.slice();
		let _postingRooms = Factory.instance.postingLocationRooms.length > 0 ? Factory.instance.postingLocationRooms.slice() : [] ;
		let _notPostingRooms = Factory.instance.notPostingLocationRooms.slice();
		let _newPostingRooms = Factory.instance.newPostingLocationsRooms.slice();
		_postingRooms.map((item, i) => {
			if(item['threadId'] == elem['threadId']) {
				_notPostingRooms.push(item);
				_postingRooms.splice(i,1);
				Factory.instance.postingLocationRooms = _postingRooms.slice();
				Factory.instance.notPostingLocationRooms = _notPostingRooms.slice();
				this.setState({
					rooms: _notPostingRooms.slice()
				})
				return;
			}
		})
		_filters.map((item, i) => {
			if(item['threadId'] == elem['threadId']) {
				_filters.splice(i,1);
				_filteredRooms.push(elem);
				this.setState({
					filters: _filters,
					filteredRooms: _filteredRooms
				})
				return;
			}
		})
		if(target.value === "") {
			this.setState({
				filters: _filters,
				filteredRooms: []
			});
			return;
		}
		_filteredRooms = _filteredRooms.filter((item) => item['name'].toLowerCase().search(target.value.toLowerCase()) !== -1);
		_newPostingRooms.map(item => {
			if (item === elem['threadId']) {
				_newPostingRooms.splice(i,1);
				Factory.instance.newPostingLocationsRooms = _newPostingRooms.slice();
				return;
			}
		});
		this.setState({
			filteredRooms: _filteredRooms
		})
	}

	clearInput() {
		this.setState({
			filteredRooms: []
		});
	}

	onChange(state) {
		this.setState(state);
	}

	render() {
		return(
			<div className="posting-location-container">
				<h5>Posting Location</h5>
				<div className="radio-group">
					<div className="radio">
						<input id="one-one" type="radio" onChange={this.onChangeRadio} className="with-font" value="one-one" name="posting" ref="oneOne"/>
						<label htmlFor="one-one">{this.state.oneOneLabel}</label>
					</div>
					<div className="radio top">
						<input id="chat-room" ref="chatRoom" type="radio" onChange={this.onChangeRadio} value="chat-room" name="posting" />
						<div className="posting-location-warning"><label htmlFor="chat-room">Existing chat room</label><h6>You can only add this integration to a room of which you are an <strong>owner</strong>. You can choose one or more rooms.</h6></div>
					</div>
				</div>
				{this.state.showSearch && (<SearchRooms filters={this.state.filters} filteredRooms={this.state.filteredRooms} rooms={this.state.rooms} onChangeInput={this.onChangeSearch} callAddFilter={this.addFilter} callRemoveFilter={this.removeFilter} callClearInput={this.clearInput} />)}
			</div>
		);
	}
}

EditPostingLocation.propTypes = {
	instanceId: React.PropTypes.string.isRequired
}

export default EditPostingLocation
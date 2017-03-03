import React from 'react'
import ReactDOM from 'react-dom'
import Store from './stores/PostingLocationStore'
import Actions from './actions/PostingLocationActions'
import SearchRooms from '../SearchRooms/SearchRooms'
import Factory from '../../js/factory'
import config from '../../js/config'
import Utils from '../../js/utils.service';

let extendedUserService;

class PostingLocation extends React.Component {
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
		Actions.updateUserChatRooms();
		this.refs.oneOne.checked = true;
		Factory.instance.streamType = 'IM';

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

	onChange(state) {
		this.setState(state);
	}

	onChangeRadio(e) {
		this.setState({
			checked: e.target.checked
		})
		if(e.target.id === 'chat-room') {
			Factory.instance.streamType = 'CHATROOM';
			Actions.updateUserChatRooms();
			this.setState({
				showSearch: true
			});
		} else if(e.target.id === 'one-one') {
			Factory.instance.streamType = 'IM';
			Factory.required.rooms = false;
			this.state.required = false;
			this.setState({
				showSearch: false,
				filteredRooms: [],
				filters: [],
			});
		}
	}

	onChangeSearch(e) {
		Utils.getUpdatedRooms(extendedUserService, () => {
			this.setState({
	        	rooms: Factory.userChatRooms
	        });
	    });
		let suggestionsList = this.state.rooms.slice();
		if(e.target.value === "") {
			this.setState({
				filteredRooms: []
			});
			return;
		}
		let _filters = this.state.filters.slice();
		_filters.map((item, i) => {
			suggestionsList.map((_item, j) => {
				if(item['threadId'] === _item['threadId'])
					suggestionsList.splice(j,1);
			})
		})
		suggestionsList = suggestionsList.filter((item) => item['name'].toLowerCase().search(e.target.value.toLowerCase()) !== -1);
		this.setState({
			filteredRooms: suggestionsList
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
		let _rooms = Factory.instance.notPostingLocationRooms.length > 0 ? Factory.instance.notPostingLocationRooms.slice() : Factory.userChatRooms.slice();
		_postingRooms.push(elem);
		_rooms.map((item, i) => {
			if(item['threadId'] == elem['threadId']) {
				_rooms.splice(i,1);
				return;
			}
		})
		Factory.instance.postingLocationRooms = _postingRooms.slice();
		Factory.instance.notPostingLocationRooms = _rooms.slice();
		return false;
	}

	removeFilter(elem, target) {
		let _filteredRooms = this.state.filteredRooms.slice();
		let _filters = this.state.filters.slice();
		let _postingRooms = Factory.instance.postingLocationRooms.length > 0 ? Factory.instance.postingLocationRooms.slice() : [] ;
		let _rooms = Factory.instance.notPostingLocationRooms;
		let _newPostingRooms = Factory.instance.newPostingLocationsRooms.slice();
		_postingRooms.map((item, i) => {
			if(item['threadId'] == elem['threadId']) {
				_rooms.push(item);
				_postingRooms.splice(i,1);
				Factory.instance.postingLocationRooms = _postingRooms.slice();
				Factory.instance.notPostingLocationRooms = _rooms.slice();
				return;
			}
		})
		_filters.map((item, i) => {
			if(item['threadId'] == elem['threadId']) {
				_filters.splice(i,1);
				_filteredRooms.push(elem);
				this.setState({
					filters: _filters
				});
				return;
			}
		})
		_filteredRooms = _filteredRooms.filter((item) => item['name'].toLowerCase().search(target.value.toLowerCase()) !== -1);
		_newPostingRooms.map(item => {
			if (item === elem['threadId']) {
				_newPostingRooms.splice(i,1);
				Factory.instance.newPostingLocationsRooms = _newPostingRooms.slice();
				return;
			}
		});
		if(target.value === "") {
			this.setState({
				filters: _filters,
				filteredRooms: []
			});
			return;
		}
		this.setState({
			filters: _filters,
			filteredRooms: _filteredRooms
		});
	}

	clearInput() {
		this.setState({
			filteredRooms: []
		});
	}

	render() {
		return(
			<div className='posting-location-container'>
				<h5>Posting Location</h5>
				<div className="radio-group">
					<div className="radio">
						<input id="one-one" type="radio" onChange={this.onChangeRadio} value="one-one" name="posting" ref="oneOne"/>
						<label htmlFor="one-one">{this.state.oneOneLabel}</label>
					</div>
					<div className="radio top">
						<input id="chat-room" ref="chatRoom" type="radio" onChange={this.onChangeRadio} value="chat-room" name="posting" />
						<div className="posting-location-warning"><label htmlFor="chat-room">Existing chat room</label><h6>You can only add this integration to a room of which you are an <strong>owner</strong>. You can choose one or more rooms.</h6></div>
					</div>
				</div>
				{ this.state.showSearch && (<SearchRooms filters={this.state.filters} filteredRooms={this.state.filteredRooms} rooms={this.state.rooms} onChangeInput={this.onChangeSearch} callAddFilter={this.addFilter} callRemoveFilter={this.removeFilter} callClearInput={this.clearInput} />) }
			</div>
		);
	}
}

export default PostingLocation;
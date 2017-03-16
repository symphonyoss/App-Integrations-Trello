import React from 'react'
import ReactDOM from 'react-dom'
import Store from './stores/SearchRoomsStore'
import Actions from './actions/SearchRoomsActions'
import SuggestionsList from '../SuggestionsList/SuggestionsList'
import FilterBox from '../FilterBox/FilterBox'
import Factory from '../../js/factory'

class SearchRooms extends React.Component {
	constructor(props) {
		super(props);
		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
		this.clearInputSearch = this.clearInputSearch.bind(this);
		this.onChangeInput = this.onChangeInput.bind(this);
		this.addFilterBox = this.addFilterBox.bind(this);
		this.removeFilterBox = this.removeFilterBox.bind(this);
		this.inputListener = this.inputListener.bind(this);
		this.listListener = this.listListener.bind(this);
	}

	componentWillMount() {
		let _filters = [];
		this.props.filters.map((elem, idx) => {
			_filters.push(elem);
		});
		this.setState({
			filters: _filters 
		});

		if(this.props.filters.length > 0) {
			this.setState({
				filled: true,
				required: false
			})
			Factory.required.rooms = false;
		} else {
			Factory.required.rooms = true;
		}
	}

	componentDidMount() {
		Store.listen(this.onChange);
		let input = this.refs.inputSearch;
		input.focus();
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	inputListener() {
		let idx = this.state.focused;
		let input = this.refs.inputSearch;
		if(document.getElementsByTagName("ul")[0] !== undefined) {
			if(event.keyCode == "40") { //down
				input.blur();
				input.removeEventListener('keydown', this.inputListener);
				if(this.props.filteredRooms.length > 0 && idx < this.props.filteredRooms.length) {
					idx++;
					document.getElementsByTagName("ul")[0].focus();
					document.getElementsByTagName("ul")[0].addEventListener('keydown', this.listListener);
				}
			}
			this.setState({
				focused: idx
			});
		}
	}

	listListener() {
		let idx = this.state.focused;
		let input = this.refs.inputSearch;
		if(event.keyCode == "40") { //down
			if(this.props.filteredRooms.length > 0 && idx < this.props.filteredRooms.length-1) {
				idx++;
			}
		} else if(event.keyCode == "38") { //up
			if(idx > 0) {
				idx--;
			} else {
				idx = -1;
				document.getElementsByTagName("ul")[0].removeEventListener('keydown', this.listListener);
				var _tmr = setInterval(function(){
					if(input.value != "") {
						clearInterval(_tmr);
						input.focus();	
					}
				},50);
				input.addEventListener('keydown', this.inputListener);
			}
		}
		this.setState({
			focused: idx
		})
	}

	addFilterBox(elem, event) {
		let input = this.refs.inputSearch;
		this.setState({
			filters: this.state.filters.concat([elem])
		});
		this.props.callAddFilter(elem, event);
		input.value = "";
		input.focus();
		this.setState({
			filled: true,
			required: false,
			focused: -1
		})
		Factory.required.rooms = false;
		input.addEventListener('keydown', this.inputListener);
	}

	removeFilterBox(elem) {
		let _filters = this.state.filters.slice();
		_filters.map((item, i) => {
			if(item['threadId'] === elem['threadId']) {
				_filters.splice(i,1);
			}
		});
		this.setState({
			filters: _filters
		});
		if (_filters.length == 0) {
			this.setState({
				filled: false,
				required: true
			});
			Factory.required.rooms = true;
		};
		this.refs.inputSearch.focus();
		this.props.callRemoveFilter(elem, this.refs.inputSearch);
	}

	onChangeInput(e) {
		let input = e.target;
		this.props.onChangeInput(e);
		if(input.value != "") {
			if(!this.state.listening) {
				this.setState({
					listening: true
				})
				input.addEventListener('keydown', this.inputListener);
			}
		} else if(input.value == "") {
			this.setState({
				listening: false
			})
			input.removeEventListener('keydown', this.inputListener);
		}
	}

	clearInputSearch() {
		this.refs.inputSearch.value = "";
		this.refs.inputSearch.focus();
		this.props.callClearInput();
		return false;
	}

	render() {
		return(
			<div className="posting-location-container">
				<div className="input-container">
					<div className="input-search-rooms-container">
						<a href="javascript:void(null)" className="clear" onClick={this.clearInputSearch}><i className="fa fa-times"></i></a>
						<input type="text" className="input-posting-location" placeholder="Search rooms" ref="inputSearch" onChange={this.onChangeInput} disabled={this.state.saved} autoFocus />
					</div>
					<div className="list-container">
						<div className="list-rooms-container">
							{this.props.filteredRooms.length > 0 && (<SuggestionsList items={this.props.filteredRooms} callAddFilter={this.addFilterBox} focusItem={this.state.focused} />)}
						</div>
						<div className={this.props.filteredRooms.length > 0 ? "filter-box-container-hide" : "filter-box-container"}>
							{this.state.filters.map((item, idx) => <FilterBox room={item} key={idx} callRemoveFilter={this.removeFilterBox} /> )}
						</div>
					</div>
				</div>
				{!this.state.filled && (<span className="required"><i className="fa fa-asterisk" aria-hidden="true"></i></span>)}
			</div>
		);
	}
}
SearchRooms.propTypes = {
	filteredRooms: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
	rooms: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
	filters: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
	onChangeInput: React.PropTypes.func.isRequired,
	callAddFilter: React.PropTypes.func.isRequired,
	callRemoveFilter: React.PropTypes.func.isRequired,
	callClearInput: React.PropTypes.func.isRequired
}

export default SearchRooms;
	
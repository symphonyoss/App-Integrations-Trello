import React from 'react'
import Store from "./stores/ShowPostingLocationStore";
import Factory from '../../js/factory'

class ShowPostingLocation extends React.Component {
	constructor(props) {
		super(props);
		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
	}

	componentWillMount() {
		Store.listen(this.onChange);
		let _filters = [];
		Factory.instance.postingLocationRooms.map((item,i) => {
			_filters.push(item);
		})
		this.setState({
			filters: _filters.slice()
		});
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	render() {
		return(
			<div className='posting-location-container'>
				{this.state.filters.length > 0 ? <h3>Active in</h3> : <h3>Chat One on One</h3>}
				{this.state.filters.length > 0 && (<SearchRooms filters={this.state.filters} />)}
			</div>
		);
	}
}

export class SearchRooms extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filters: this.props.filters.slice()
		}
	}

	render() {
		return(
			<div className="filter-box-container-success">
				{this.state.filters.map((item, idx) => <FilterBox room={item} key={idx} />)}
			</div>
		);
	}
}
SearchRooms.propTypes = {
	filters: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

export class FilterBox extends React.Component {
	render() {
		let members = this.props.room['memberCount'] > 1 ? this.props.room['memberCount'] +" Members" : this.props.room['memberCount'] +" Member";;
		return(
			<div className="filter-box block">
				{this.props.room['publicRoom'] == false ? <div><span>{this.props.room['name']}</span><span><i className="fa fa-lock"></i></span></div> : <div><span>{this.props.room['name']}</span></div>}
				<div className="room-info">
					<span>{members +", created by "+ this.props.room['creatorPrettyName']}</span>
				</div>
				
			</div>
		);
	}
}
FilterBox.propTypes = {
	room: React.PropTypes.object.isRequired
}

export default ShowPostingLocation
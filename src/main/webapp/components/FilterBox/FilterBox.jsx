import React from 'react';

class FilterBox extends React.Component {
	constructor(props) {
		super(props);

		this.removeFilter = this.removeFilter.bind(this);
	}

	removeFilter() {
		this.props.callRemoveFilter(this.props.room);
		return false;
	}

	render() {
		let members = this.props.room['memberCount'] > 1 ? this.props.room['memberCount'] +" Members" : this.props.room['memberCount'] +" Member";;
		return(
				<div className="filter-box">
					{this.props.room['publicRoom'] == false ? <div><span>{this.props.room['name']}</span><span><i className="fa fa-lock"></i></span><a ref="myLink" href="javascript:void(null)" onClick={this.removeFilter} ><i className="fa fa-times"></i></a></div> : <div><span>{this.props.room['name']}</span><a ref="myLink" href="javascript:void(null)" onClick={this.removeFilter} ><i className="fa fa-times"></i></a></div>}
					<div className="room-info">
						<span>{members +", created by "+ this.props.room['creatorPrettyName']}</span>
					</div>

				</div>
		);
	}
}
FilterBox.propTypes = {
	room: React.PropTypes.object.isRequired,
	callRemoveFilter: React.PropTypes.func.isRequired
}

export default FilterBox
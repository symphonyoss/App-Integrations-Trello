import React from 'react'
import Store from './stores/SuggestionsListStore'
import Actions from './actions/SuggestionsListActions'

class SuggestionList extends React.Component {
	constructor(props) {
		super(props);
		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
		this.addFilter = this.addFilter.bind(this);
	}

	componentWillMount() {
		this.setState({
			items: this.props.items
		});
	}

	componentDidMount() {
		Store.listen(this.onChange);
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	onSetFocus(_val) {
		this.setState({
			focusedItem: _val
		});
	}

	addFilter(item, event) {
		this.props.callAddFilter(item, event);
		return false;
	}

	render() {
		let members;
		return(
			<ul className="room-box" ref="roomsList">
			{
				this.props.items.map((item, idx) => {
					members = item['memberCount'] > 1 ? item['memberCount'] +" Members" : item['memberCount'] +" Member";
					return <li key={idx} >
						<a  href="javascript:void(null)"
							id={item['nameKey']}
							onClick={this.addFilter.bind(this, item)}
							ref={() => {
								if(this.props.focusItem == idx) {
									document.getElementsByTagName("ul")[0].childNodes[idx].childNodes[0].focus();
								}
							}}
						>
							<span>{item['name']}</span> {item['publicRoom'] === false && (<i className="fa fa-lock"></i>)}
							<div className="room-info">
								<span>{members +", created by "+ item['creatorPrettyName']}</span>
							</div>
						</a>
					</li>
				})
			}
			</ul>
		);
	}
}
SuggestionList.propTypes = {
	items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
	callAddFilter: React.PropTypes.func.isRequired,
	focusItem: React.PropTypes.number.isRequired
}

export default SuggestionList;
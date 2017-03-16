import React from 'react';
import Store from './stores/TrelloBoardStore'
import Actions from './actions/TrelloBoardActions'
//import '../../styles/custom-inputs.css'
import Factory from '../../js/factory'

class TrelloBoard extends React.Component {
	constructor(props) {
		super(props);
		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
		this.showBoards = this.showBoards.bind(this);
		this.loadEvents = this.loadEvents.bind(this);
		this.onCheck = this.onCheck.bind(this);
		this.checkRequiredEvents = this.checkRequiredEvents.bind(this);
	}

	componentWillMount() {
		Store.listen(this.onChange);
		Actions.getToken();
		Factory.required.board = true;
		Factory.required.notifications = true;
	}

	componentDidMount() {
		Trello.get('/members/me/boards?token='+ this.state.token, success, fail);
		let that = this;
		function success(data) {
			that.setState({
				boards: data.slice(),
				callback: true
			});
		}

		function fail(err) {
			//console.log(err);
		}
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	showBoards() {
		let h = this.state.itemHeight;
		this.setState({
			showBoards: !this.state.showBoards,
			styles: {
				maxHeight: this.state.styles.maxHeight > 0 ? 0 : this.state.boards.length * h,
				transition: 'max-height 0.25s ease-in'
			}
		});
	}

	loadEvents(e, elem) {
		this.showBoards();
		let boards = this.state.boards.slice();
		let aux;
		setTimeout(()=>{
			this.refs.boardDropDown.innerHTML = e.name;
			boards.map((item,idx) => {
				if(item.name == e.name) {
					aux = item;
					boards.splice(idx,1);
					return;	
				}
			});
			if(this.state.selectedBoard !== null) {
				boards.push(this.state.selectedBoard);
			}
			this.setState({
				selectedBoard: aux,
				boards: boards.slice(),
				hasEvents: true,
			});
			Factory.instance.modelId = e.id;
			Factory.instance.boardName = e.name;
			Factory.required.board = false;
		},250);
	}

	onCheck(e) {
		//let tar = e.target.parentNode.getElementsByTagName('i')[0];
		//tar.className = tar.className === 'fa fa-square-o' ? 'fa fa-check-square-o' : 'fa fa-square-o';
		let idx = null;
		function filterEvent(item,index) {
			if(item === e.target.id) {
				idx = index;
				return true;	
			}
			return item === e.target.id;
		}
		if(Factory.instance.notifications.filter(filterEvent).length > 0) {
			Factory.instance.notifications.splice(idx,1);
		} else {
			Factory.instance.notifications.push(e.target.id);
		}
		this.checkRequiredEvents();
	}

	checkRequiredEvents() {
		let events = Factory.instance.notifications.slice();
		if(events.length > 0) {
			Factory.required.notifications = false;
		} else {
			Factory.required.notifications = true;
		}
	}

	render() {
		let boardListEvents = this.state.trelloEvents.filter(item => item.type === 'board' || item.type === 'list');
		let cardEvents = this.state.trelloEvents.filter(item => item.type === 'card');
		let checkListEvents = this.state.trelloEvents.filter(item => item.type === 'checklist');
		return(
			<div className='trello-board'>
				<h5>Trello Board</h5>
				<div className='trello-board-container'>
					<p>Which Trello notifications would you like to appear in Trello Configurator App?</p>
					<div className="board-select">
						<a href="javascript:void(null)" onClick={this.showBoards}>
							<span ref="boardDropDown">Select one board</span>
							<i className="fa fa-caret-down" aria-hidden="true"></i>
						</a>
						<ul style={ this.state.styles }>
							{this.state.boards.map((item,idx) => <li key={idx}><a href='javascript:void(null)' onClick={this.loadEvents.bind(this,item)}>{item.name}</a></li>)}
						</ul>
					</div>
				</div>
				<div style={ this.state.hasEvents ? this.state.showEvents : this.state.hideEvents }>
					<h5>Which Trello events would you like to be notified from?</h5>
					<div className='board-events'>
						<section className='events'>
							<h5>Board/List Events</h5>
							<ul className='events'>
								{boardListEvents.map((item,idx) =>
								<li key={idx}>
									<input type='checkbox' id={item.notification} onChange={this.onCheck}/>
									<label htmlFor={item.notification}>{item.label}</label>
								</li>
								)}
							</ul>
						</section>
						<section className='events'>
							<h5>Card Events</h5>
							<ul className='events'>
								{cardEvents.map((item,idx) =>
								<li key={idx}>
									<input type='checkbox' id={item.notification} onChange={this.onCheck}/>
									<label htmlFor={item.notification}>{item.label}</label>
								</li>
								)}
							</ul>
						</section>
						<section className='events'>
							<h5>Checklist Events</h5>
							<ul className='events'>
								{checkListEvents.map((item,idx) =>
								<li key={idx}>
									<input type='checkbox' id={item.notification} onChange={this.onCheck}/>
									<label htmlFor={item.notification}>{item.label}</label>
								</li>
								)}
							</ul>
						</section>
					</div>
				</div>
			</div>
		);
	}
}

TrelloBoard.propTypes = {
	notifications: React.PropTypes.arrayOf(React.PropTypes.string),
	modelId: React.PropTypes.string
}

export default TrelloBoard
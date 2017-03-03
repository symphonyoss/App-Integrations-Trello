import React from 'react'
import Factory from '../../js/factory'

class ShowTrelloBoard extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			trelloEvents: [],
			trelloEvents: [],
			trelloEvents: []
		}
	}

	componentWillMount() {
		let notifications = Factory.instance.notifications.slice();
		let trelloEvents = [];
		notifications.map((item, idx)=>{
			switch(item) {
				case 'boardRenamed' : trelloEvents.push({label: 'Board renamed', notification: item});
				break;
				case 'listArchivedUnarchived' : trelloEvents.push({label: 'List archived/unarchived', notification: item});
				break;
				case 'listCreated' : trelloEvents.push({label: 'List created', notification: item});
				break;
				case 'listMovedToOtherBoard' : trelloEvents.push({label: 'List moved to other board', notification: item});
				break;
				case 'listRenamed' : trelloEvents.push({label: 'List renamed', notification: item});
				break;
				case 'memberAddedToBoad' : trelloEvents.push({label: 'Member added to board', notification: item});
				break;
				case 'attachmentAddedToCard' : trelloEvents.push({label: 'Attachment added to card', notification: item});
				break;
				case 'cardArchivedUnarchived' : trelloEvents.push({label: 'Card archived/unarchived', notification: item});
				break;
				case 'cardCreated' : trelloEvents.push({label: 'Card created', notification: item});
				break;
				case 'cardDescriptionChanged' : trelloEvents.push({label: 'Card description changed', notification: item});
				break;
				case 'cardDueDateChanged': trelloEvents.push({label: 'Card due date changed', notification: item});
				break;
				case 'cardLabelChanged' : trelloEvents.push({label: 'Card label changed', notification: item});
				break;
				case 'cardMoved' : trelloEvents.push({label: 'Card moved', notification: item});
				break;
				case 'cardRenamed' : trelloEvents.push({label: 'Card renamed', notification: item});
				break;
				case 'commentAddedToCard' : trelloEvents.push({label: 'Comment added to card', notification: item});
				break;
				case 'memberAddedToCard' : trelloEvents.push({label: 'Member added to card', notification: item});
				break;
				case 'checklistCreated' : trelloEvents.push({label: 'Checklist created', notification: item});
				break;
				case 'convertToCardFromCheckItem' : trelloEvents.push({label: 'Card Converted from Checklist Item', notification: item});
				break;
				break;
				case 'checklistItemCreated' : trelloEvents.push({label: 'Checklist item created', notification: item});
				break; 
				case 'checklistItemUpdated' : trelloEvents.push({label: 'Checklist item updated', notification: item});
				break;
			}
		});
		this.setState({
			trelloEvents: trelloEvents.slice()
		})
	}

	render() {

		return (
			<div className='trello-board-container'>
				<div>
					<h3>Trello Board</h3>
					<p>{this.props.boardName}</p>
				</div>
				<div>
					<h3>Trello Events</h3>
					<div className='board-events'>
						{ this.state.trelloEvents.length > 0 && (
							<div>
								<ul className='events'>
									{this.state.trelloEvents.map((item,idx) => 
									<li key={idx}>
										<i className="fa fa-trello" aria-hidden="true"></i>{item.label}
									</li>
									)}
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
ShowTrelloBoard.propTypes = {
	boardName: React.PropTypes.string.isRequired,
	notifications: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
}

export default ShowTrelloBoard
let trelloEvents = (function () {
	'use strict';

	trelloEvents = [];
	let notifications = ['boardRenamed', 'listArchivedUnarchived', 'listCreated', 'listMovedToOtherBoard', 'listRenamed', 'memberAddedToBoad', 'attachmentAddedToCard', 'cardArchivedUnarchived', 'cardCreated', 'cardDescriptionChanged', 'cardDueDateChanged', 'cardLabelChanged', 'cardMoved', 'cardRenamed', 'commentAddedToCard', 'memberAddedToCard', 'convertToCardFromCheckItem', 'checklistCreated', 'checklistItemCreated', 'checklistItemUpdated'];

	notifications.map((item, idx) => {
		switch(item) {
			case 'boardRenamed' : trelloEvents.push({label: 'Board renamed', notification: item, type: 'board'});
			break;
			case 'listArchivedUnarchived' : trelloEvents.push({label: 'List archived/unarchived', notification: item, type: 'list'});
			break;
			case 'listCreated' : trelloEvents.push({label: 'List created', notification: item, type: 'list'});
			break;
			case 'listMovedToOtherBoard' : trelloEvents.push({label: 'List moved to other board', notification: item, type: 'list'});
			break;
			case 'listRenamed' : trelloEvents.push({label: 'List renamed', notification: item, type: 'list'});
			break;
			case 'memberAddedToBoad' : trelloEvents.push({label: 'Member added to board', notification: item, type: 'board'});
			break;
			case 'attachmentAddedToCard' : trelloEvents.push({label: 'Attachment added to card', notification: item, type: 'card'});
			break;
			case 'cardArchivedUnarchived' : trelloEvents.push({label: 'Card archived/unarchived', notification: item, type: 'card'});
			break;
			case 'cardCreated' : trelloEvents.push({label: 'Card created', notification: item, type: 'card'});
			break;
			case 'cardDescriptionChanged' : trelloEvents.push({label: 'Card description changed', notification: item, type: 'card'});
			break;
			case 'cardDueDateChanged': trelloEvents.push({label: 'Card due date changed', notification: item, type: 'card'});
			break;
			case 'cardLabelChanged' : trelloEvents.push({label: 'Card label changed', notification: item, type: 'card'});
			break;
			case 'cardMoved' : trelloEvents.push({label: 'Card moved', notification: item, type: 'card'});
			break;
			case 'cardRenamed' : trelloEvents.push({label: 'Card renamed', notification: item, type: 'card'});
			break;
			case 'commentAddedToCard' : trelloEvents.push({label: 'Comment added to card', notification: item, type: 'card'});
			break;
			case 'memberAddedToCard' : trelloEvents.push({label: 'Member added to card', notification: item, type: 'card'});
			break;
			case 'checklistCreated' : trelloEvents.push({label: 'Checklist created', notification: item, type: 'checklist'});
			break;
			case 'convertToCardFromCheckItem' : trelloEvents.push({label: 'Card Converted from Checklist Item', notification: item, type: 'checklist'});
			break;
			case 'checklistItemCreated' : trelloEvents.push({label: 'Checklist item created', notification: item, type: 'checklist'});
			break; 
			case 'checklistItemUpdated' : trelloEvents.push({label: 'Checklist item updated', notification: item, type: 'checklist'});
			break;
		}
	});

	return trelloEvents;
}());

export default trelloEvents;
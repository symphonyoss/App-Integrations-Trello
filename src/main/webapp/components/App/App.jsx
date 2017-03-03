import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router';

import ListView from '../../views/ListView'
import CreateView from '../../views/CreateView'
import EditView from '../../views/EditView'
import RemoveView from '../../views/RemoveView'
import SaveWebHook from '../../views/SaveWebHook'
import Factory from '../../js/factory'

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let defaultIndexRoute = Factory.dataResponse > 0 ? ListView : CreateView;
		return (
			<Router history={hashHistory}>
				<Route path='/' component={defaultIndexRoute} />
				<Route path='/list-view(/:status)' component={ListView} />
		    	<Route path='/create-view(/:app_name)' component={CreateView} />
		    	<Route path='/edit-view/:instance_id/:app_name' component={EditView} />
		    	<Route path='/remove-view/:instance_id/:app_name(/:only_instance)' component={RemoveView} />
		    	<Route path='/save-webhook/:operation' component={SaveWebHook} />
		    </Router>
		);
	}
}

export default App;






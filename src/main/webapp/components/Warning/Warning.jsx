import React from 'react'

class Warning extends React.Component {
	constructor(props) {
		super(props);
		this.onClose = this.onClose.bind(this);
	}

	onClose() {
		this.props.onClose();
		return false;
	}

	render() {
		let _class = "";
		switch(this.props.category) {
			case "ERROR": _class = "error";
			break;
			case "WARNING": _class = "warning";
			break;
			case "REQUIRED": _class = "required";
			break;
			default: _class = "success";
			break;
		}
		return(
			<div className={"warning-box "+ _class} id="warning-box">
				<div>
					<p>{this.props.message}</p>
				</div>
				<div>
					<a href="javascript:void(null)" onClick={this.onClose} ><i className="fa fa-times"></i></a>
				</div>
			</div>
		);
	}
}
Warning.propTypes = {
	message: React.PropTypes.string,
	category: React.PropTypes.string,
	onClose: React.PropTypes.func.isRequired
}

export default Warning
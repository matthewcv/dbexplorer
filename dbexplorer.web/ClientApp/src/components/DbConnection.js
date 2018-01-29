import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from "../store/DbConnection";


class DbConnection extends Component {
    render() {
        console.log(this);
        return (
            <div><input defaultValue={this.props.connectionInfo} ref={(input) => this.dbInfoInput = input} /><button onClick={() => this.props.getDbInfo(this.dbInfoInput.value)}>Get It</button></div>
            );
    }
}


export default connect(
    state => state.dbConnection,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(DbConnection);

import React, { Component } from 'react';
import { connect } from 'react-redux';


class DbConnection extends Component {
    render() {
        return (
            <div><input/><button>Get It</button></div>
            );
    }
}


export default connect()(DbConnection);

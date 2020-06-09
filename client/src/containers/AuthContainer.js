import React, {Component} from 'react';
import {connect} from 'react-redux';

import {AuthContext} from '../utils/contextUtils';
import {getAuth} from '../selectors/authSelectors';
import {getCurrentUser} from '../actions/AuthActions';

class AuthContainer extends Component {
  componentDidMount() {
    this.authListener();
  }

  authListener() {
    this.props.getCurrentUser();
  }

  render() {
    const {auth} = this.props;
    return (
      <AuthContext.Provider
        value={{auth: {...auth, authListener: () => this.authListener()}}}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
const mapStateToProps = state => ({auth: getAuth(state)});

export default connect(
  mapStateToProps,
  {getCurrentUser},
)(AuthContainer);

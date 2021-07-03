import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layouts/Alert';
import About from './components/pages/About';
import './App.css';
import axios from 'axios';

class App extends React.Component {
  state = {
    users: [],
    user: {},
    loading: false,
    alert: null,
    repos: []
    
  }

  // async componentDidMount(){
  //   this.setState({ loading: true })
  //   const res = await axios.get(`https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
  //   this.setState({
  //     users: res.data,
  //     loading: false
  //   });
  //   console.log(res.data);
  // }

  clearUsers = () => {
    this.setState({ users: [], loading: false })
  }

  

  setAlert = (message, type) => {
    this.setState({ alert: {message: message, type: type} });
    setTimeout(() => this.setState({ alert: null }), 5000);
  }

  searchUsers = async text => {
    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    this.setState({
      users: res.data.items,
      loading: false
    });
  }

  getUser = async username => {
    this.setState({ loading: true });

    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    this.setState({ user: res.data, loading: false });
  }

  getUserRepos = async repos => {
    this.setState({ loading: true});
    const res = await axios.get(
      `https://api.github.com/users/${repos}/repos?per_page=5&sort=created:asc?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );
    this.setState({ repos: res.data, loading: false });
  }

  render(){
    const {alert,loading,user,users,repos} = this.state;
    return (
      <Router>
      <div className="App">
        <Navbar title="GithubFinder" icon='fab fa-github' />
        <div className='container'>
          <Alert alert={alert} />
          <Switch>
            <Route exact path='/' render={ props => (
              <Fragment>
                <Search searchUsers={this.searchUsers} clearUsers={this.clearUsers} setAlert={this.setAlert} showClear={users.length > 0 ? true : false} />
                <Users loading={loading} users={users} />
              </Fragment>
            )} />
            <Route exact path='/about' component={About} />
            <Route exact path='/user/:login' render={ props => (
              <User { ...props} getUser={this.getUser} loading={loading} user={user} getUserRepos={this.getUserRepos} repos={repos} />
            )} />
          </Switch>
        </div>
      </div>
      </Router>
    );
  }
  
}

export default App;

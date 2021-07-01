import React from 'react';
import Navbar from './components/layouts/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layouts/Alert';
import './App.css';
import axios from 'axios';

class App extends React.Component {
  state = {
    users: [],
    loading: false,
    alert: null
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

  render(){
    return (
      <div className="App">
        <Navbar title="GithubFinder" icon='fab fa-github' />
        <div className='container'>
          <Alert alert={this.state.alert} />

          <Search searchUsers={this.searchUsers} clearUsers={this.clearUsers} setAlert={this.setAlert} showClear={this.state.users.length > 0 ? true : false} />
          <Users loading={this.state.loading} users={this.state.users} />
        </div>
      </div>
    );
  }
  
}

export default App;

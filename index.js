import "babel-polyfill";
import React, { Component } from 'react'
import { render } from 'react-dom'
// retalk
import { createStore as createRetalkStore,withStore } from 'retalk';
//rematch
import { init } from '@rematch/core'
//redux
import { createStore as createReduxStore,applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider, connect } from 'react-redux';

import { BrowserRouter as Router, Link } from "react-router-dom";
import routes from './router';




const loggerMiddleware = createLogger()

//retalk ----begin----
const retalkStore = createRetalkStore({
  count:{
    state:{
      count:0
    },
    actions:{
      add() {
        this.setState({ count: this.state.count+1 })
      },
      async addAsync() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.add();
      }
    }
  }
})
//retalk ----end----

//rematch ----begin ----
const rematchStore = init({
  models:{
    count:{
      state:{
        count:0
      },
      reducers: {
        // handle state changes with pure functions
        add(state,payload) {
          return { count:state.count +1 }
        }
      },
      effects: (dispatch) => ({
        // handle state changes with impure functions.
        // use async/await for async actions
        async addAsync(payload, rootState) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          this.add(payload)
        }
      })
    }
  },
  redux:{
    middlewares:[loggerMiddleware]
  }  
})
const mapState = state => ({ count: state.count.count })
const mapDispatch = ({ count: { add, addAsync }}) => ({
  add: () => add(1),
  addAsync: () => addAsync(1)
})
//rematch ----end----

//redux ----begin----
//action
function addCount(){
  return {
    type:'ADD_COUNT'
  }
}
function addCountAsync(){
  return async (dispatch) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    dispatch({type:'ADD_COUNT_ASYNC'})
  }
}

// store 与 reducer
const reduxStore = createReduxStore((state={count:0},action) => {
  switch(action.type) {
    case 'ADD_COUNT':
    case 'ADD_COUNT_ASYNC':
      return Object.assign({},state,{count:state.count+1})
    default:
      return state
  }
},applyMiddleware(
  thunkMiddleware, // 允许我们 dispatch() 函数
  loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
))
// mapState,mapDispactch
const mapStateToProps = (state) => {
  return {
    count: state.count
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    add: () => {
      dispatch(addCount())
    },
    addAsync:() => {
      dispatch(addCountAsync())
    }
  }
}

//----redux end ----

// @connect(...withStore('count')) //retalk
// @connect(mapStateToProps,mapDispatchToProps) //redux
@connect(mapState,mapDispatch) //rematch
class Test extends Component {
  constructor () {
    super()
  }
  render () {
    let {  count, add, addAsync } = this.props;
    return (<div>
              <input type='text' />
              <span>{ count }</span>
              <button onClick={add}>add</button>
    <button onClick={addAsync}>addAsync</button>
            </div>)
  }
}

render(<Provider store={rematchStore}>
   <Router>
    <div>
    <Test />
    <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/MyTest">MyTest</Link>
        </li>
        <li>
          <Link to="/MyTest1">MyTest1</Link>
        </li>
      </ul>
    { routes }
    </div>
  </Router>
</Provider>, document.getElementById('app'))

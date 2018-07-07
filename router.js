import React,{ Component } from 'react';
import {  Route } from "react-router-dom";

const routes = [{
  path:'/MyTest',
  component:'component'
},{
  path:'/MyTest1',
  component:'component2'
}]

const asyncComponent = loadComponent => (
    class AsyncComponent extends Component {
        constructor() {
          super()
          this.state = {
              Component: null,
          }
        }
        componentWillMount() {
            if (this.hasLoadedComponent()) {
                return;
            }

            loadComponent()
                .then(module => module.default)
                .then((Component) => {
                    this.setState({ Component });
                })
                .catch((err) => {
                    console.error(`Cannot load component in <AsyncComponent />`)
                    throw err;
                });
        }

        hasLoadedComponent() {
            return this.state.Component !== null;
        }

        render() {
            const { Component } = this.state;
            return (Component) ? <Component {...this.props} /> : null;
        }
    }
);

export default routes.map((route) => {
  return (<Route key={route.path} path={route.path} component={asyncComponent(()=>import(`./components/${route.component}.js`))}></Route>)
})
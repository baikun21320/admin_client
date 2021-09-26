import React, {Component} from 'react';
import {Switch,Route, Redirect} from 'react-router-dom'
import './product.less'
import ProductAddUpdate from "./addUpdate";
import ProductDetail from "./detail";
import ProductHome from "./home";

class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path='/product' exact component={ProductHome}/>
                <Route path='/product/addupdate' component={ProductAddUpdate}/>
                <Route path='/product/detail' component={ProductDetail}/>
                <Redirect to='/product'/>
            </Switch>
        );
    }
}

export default Product;

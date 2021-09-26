import React, {Component} from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import { Layout } from 'antd';
import memoryUtils from "../../utils/memoryUtils";
import Header from "../../components/header";
import LeftNav from "../../components/left-nav";
import Home from "../home/home";
import User from "../user/user";
import Product from "../product/product";
import Role from "../role/role";
import Category from "../category/category";
import Pie from "../charts/pie";
import Bar from "../charts/bar";
import Line from "../charts/line";
const {Footer, Sider, Content } = Layout;
class Admin extends Component {
    render() {
        const user = memoryUtils.user
        if(!user || !user._id){
            return <Redirect to='/login'/>
        }
        return (
                <Layout style={{height:'100%'}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header/>
                        <Content style={{border:'20px solid #110F0F'}}>
                            <Switch>
                                <Route path='/home' component={Home}/>
                                <Route path='/category' component={Category}/>
                                <Route path='/product' component={Product}/>
                                <Route path='/role' component={Role}/>
                                <Route path='/user' component={User}/>
                                <Route path='/charts/bar' component={Bar}/>
                                <Route path='/charts/line' component={Line}/>
                                <Route path='/charts/pie' component={Pie}/>
                                <Redirect to='/home' />
                            </Switch>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>推荐使用谷歌浏览器,操作更佳</Footer>
                    </Layout>
                </Layout>
        );
    }
}

export default Admin;

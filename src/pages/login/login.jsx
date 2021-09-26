import React, {Component} from 'react';
import { Form, Input, Button, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import {reqLogin} from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Redirect} from "react-router-dom";

export default class Login extends Component {
     onFinish = async (values) => {
         const {username, password} = values
         const result = await reqLogin(username, password)
         console.log(result);
         if (result.status === 0) {
             message.success('登陆成功')
             memoryUtils.user = result.data
             storageUtils.saveUser(result.data)
             this.props.history.replace('/')
         }else {
             message.error(result.msg)
         }
    };
     render() {
         const user = memoryUtils.user
         if(user && user._id) {
             return <Redirect to='/'/>
         }
        return (
            <div className="login">
                <header className="login-header">
                    <h1>React项目，后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h3>用户登陆</h3>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {required: true,whitespace: true, message: 'Please input your Username!',},
                                {min: 4, message: '最少输入4个字符'},
                                {max: 12, message: '最多输入12个字符'}
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {required: true, message: 'Please input your Password!',},
                                {min: 4, message: '最少输入4个字符'},
                                {max: 12, message: '最多输入12个字符'},
                                {pattern:/^[a-zA-Z0-9_]+$/,message: '密码只能由字母,数字,_组成'}
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" block htmlType="submit" className="login-form-button">
                                登陆
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        );
    }
}


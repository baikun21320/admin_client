import React, {PureComponent} from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from "prop-types";

const {Option} = Select
class UserForm extends PureComponent {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user:PropTypes.object
    }
    formRef = React.createRef();
    componentDidMount() {
        this.props.setForm(this.formRef)
    }
    render() {
        const {roles} = this.props
        const user = this.props.user || {}
        const {username, password, phone, email, role_id} = user
        return (
            <Form
                ref={this.formRef}
                name="user"
                labelCol={{ span: 3}}
                wrapperCol={{ span: 15 }}
                initialValues={{
                    username,
                    password,
                    phone,
                    email,
                    role_id
                }}
            >
                <Form.Item
                    label='用户名'
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '用户名称必须输入',
                        },
                    ]}>
                    <Input placeholder='请输入用户名称' />
                </Form.Item>
                {
                    user._id? '' : (<Form.Item
                        label='密码'
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '密码必须输入',
                            },
                            {
                                len: 6,
                                message: '密码至少为6位！'
                            }
                        ]}>
                        <Input.Password placeholder='请输入密码' />
                    </Form.Item>)
                }
                <Form.Item
                    label='电话号码'
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: '手机号码必须输入',
                        },
                    ]}>
                    <Input placeholder='请输入手机号码' />
                </Form.Item>
                <Form.Item
                    label='邮箱'
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: '邮箱必须输入',
                        },
                    ]}>
                    <Input placeholder='请输入邮箱' />
                </Form.Item>
                <Form.Item
                    label='角色'
                    name="role_id"
                    rules={[
                        {
                            required: true,
                            message: '角色必须选择',
                        },
                    ]}>
                   <Select placeholder='请选择角色'>
                       {
                          roles?roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>):''
                       }
                   </Select>
                </Form.Item>
            </Form>
        );
    }
}

export default UserForm;

import React, {Component} from 'react';
import {Card, Button, Table, message, Modal} from 'antd'
import LinkButton from "../../components/link-button";
import {reqUsers, reqDeleteUser, reqAddOrUpdateUser} from '../../api'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import {formateDate} from  '../../utils/dateUtils'
import './user.less'
import {PAGE_SIZE} from "../../utils/constants";
import UserForm from "./user-form";
class User extends Component {

    state = {
        roles: [],
        users: [],      //所有用户列表
        roleNames: [],      //所以角色列表
        loading: false,
        isShow: false
    }
    //初始化表格列的數組
    initColumns = ()=> {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: role_id => this.roleNames[role_id]
                    /*if(this.state.roles){
                        const role = this.state.roles.find(role => role._id === role_id)
                        return role? role.name : ''
                    }else {
                        return ''
                    }*/
            },
            {
                width: "100px",
                title: '操作',
                render: user => {
                    return (
                        <span>
                           <LinkButton onClick={() => this.showUpdate(user)} >修改</LinkButton>
                           <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                        </span>
                    )
                }
            }
        ];
    };

    /*根据role的数组生成所有角色的对象*/
    initroleNames =(roles)=> {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }
    //获取所以用户列表
    getUsers = async ()=> {
        this.setState({loading: true})
        const result = await reqUsers()
        this.setState({loading: false})
        if(result.status === 0) {
            const users = result.data.users
            const roles = result.data.roles
            this.initroleNames(roles)
            this.setState({users, roles})
        }else {
            message.error('获取用户列表异常')
        }
    }

    //显示修改用户
    showUpdate = (user)=> {
        this.user = user
        this.setState({
            isShow: true
        })
    }

    //显示添加用户
    showAdd = ()=> {
        this.user = null
        this.setState({isShow: true})
    }

    //添加或修改用户
    addOrUpdateUser = ()=> {
        this.form.current.validateFields().then(async user => {
            if(this.user) {
                user._id = this.user._id
            }
            //收集数据
            const result = await reqAddOrUpdateUser(user)
            if (result.status === 0) {
                this.setState({isShow: false})
                message.success(`${this.user?'修改': '创建'}用户成功`)
                this.getUsers()
            } else {
                message.error(`${this.user?'修改': '创建'}用户失败`)
            }
        }).catch(errorInfo => {
            message.error(errorInfo.errorFields[0].errors)
        })
    }

    //删除用户
    deleteUser = (user)=> {
        console.log(user)
        const {username, _id} = user
        Modal.confirm({
            title: `确定删除${username}吗？`,
            icon: <ExclamationCircleOutlined />,
            onOk: async ()=>  {
                const result = await reqDeleteUser(_id)
                if (result.status === 0) {
                    this.getUsers()
                    message.success('删除用户成功')
                }else {
                    message.error('删除用户失败')
                }
            }
        });

    }

    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getUsers()
    }

    render() {
        const {users , loading, isShow, roles} = this.state
        const title = (
            <span>
                <Button type='primary'
                        onClick={this.showAdd}
                >创建用户</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    columns={this.columns}
                    dataSource={users}
                    loading={loading}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                    }}
                />
                <Modal
                    title={this.user? '修改用户': '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    destroyOnClose
                    onCancel={() => {
                        this.setState({isShow: false})
                    }}
                >
                    <UserForm
                        setForm={(form) => (this.form = form)}
                        roles={roles}
                        user={this.user? this.user : {}}
                    />
                </Modal>
            </Card>
        );
    }
}

export default User;

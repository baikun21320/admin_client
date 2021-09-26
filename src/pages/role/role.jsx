import React, {Component} from 'react';
import {Card, Button, Table, Modal, message} from 'antd'
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import './role.less'
import AddForm from "./add-form";
import AuthForm from "./auth-form";
import memoryUtils from "../../utils/memoryUtils";
import {formateDate} from "../../utils/dateUtils";
import storageUtils from "../../utils/storageUtils";


/*角色路由*/
class Role extends Component {
    state= {
        roles: [],  //角色数据列表
        role: {},    //选择的行,
        isShowAdd: false,
        isShowAuth: false
    }

    constructor(props) {
        super(props);
        this.roleRef = React.createRef()
    }
    //初始化column
    initColumn = ()=> {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render:(create_time)=> formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    //获取所以角色的列表
    getRoles = async ()=> {
        const result = await reqRoles()
        if(result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    //点击行
    onRow = (role)=> {
        return {
            onClick: event => {
                this.setState({
                    role
                })
            },
        }
    }

    //添加角色
    addRole = ()=> {
        this.form.current.validateFields(['roleName']).then(async values => {
            //隐藏确认框
            this.setState({isShowAdd: false})
            //发请求
            const {roleName} = values
            console.log(roleName)
            const result = await reqAddRole(roleName)
            if (result.status === 0) {
                // this.getRoles()
                const role = result.data
                const roles = [...this.state.roles]
                roles.push(role)
                this.setState({roles})
                message.success('添加角色成功')
            }else {
                message.error('添加角色失败')
            }
        }).catch(errorInfo => {
            message.error(errorInfo.errorFields[0].errors)
        })

        //收集数据

        //根据结果提示、刷新列表
    }

    //给角色设置权限
    updateRole = async()=> {
        this.setState({
            isShowAuth: false
        })
        const role = this.state.role
        const menus = this.roleRef.current.getMenus()
        role.menus = menus
        role.auth_name = memoryUtils.user.username
        role.auth_time = Date.now()
        const result = await reqUpdateRole(role)
        if(result.status === 0) {
            //更新界面显示
            // this.getRoles()     //1.发请求

            //如果当前更新的是自己的权限，强制退出
            if(role._id === memoryUtils.user.role._id) {
                message.success('更改当前用户权限请重新登录！')
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
            }else {
                message.success('设置权限成功！')
                this.setState({     //2.更新状态
                    roles: [...this.state.roles]
                })
            }
        }else {
            message.error('设置权限失败！')
        }
    }

    componentWillMount() {
        this.initColumn()
    }
    componentDidMount() {
        this.getRoles()
    }

    render() {
        const {roles, role, isShowAdd, isShowAuth} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
                <Button
                    type='primary' disabled={!role._id}
                    onClick={() => this.setState({isShowAuth: true})}
                >设置角色权限
                </Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    dataSource={roles}
                    rowKey='_id'
                    bordered
                    pagination={{defaultPageSize: 5, showQuickJumper: true}}
                    columns={this.columns}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role)=> {
                            this.setState({
                                role
                            })
                        }
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    destroyOnClose
                    onCancel={() => {
                        this.setState({isShowAdd: false})
                    }}
                >
                    <AddForm
                        setForm={(form) => (this.form = form)}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    destroyOnClose
                    onCancel={() => {
                        this.setState({isShowAuth: false})
                    }}
                >
                    <AuthForm role={role} ref={this.roleRef}/>
                </Modal>
            </Card>
        );
    }
}

export default Role;

import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu} from 'antd'
import './index.less'
import logo from '../../assrts/images/logo.png'
import menuList from '../../config/menuConfig'
import '../../'
import memoryUtils from "../../utils/memoryUtils";
const {SubMenu} = Menu;
class LeftNav extends Component {

    hasAuth = (item)=> {
        const {key, isPublic} = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        /*如果用户是admin*/
        /*如果当前用户是公开的*/
        /*如果当前用户有此item的权限*/
        if(username === 'admin' || isPublic || menus.indexOf(key)!==-1){
            return true
        }else if(item.children) {
            item.children.find(child => menus.indexOf(child.key)!== -1)
            return true
        }
        return false
    }
    getMenuNodes_map = (menuList) => {
        const path = this.props.location.pathname

        // return menuList.map(item => {
        //     /*
        //       {
        //         title: '首页', // 菜单标题名称
        //         key: '/home', // 对应的path
        //         icon: 'home', // 图标名称
        //         children: [], // 可能有, 也可能没有
        //       }
        //     */
        //     if(!item.children) {
        //         return (
        //         <Menu.Item key={item.key} icon={item.icon}>
        //             <Link to={item.key}>{item.title}</Link>
        //         </Menu.Item>
        //         )
        //     } else {
        //         const cItem = item.children.find(cItem=> path.indexOf(cItem.key) ===0)
        //         if(cItem){
        //             this.openKey = item.key
        //         }
        //         return (
        //             <SubMenu key={item.key} icon={item.icon} title={item.title}>
        //                 {this.getMenuNodes_map(item.children)}
        //             </SubMenu>
        //         )
        //     }
        // })

        return menuList.reduce((pre, item)=> {
            //如果当前用户有对应item的权限添加item
            if(this.hasAuth(item)) {
                //向pre添加
                if(!item.children) {
                    pre.push((
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key}>{item.title}</Link>
                        </Menu.Item>
                    ))
                }else {
                    const cItem = item.children.find(cItem=> path.indexOf(cItem.key) ===0)
                    if(cItem){
                        this.openKey = item.key
                    }
                    pre.push ((
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {this.getMenuNodes_map(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre
        },[])
    }
    // componentDidMount() {
    //     this.menuNodes = this.getMenuNodes_map(menuList)
    // }
    componentWillMount() {
        this.menuNodes = this.getMenuNodes_map(menuList)
    }
    render() {
        let path = this.props.location.pathname
        if (path.indexOf('/product')===0) { //当前请求是商品或其子路由界面
            path = '/product'
        }
        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo"/>
                    <h1>电商后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[this.openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {/*<Menu.Item key="home" icon={<PieChartOutlined />}>
                        <Link to='/home'>首页</Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                        <Menu.Item key="category" icon={<PieChartOutlined />}>
                            <Link to='/category'>品类管理</Link>
                        </Menu.Item>
                        <Menu.Item key="product" icon={<PieChartOutlined />}>
                            <Link to='/product'>商品管理</Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="user" icon={<PieChartOutlined />}>
                        <Link to='/user'>用户管理</Link>
                    </Menu.Item>
                    <Menu.Item key="role" icon={<PieChartOutlined />}>
                        <Link to='/role'>角色管理</Link>
                    </Menu.Item>
                    <SubMenu key="sub2" icon={<MailOutlined />} title="形状">
                        <Menu.Item key="bar" icon={<PieChartOutlined />}>
                            <Link to='/charts/bar'>柱状图</Link>
                        </Menu.Item>
                        <Menu.Item key="line" icon={<PieChartOutlined />}>
                            <Link to='/charts/line'>折线图</Link>
                        </Menu.Item>
                        <Menu.Item key="pie" icon={<PieChartOutlined />}>
                            <Link to='/charts/pie'>饼状图</Link>
                        </Menu.Item>
                    </SubMenu>*/}
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        );
    }
}

export default withRouter(LeftNav);

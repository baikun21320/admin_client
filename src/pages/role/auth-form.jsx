import React, {PureComponent } from 'react';
import PropTypes from "prop-types";
import {Form, Input, Tree} from "antd";
import menuList from "../../config/menuConfig";
class AuthForm extends PureComponent {
    static propTypes = {
        role: PropTypes.object.isRequired
    }
    state = {
        treeData: [
            {
                title: '平台权限',
                key: '0-0',
                children: menuList,
            },
        ],
        expandedKeys: ['/charts', '/products'],
        checkedKeys: this.props.role.menus,
        selectedKeys: [],
        autoExpandParent: true
    }
    /*为父组件获取最新数据的方法ref*/
    getMenus = ()=> {
        return this.state.checkedKeys
    }
     onExpand = (expandedKeysValue) => {
        console.log('onExpand', expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
         this.setState({
             expandedKeys:expandedKeysValue,
             autoExpandParent:false
         })
    };

     onCheck = (checkedKeysValue) => {
        console.log('onCheck', checkedKeysValue);
         this.setState({
             checkedKeys:checkedKeysValue,
         })
    };

     onSelect = (selectedKeysValue, info) => {
        console.log('onSelect', info);
         this.setState({
             selectedKeys:selectedKeysValue,
         })
    };
    render() {
        const {role} = this.props
        const {treeData, autoExpandParent, checkedKeys, expandedKeys, selectedKeys} = this.state
        return (
            <div>
                <Form.Item
                label='角色名称：'
                >
                    <Input value={role.name} disabled/>
                </Form.Item>
                <Tree
                    checkable
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys}
                    onSelect={this.onSelect}
                    selectedKeys={selectedKeys}
                    treeData={treeData}
                />
            </div>
        );
    }
}
export default AuthForm;

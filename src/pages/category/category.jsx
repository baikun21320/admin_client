import React, {Component} from 'react';
import { Card, Table, Button, message, Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

import LinkButton from '../../components/link-button'
import AddForm from './add-form'
import UpdataForm from './updata-form'
import {reqCategorys, reqAddCategory, reqUpdateCategory} from '../../api'
import './category.less'
class Category extends Component {
    state= {
        categorys: [],      //一级分类列表
        loading: false,     //是否显示加载
        subCategorys: [],   //二级分类列表
        parentId: '0',      //分类id
        parentName: '',
        visible: 0          //显示对话框
    }
    //初始化table所有列的数组
    initColumns = ()=> {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                width: 300,
                title: '操作',
                render: (category) => <div>
                    <LinkButton onClick={() =>this.showUpdate(category)}>修改分类</LinkButton>&nbsp;&nbsp;
                    {
                        this.state.parentId ==='0'? <LinkButton onClick={()=>this.showSubCategorys(category)}>查看子分类</LinkButton>:''
                    }
                </div>
            },
        ];
    }
    //显示一级列表
    showCategorys =()=> {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }
    //更新状态
    showSubCategorys = (category)=> {
        this.setState({    //异步更新
            parentId:category._id,
            parentName: category.name
        },()=>{
            this.getCategorys()
        })
    }
    //异步获取一级/二级分类列表
    getCategorys = async (parentId)=> {
        this.setState({loading: true})
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        this.setState({loading: false})
        if(result.status === 0){
            const categorys = result.data
            if(parentId==='0'){
                this.setState({categorys})
            }else {
                this.setState({subCategorys:categorys})
            }
        }else {
            message.error('获取分类列表失败')
        }
    }
    //确认对话框修改数据
    updateCategory = ()=> {
        this.form.current.validateFields(['categoryName','parentId']).then(async values => {
                //隐藏确认框
                this.setState({visible: 0})
                //发请求
                const categoryId = this.category._id
                const {categoryName} = values
                const result = await reqUpdateCategory(categoryId, categoryName)
                if (result.status === 0) {
                    //重新显示列表
                    this.getCategorys()
                }
        }).catch(errorInfo => {
            message.error(errorInfo.errorFields[0].errors)
        })
    }
    //确认对话框添加数据
    addCategory = async ()=> {
        this.form.current.validateFields(['categoryName','parentId']).then(async values => {
            //隐藏确认框
            this.setState({visible: 0})
            //发请求
            const {categoryName,parentId} = values
            const result = await reqAddCategory(categoryName,parentId)
            if (result.status === 0) {
                if(parentId === this.state.parentId) {
                    //重新显示列表
                    this.getCategorys()
                }else if(parentId === '0') {        //二级列表添加一级分类获取但不显示
                    this.getCategorys(parentId)
                }
            }
        }).catch(errorInfo => {
            message.error(errorInfo.errorFields[0].errors)
        })
    }
    //取消对话框
    handleCancel =()=> {
        this.setState({visible: 0})
    }
    //显示添加对话框
    showAdd =()=> {
        this.setState({visible: 1})
    }
    //显示修改对话框
    showUpdate = (category)=> {
        this.setState({visible: 2})
        this.category = category
    }
    componentDidMount() {
        this.initColumns()
        this.getCategorys()
    }

    render() {
        const {categorys, loading, parentId, subCategorys, parentName, visible} = this.state
        const category = this.category?this.category:{name:''}
        const title = parentId==='0'? '一级分类列表':
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                &nbsp;/&nbsp;{parentName}
            </span>
        const extra = (
            <Button type='primary'onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )
        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        dataSource={parentId==='0'? categorys: subCategorys }
                        rowKey='_id'
                        loading={loading}
                        bordered
                        pagination={{defaultPageSize: 5, showQuickJumper: true}}
                        columns={this.columns}
                    />
                </Card>
                <Modal
                    title="添加分类"
                    visible={visible === 1}
                    onOk={this.addCategory}
                    destroyOnClose
                    // confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys?categorys:[]}
                        parentId={parentId}
                        setForm={(form) => (this.form = form)}
                    />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={visible === 2}
                    onOk={this.updateCategory}
                    destroyOnClose
                    // confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <UpdataForm categoryName={category.name} setForm={(form) => (this.form = form)}/>
                </Modal>
            </div>
        );
    }
}

export default Category;

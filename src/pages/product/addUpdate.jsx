import React, {Component} from 'react';
import {Card, Form, Input, Cascader, Button, InputNumber, message} from 'antd'
import LinkButton from "../../components/link-button";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {reqCategorys, reqaddOrUpdateProduct} from '../../api'
import PicturesWall from './pictureswall'
import RichTextEditor from './rich-text-editor'

const {Item} = Form
const { TextArea } = Input;
class ProductAddUpdate extends Component {
    constructor(props) {
        super(props);
        this.pw = React.createRef();
        this.editor = React.createRef();
    }
    state = {
        options: [],
    }

    /*
    * 异步获取一级二级分类名称
    *
    * */
    //async 函数返回值是一个新的promise对象， promise的结果和值由async的结果来绝定
    getCategorys = async (parentId)=> {
        const result = await reqCategorys(parentId)
        if(result.status === 0) {
            const categorys = result.data
            if(parentId === '0'){
                //如果是一级分类
                this.initOptions(categorys)
            }else {//子级列表
                return categorys   //返回二级列表 ==》 当前async函数返回的promise就成功切值为categorys
            }
        }
    }
    //初始化Options
    initOptions = async (categorys)=> {
        const options = categorys.map(category => ({
            value: category._id,
            label: category.name,
            isLeaf: false,
        }))

        //如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId, categoryId} = product
        if(isUpdate && pCategoryId !=='0') {
            //获取对应的二级分类
            const subCategorys = await this.getCategorys(pCategoryId)
            //生成二级分类下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            //找到商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            targetOption.children = childOptions
        }

        this.setState({
            options
        })
    }
    /*
    * 级联选择
    *
    * */
    loadData = async selectedOptions => {
        const {options} = this.state
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        //根据选中的分类id，请求子级分类
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false;
        if(subCategorys && subCategorys.length > 0) {
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            targetOption.children = childOptions
        }else {         //当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...options]
        })
    };
/*
    表单收集
*/
    onFinish = async (values) => {

        //收集数据
        const {name, desc, price, categoryIds} = values
        let pCategoryId , categoryId
        if(categoryIds.length === 1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        }else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}
        //如果是更新
        if(this.isUpdate) {
            product._id = this.product._id
        }
        //调用接口请求函数去添加/更新商品
        const result = await reqaddOrUpdateProduct(product)

        //根据结果提示
        if(result.status === 0) {
            message.success(`${this.isUpdate? '更新商品成功！':'添加商品成功!'}`)
            this.props.history.goBack()
        }else {
            message.error(`${this.isUpdate? '更新商品失败！':'添加商品失败！'}`)
        }
    };

     onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

     componentDidMount() {
         this.getCategorys("0")
     }
     componentWillMount() {
         const product = this.props.location.state
         this.isUpdate = !!product      //保存是否是更新的标识
         this.product = product || {}   //保存商品
     }

    render() {
        const {options} = this.state
        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail} = product
        const categoryIds = []
        if(isUpdate) {      //如果为修改页面
            if(pCategoryId === '0'){
                categoryIds.push(categoryId)//商品是一级分类
            }else {
                //商品是二级分类
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined style={{fontSize: '18px', color: 'darkgreen'}} onClick={() => this.props.history.goBack()}/>
                </LinkButton>
                <span className='title'>{isUpdate? '修改商品' : '添加商品'}</span>
            </span>
        )
        return (
           <Card title={title}>
               <Form
                   labelCol={{ span: 1.5 }}
                   wrapperCol={{ span: 10 }}
                   onFinish={this.onFinish}
                   onFinishFailed={this.onFinishFailed}
                   initialValues={{
                       name: product.name,
                       desc: product.desc,
                       price: product.price,
                       categoryIds: categoryIds
                   }}
               >
                   <Item
                       label="商品名称"
                       name='name'
                       rules={[{ required: true, message: '请输入商品名称！' }]}
                   >
                       <Input placeholder='请输入商品名称'/>
                   </Item>
                   <Item
                       label="商品描述"
                       name='desc'
                       rules={[{ required: true, message: '请输入商品描述!' }]}
                   >
                       <TextArea placeholder='请输入商品描述'/>
                   </Item>
                   <Item
                       label="商品价格"
                       name='price'
                       rules={[{ required: true, message: '请输入商品价格!' }]}
                   >
                       <InputNumber
                           min={0}
                           formatter={value => `${value}元`}
                           parser={value => value.replace('元', '')}
                           style={{ width: 150 }}
                           placeholder='请输入商品价格'
                       />
                   </Item>
                   <Item
                       label="商品分类"
                       name='categoryIds'
                       rules={[{ required: true, message: '请选择商品分类!' }]}
                   >
                       <Cascader
                           options={options}
                           loadData={this.loadData}
                           placeholder='请选择商品分类'
                       />
                   </Item>
                   <Item
                   label="商品图片"
                   name='商品图片'
                   >
                       <PicturesWall ref={this.pw} imgs={imgs}/>
                   </Item>
                   <Item
                       label="商品详情"
                       name='商品详情'
                       labelCol={{ span: 1.5 }}
                       wrapperCol={{ span: 20 }}
                   >
                       <RichTextEditor ref={this.editor} detail={detail}/>
                   </Item>
                   <Item>
                       <Button type="primary" htmlType="submit">提交</Button>
                   </Item>
               </Form>
           </Card>
        );
    };
};

export default ProductAddUpdate;

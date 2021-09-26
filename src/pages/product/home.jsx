import React, {Component} from 'react';
import {Button, Card, Input, message, Select, Table} from 'antd'
import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts, updateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
const { Option } = Select;
class ProductHome extends Component {
    state = {
        total: 0, //商品总数量
        products: [],       //商品的数组,
        loading: false,
        searchType: 'productName',
        searchName: ''
    }
    //更新商品状态
    updateStatus = async(productId, status)=> {
       const result = await updateStatus(productId, status)
        if(result.status === 0) {
            this.getProducts(this.pageNum)
            if (status===1){
                message.success('商品上架成功')
            }else {
                message.success('商品下架成功')
            }
        }
    }
    //初始化表格列的數組
    initColumns = ()=> {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: price => '￥'+ price
            },
            {
                width: '80px',
                title: '状态',
                // dataIndex: 'status',
                render: product => {
                    const {status, _id} = product
                    const newStatus = status===1? 2 : 1
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={()=> this.updateStatus(_id, newStatus)}
                            >
                                {status===1? '下架': '上架'}
                            </Button>
                            <span>&nbsp;&nbsp;{status===1? '在售': '已下架'}</span>
                        </span>
                    )
                },
            },
            {
                width: "80px",
                title: '操作',
                render: product => {
                    return (
                        <span>
                           <LinkButton onClick={() => this.props.history.push('/product/detail',product)}>详情</LinkButton>
                           <LinkButton onClick={() => this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                        </span>
                    )
                },
            },
        ];
    }
    //按页获取商品信息
    getProducts = async (pageNum) => {
        this.pageNum = pageNum          //保存当前页码 方便更新当前页面
        this.setState({loading:true})
        const {searchType, searchName} = this.state
        let result
        if (searchName) {
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        }else {
            result = await reqProducts(pageNum,PAGE_SIZE)
        }
        this.setState({loading:false})
        if (result.status === 0) {
            const {total, list} = result.data
            this.setState({
                total,
                products: list
            })
        }
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const {products, total, loading, searchName, searchType} = this.state
        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{width:150}}
                    onChange={value => this.setState({searchType: value})}
                >
                   <Option value='productName'>按名称搜索</Option>
                   <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='请输入关鍵字'
                    style={{width:200,margin:'0 10px'}}
                    value={searchName}
                    onChange={event => this.setState({searchName: event.target.value})}
                >
                </Input>
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>添加商品</Button>
        )
        return (
           <Card title={title} extra={extra}>
               <Table
                   bordered
                   rowKey='_id'
                   columns={this.columns}
                   dataSource={products}
                   loading={loading}
                   pagination={{
                       current: this.pageNum,
                       total,
                       defaultPageSize: PAGE_SIZE,
                       onChange: this.getProducts
                   }}
               />
           </Card>
        );
    }
}

export default ProductHome;

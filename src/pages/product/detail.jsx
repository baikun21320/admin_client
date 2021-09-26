import React, {Component} from 'react';
import {Card, List, Modal} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import {reqCategory} from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'
import './product.less'
const Item = List.Item
class ProductDetail extends Component {
    state = {
        cName1: '', //一级分类名称
        cName2: '',  //二级分类名称
        previewVisible: false,
        previewImage: '',
    }
    //获取分类名称
    getCategoryName = async()=> {
        const {pCategoryId, categoryId} = this.props.location.state
        if(pCategoryId === "0") {
            const result = await reqCategory(categoryId)
            if (result.status === 0){
                const cName1 = result.data.name
                this.setState({cName1})
            }
        }else {
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }
    handleCancel = () => this.setState({ previewVisible: false });
    handlePreview =(img)=> {
        this.setState({
            previewImage: img,
            previewVisible: true
        });
    };
    componentDidMount() {
       this.getCategoryName()
    }

    render() {
        const product = this.props.location.state
        const {name, desc, price, imgs, detail} = product
        const {cName1, cName2, previewVisible, previewImage} =this.state
        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined style={{fontSize: '18px', color: 'darkgreen'}} onClick={() => this.props.history.goBack()}/>
                </LinkButton>
                <span className='title'>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List className='detail-list'>
                    <Item key='name'>
                        <span>
                            <span className='detail-list-item'>商品名称:</span>
                            <span className='detail-list-text'>{name}</span>
                        </span>
                    </Item>
                    <Item key='desc'>
                        <span>
                            <span className='detail-list-item'>商品描述:</span>
                            <span className='detail-list-text'>{desc}</span>
                        </span>
                    </Item>
                    <Item key='price'>
                        <span>
                            <span className='detail-list-item'>商品价格:</span>
                            <span className='detail-list-text'>{price}</span>
                        </span>
                    </Item>
                    <Item key='cName1'>
                        <span>
                            <span className='detail-list-item'>所属分类:</span>
                            <span className='detail-list-text'>{cName1}{cName2?'-->'+ cName2:''}</span>
                        </span>
                    </Item>
                    <Item key='img'>
                        <div>
                            <div className='detail-list-item'>商品图片:</div>
                            <span style={{width: '450px'}}>
                                {
                                    imgs.map(jpg => (
                                        <div
                                            style={{background:"black",width: 140 , height: 140, margin: '5px',float: 'left'}}
                                            key={jpg}
                                        >
                                            <img
                                                className='product-img'
                                                width={140}
                                                height={140}
                                                src={BASE_IMG_URL + jpg}
                                                alt="img"
                                                onClick={()=>this.handlePreview((BASE_IMG_URL + jpg))}
                                            />
                                        </div>
                                    ))
                                }
                            </span>
                        </div>
                    </Item>
                    <Item key='detail'>
                        <span>
                            <span className='detail-list-item'>商品详情:</span>
                            <div style={{margin:10}} dangerouslySetInnerHTML={{__html: detail}}>
                            </div>
                        </span>
                    </Item>
                </List>
                <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' , padding: '20px'}} src={previewImage} />
                </Modal>
            </Card>

        );
    }
}

export default ProductDetail;

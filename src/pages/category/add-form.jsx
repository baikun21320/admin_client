import React, {Component} from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from "prop-types";

const { Option } = Select;
class AddForm extends Component {
    static propTypes = {
        categorys: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }
    formRef = React.createRef();
    componentDidMount() {
        this.props.setForm(this.formRef)
    }
    render() {
        const {categorys,parentId} = this.props
        return (
            <Form ref={this.formRef}
                  initialValues={{
                      parentId,
                  }}
            >
                <Form.Item name="parentId">
                    <Select
                        placeholder="请选择分类级别"
                        allowClear
                    >
                        <Option value="0">一级分类</Option>
                        {
                            categorys.map(category=>{
                                return <Option value={category._id} key={category._id}>{category.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name="categoryName"
                    rules={[
                        {
                            required: true,
                            message: '分类名称必须输入',
                        },
                    ]}>
                    <Input />
                </Form.Item>
            </Form>
        );
    }
}

export default AddForm;

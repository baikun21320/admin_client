import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { Form, Input} from 'antd';
class UpdataForm extends Component {
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }
    form = React.createRef();
    componentDidMount() {
        this.props.setForm(this.form)
    }

    render() {
        const {categoryName} = this.props
        return (
            <Form
                ref={this.form}
                initialValues={{
                    categoryName,
                }}
            >
            <Form.Item
                name='categoryName'
                rules={[
                    {
                        required: true,
                        message: '分类名称必须输入',
                    },
                ]}
            >
                <Input placeholder= '请输入分类名称'/>
            </Form.Item>
            </Form>
        );
    }
}

export default UpdataForm;

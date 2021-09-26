import React, {Component} from 'react';
import { Form, Input } from 'antd';
import PropTypes from "prop-types";

class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired
    }
    formRef = React.createRef();
    componentDidMount() {
        this.props.setForm(this.formRef)
    }
    render() {
        return (
            <Form ref={this.formRef}>
                <Form.Item
                    label='角色名称'
                    name="roleName"
                    rules={[
                        {
                            required: true,
                            message: '角色名称必须输入',
                        },
                    ]}>
                    <Input placeholder='请输入角色名称' />
                </Form.Item>
            </Form>
        );
    }
}

export default AddForm;

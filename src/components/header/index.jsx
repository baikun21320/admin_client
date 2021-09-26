import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import LinkButton from '../../components/link-button'
import {reqWeather} from '../../api/index'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import './index.less'
const { confirm } = Modal;

class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        weather: '',
        city: '金华'
    }
     outLogin =()=> {
        confirm({
            title: '确定退出登陆吗?',
            icon: <ExclamationCircleOutlined />,
            onOk:()=> {
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            },
        });
    }

    gitTitle =()=> {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item=> {
            if (item.key === path){
                title = item.title
            }else if(item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }
    getTime =()=>{
        this.interval_id =setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    getWeather = async ()=> {
        const result = await reqWeather(this.state.city)
        if(result.status === '1'){
            const weather = result.lives[0].weather
            this.setState({weather})
        }else {
            message.error('获取天气失败')
        }
    }
    componentDidMount() {
        this.getTime()
        this.getWeather()
    }
    componentWillUnmount() {
        clearInterval(this.interval_id)
    }

    render() {
        const {currentTime, weather,city} = this.state
        const username = memoryUtils.user.username
        const title = this.gitTitle()
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.outLogin}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <span>城市：{city}</span>
                        <span>天气：{weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);

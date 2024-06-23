import { useEffect, useRef, useState } from 'react';
import { Grid, Form, Input, Button, InputNumber, Message, Spin } from '@arco-design/web-react';
import { IconUser, IconInfoCircle } from '@arco-design/web-react/icon'
import axios from 'axios'
import "@arco-design/web-react/dist/css/arco.css";
import './index.css'

const { GridItem } = Grid;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 16,
    },
};
const noLabelLayout = {
    wrapperCol: {
        span: 12,
        offset: 6,
    },
};

function ProfileComponent() {
    const formRef = useRef();
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        username: '',
        age: null,
        email: '',
        phone: '',
    });
    const onValuesChange = (changeValue, values) => {
        // console.log('onValuesChange: ', changeValue, values);
    };
    useEffect(() => {
        fetchProfile();
    }, [])
    const fetchProfile = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:3000/profile');
            setProfile(response.data);
            form.setFieldsValue(response.data);
            setLoading(false)
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    };
    const handleEdit = async () => {
        setIsEditing(true)
    }
    const handleSubmit = async (values) => {
        try {
            let res
            setLoading(true)
            if (!profile?.id) {
                res = await axios.post('http://localhost:3000/profile', values);
            } else {
                res = await axios.put('http://localhost:3000/profile', values);
            }

            if (res.status == 200) {
                setIsEditing(false)
                fetchProfile(); // 重新获取Profile以确保显示最新数据  
                setLoading(false)
            }
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    }
    const handleCancel = () => {
        setIsEditing(false)
    }
    return (
        <div className='profile-container'>
            <Spin loading={loading} style={{ display: 'block', marginTop: 8, }}>
                <h2>{!!isEditing ? '编辑' : '查看'}个人信息</h2>
                <Form
                    form={form}
                    {...formItemLayout}
                    autoComplete='off'
                    onValuesChange={onValuesChange}
                    onSubmit={handleSubmit}
                // scrollToFirstError
                >
                    <Grid cols={{ xs: 1, sm: 2, md: 3, lg: 1 }} colGap={12} rowGap={16} className='grid-responsive-demo'>
                        <GridItem className='demo-item' >
                            <FormItem
                                label='用户名'
                                field='username'
                                required
                                disabled={!isEditing}
                                initialValue={profile.username}
                                rules={[
                                    {
                                        validator(value, cb) {
                                            var reg = /^\S+$/;
                                            if (!reg.test(value)) {
                                                return cb('用户名不能为空或者前后有空格');
                                            }

                                            return cb();
                                        },
                                    },
                                ]}
                            >
                                <Input placeholder='请输入你的用户名' />
                            </FormItem>
                        </GridItem>
                        <GridItem className='demo-item'>
                            <FormItem
                                label='年龄'
                                field='age'
                                initialValue={profile.age}
                                disabled={!isEditing}
                                rules={[{ required: true, type: 'number', min: 0, max: 99, message: '请输入你的年龄' }]}>
                                <InputNumber placeholder='请输入你的年龄' />
                            </FormItem>
                        </GridItem>

                        <GridItem className='demo-item'>
                            <FormItem
                                label='邮箱'
                                field='email'
                                initialValue={profile.email}
                                required
                                disabled={!isEditing}
                                rules={[
                                    {
                                        validator(value, cb) {
                                            var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                                            if (!reg.test(value)) {
                                                return cb("邮箱格式不正确");
                                            }
                                            return cb();
                                        },
                                    },
                                ]}
                            >
                                <Input placeholder='请输入你的邮箱' />
                            </FormItem>
                        </GridItem>

                        <GridItem className='demo-item'>
                            <FormItem
                                label='手机号'
                                field='phone'
                                initialValue={profile.phone}
                                disabled={!isEditing}
                                rules={[{
                                    required: true, type: 'number', message: '请输入你的手机号',
                                    validator(value, cb) {
                                        if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value))) {

                                            return cb("不是完整的11位手机号或者正确的手机号前七位");
                                        }
                                        return cb();
                                    }
                                }]}>
                                <Input

                                    addBefore='+86'
                                    prefix={<IconUser />}
                                    suffix={<IconInfoCircle />}
                                    allowClear
                                    placeholder='请输入你的手机号'
                                />
                            </FormItem>
                        </GridItem>

                        <GridItem className='demo-item' span={{ sm: 1 }}>
                            <FormItem  {...noLabelLayout}>
                                {!!isEditing ? (<><Button
                                    onClick={async () => {
                                        if (formRef.current) {
                                            try {
                                                await formRef.current.validate();
                                                Message.info('校验通过，提交成功！');
                                            } catch (_) {
                                                Message.error('校验失败，请检查字段！');
                                            }
                                        }
                                    }}
                                    type='primary'
                                    htmlType='submit'
                                    style={{ marginRight: 24 }}
                                >
                                    提交
                                </Button>
                                    <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
                                        取消
                                    </Button> </>) : <Button
                                        onClick={handleEdit}
                                    >
                                    编辑
                                </Button>}
                            </FormItem>
                        </GridItem>
                    </Grid>
                </Form>
            </Spin>
        </div>
    )
}

export default ProfileComponent;
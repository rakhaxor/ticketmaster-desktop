import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import './Register.scss';
import { useAppDispatch } from '@renderer/hooks';
import { registerThunk } from '@renderer/redux/slices/authSlice';
import { RegisterReqInterface } from '@renderer/interfaces/reqInterfaces';
import { baseUrl } from '@renderer/utils';
import ForgotPassword from '@renderer/pages/ForgotPassword';
import routes from '@renderer/routes';

const schema = yup.object().shape({
  first_name: yup.string().required('First Name is required'),
  last_name: yup.string().required('First Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  timezone: yup.string().required('Timezone is required'),
});

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const timezone = moment.tz.guess();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterReqInterface>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: RegisterReqInterface) => {
    void dispatch(registerThunk(data));
  };

  return (
    <div className='global-container register-container'>
      <div className='card register-form'>
        <div className='card-body'>
          <div className='text-center'>
            <img src={baseUrl('images/banner_logo.png')} alt='' />
          </div>
          <div className='card-text'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='form-group'>
                <label htmlFor='username' className='primary-clr font-weight-bold h6'>
                  Username
                </label>
                <input
                  type='text'
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  id='username'
                  {...register('username')}
                  placeholder='Enter last name...'
                />
                <div className='invalid-feedback'>{errors.username?.message}</div>
              </div>
              <div className='form-group'>
                <label htmlFor='email' className='primary-clr font-weight-bold h6'>
                  Email address
                </label>
                <input
                  type='email'
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id='email'
                  {...register('email')}
                  placeholder='Enter email...'
                />
                <div className='invalid-feedback'>{errors.email?.message}</div>
              </div>
              <div className='form-group'>
                <label htmlFor='password' className='primary-clr font-weight-bold h6'>
                  Password
                </label>
                <input
                  type='password'
                  {...register('password')}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id='password'
                  placeholder='Enter password...'
                />
                <div className='invalid-feedback'>{errors.password?.message}</div>
              </div>
              <button type='submit' className='btn btn-primary btn-block'>
                Register now
              </button>

              <div className='register-actions'>
                <div className='forgot-password mt-2'>
                  <ForgotPassword />
                </div>
                <div className='mt-4 h6'>
                  <span className='font-weight-bold'>Already have an account? </span>
                  <Link to={routes.login.path}>Login here.</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

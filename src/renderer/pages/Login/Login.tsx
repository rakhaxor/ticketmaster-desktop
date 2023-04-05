import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import moment from 'moment-timezone';
import './Login.scss';
import { useAppDispatch, useAppSelector } from '@renderer/hooks';
import { loginThunk } from '@renderer/redux/slices/authSlice';
import { LoginReqInterface } from '@renderer/interfaces/reqInterfaces';
import Logo from '@assets/images/logo.png';
import ForgotPassword from '@renderer/pages/ForgotPassword';
import routes from '@renderer/routes';

const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const { userDetails } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const timezone = moment.tz.guess();

  useEffect(() => {
    if (userDetails) {
      navigate(routes.dashboard.path);
    }
  }, [userDetails]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginReqInterface>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: LoginReqInterface) => {
    await dispatch(loginThunk(data));
  };

  return (
    <div className='global-container login-container'>
      <div className='card login-form'>
        <div className='card-body'>
          <div className='text-center'>
            <img src={Logo} alt='logo' />
          </div>
          <div className='card-text'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input type='hidden' {...register('timezone')} value={timezone} />
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
                  data-cy={'email'}
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
                  data-cy={'password'}
                  placeholder='Enter password...'
                  autoComplete='password'
                />
                <div className='invalid-feedback'>{errors.password?.message}</div>
              </div>
              <button type='submit' className='btn btn-primary btn-block' data-cy={'submit'}>
                Sign in
              </button>

              <div className='login-actions'>
                <div className='forgot-password mt-2'>
                  <ForgotPassword />
                </div>
                <div className='mt-4 h6'>
                  <span className='font-weight-bold'>Need an account? </span>
                  <Link to={routes.register.path}>Register here.</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

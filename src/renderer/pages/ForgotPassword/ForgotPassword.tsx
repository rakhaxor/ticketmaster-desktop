import React, { useState } from 'react';
import './ForgotPassword.scss';
import { toast } from 'react-hot-toast';
import { useAppDispatch } from '@renderer/hooks';
import { forgotPasswordThunk } from '@renderer/redux/slices/authSlice';

const ForgotPassword = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');

  const submitHandler = async (): Promise<void> => {
    if (!email) {
      toast.error('Please enter a Valid Email Address');
    }

    const act = await dispatch(forgotPasswordThunk({ email }));
    if (act.meta.requestStatus === 'fulfilled') {
      setEmail('');
      setShow(false);
    }
  };

  return (
    <>
      <span role='button' tabIndex={0} onKeyDown={undefined} onClick={() => setShow(true)} title='Forgot password'>
        Forgot Password
        {/* &nbsp;Add new class */}
      </span>
      {/* Add planner class Modal */}
      <div className='modal' tabIndex={-1} role='dialog' style={{ display: show ? 'block' : 'none' }}>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title'>Forgot Password</h5>
              <button type='button' className='close' data-dismiss='modal' aria-label='Close' onClick={() => setShow(false)}>
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              <div className='form-group'>
                <label htmlFor='name'>Email</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter your registered email'
                  id='RegisterEmail'
                  onKeyDown={e => e.key === 'Enter' && submitHandler()}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' onClick={() => setShow(false)}>
                Cancel
              </button>
              <button type='button' className='btn btn-primary' onClick={submitHandler}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End */}
    </>
  );
};

export default ForgotPassword;

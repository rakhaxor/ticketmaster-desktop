import React from 'react';
import './Layout.scss';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@renderer/hooks';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { RunBotReqInterface } from '@renderer/interfaces/reqInterfaces';
import { yupResolver } from '@hookform/resolvers/yup';
import Logo from '@assets/images/logo.png';

const Layout = () => {
  const navigate = useNavigate();
  const { userDetails } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object().shape({
    concurrency: Yup.number()
      .required('Concurrency is required')
      .min(1, 'Concurrency must be at least 1')
      .max(10, 'Concurrency must not exceed 10'),
    runHeadless: Yup.boolean().required('Run headless is required'),
    buyUrl: Yup.string().required('Buy url is required'),
    maxRetries: Yup.number()
      .required('Max retries is required')
      .min(1, 'Max retries must be at least 1')
      .max(3, 'Max retries must not exceed 3'),
    useProxy: Yup.boolean().required('Use proxy is required'),
    file: Yup.mixed().required('File is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RunBotReqInterface>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: RunBotReqInterface) => {
    // convert to FormData
    const formData = new FormData();
    formData.append('concurrency', data.concurrency.toString());
    formData.append('runHeadless', data.runHeadless.toString());
    formData.append('buyUrl', data.buyUrl);
    formData.append('maxRetries', data.maxRetries.toString());
    formData.append('useProxy', data.useProxy.toString());
    formData.append('file', data.file[0]);

    // serialize to JSON
    let json = JSON.stringify(Object.fromEntries(formData));

    // change file to base64
    const reader = new FileReader();
    reader.readAsDataURL(data.file[0]);
    const getFile = async () => {
      return new Promise<any>(resolve => {
        reader.onload = () => {
          // add base64 to json
          json = JSON.stringify({
            ...Object.fromEntries(formData),
            file: reader.result,
          });
          resolve(json);
        }
      });
    }

    json = await getFile();
    const hello = await window.electron_window.test(json);
    console.log(`hello`, hello);
  };

  return (
    <div className='global-container'>
      <div className='card'>
        <div className='card-body'>
          <div className='text-center'>
            <img src={Logo} alt='logo' />
          </div>
          <div className='card-text'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='form-group mt-3'>
                <label htmlFor='concurrency' className='primary-clr font-weight-bold h6'>
                  Concurrency
                </label>
                <input
                  type='text'
                  className={`form-control ${errors.concurrency ? 'is-invalid' : ''}`}
                  id='concurrency'
                  defaultValue={1}
                  {...register('concurrency')}
                  placeholder='Enter concurrency...'
                  data-cy={'concurrency'}
                />
                <div className='invalid-feedback'>{errors.concurrency?.message}</div>
              </div>
              <div className='form-group mt-3'>
                <label htmlFor='buyUrl' className='primary-clr font-weight-bold h6'>
                  Buy Url
                </label>
                <input
                  type='text'
                  {...register('buyUrl')}
                  className={`form-control ${errors.buyUrl ? 'is-invalid' : ''}`}
                  id='apiKey'
                  data-cy={'apiKey'}
                  placeholder='Enter URL of the verifiedfan ticket...'
                  autoComplete='buyUrl'
                />
                <div className='invalid-feedback'>{errors.buyUrl?.message}</div>
              </div>
              <div className='form-group mt-3'>
                <label htmlFor='file' className='primary-clr font-weight-bold h6'>
                  File
                </label>
                <input
                  type='file'
                  {...register('file')}
                  className={`form-control ${errors.file ? 'is-invalid' : ''}`}
                  id='file'
                  data-cy={'file'}
                  autoComplete='buyUrl'
                />
                <div className='invalid-feedback'>{errors.file?.message}</div>
              </div>
              <div className='form-group mt-3'>
                <label htmlFor='maxRetries' className='primary-clr font-weight-bold h6'>
                  Max Retries
                </label>
                <input
                  type='text'
                  {...register('maxRetries')}
                  className={`form-control ${errors.maxRetries ? 'is-invalid' : ''}`}
                  id='maxRetries'
                  defaultValue={1}
                  data-cy={'maxRetries'}
                  placeholder='Max number of retries for each account...'
                  autoComplete='maxRetries'
                />
                <div className='invalid-feedback'>{errors.maxRetries?.message}</div>
              </div>
              <div className='form-check mt-3'>
                <input
                  type='checkbox'
                  {...register('runHeadless')}
                  className={`form-check-input ${errors.runHeadless ? 'is-invalid' : ''}`}
                  id='runHeadless'
                  data-cy={'runHeadless'}
                />
                <label htmlFor='runHeadless' className='primary-clr font-weight-bold h6 form-check-label'>
                  Run headless?
                </label>
                <div className='invalid-feedback'>{errors.runHeadless?.message}</div>
              </div>
              <div className='form-check mt-3'>
                <input
                  type='checkbox'
                  {...register('useProxy')}
                  className={`form-check-input ${errors.useProxy ? 'is-invalid' : ''}`}
                  id='useProxy'
                  data-cy={'useProxy'}
                />
                <label htmlFor='useProxy' className='primary-clr font-weight-bold h6 form-check-label'>
                  Use Proxy?
                </label>
                <div className='invalid-feedback'>{errors.useProxy?.message}</div>
              </div>
              <button type='submit' className='btn btn-primary btn-block mt-2' data-cy={'submit'}>
                Run now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

import React from 'react';
import './Layout.scss';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useCSVReader } from 'react-papaparse';
import { useAppDispatch, useAppSelector } from '@renderer/hooks';
import { RunBotReqInterface } from '@renderer/interfaces/reqInterfaces';
import { yupResolver } from '@hookform/resolvers/yup';
import Logo from '@assets/images/logo.png';

const Layout = () => {
  const { CSVReader } = useCSVReader();
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
    rows: Yup.array().of(
      Yup.object().shape({
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required'),
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        zip: Yup.string().required('Zip is required'),
        phone: Yup.string().required('Phone is required'),
        proxyInfo: Yup.string().required('Proxy info is required'),
      }),
    ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RunBotReqInterface>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: RunBotReqInterface) => {
    console.log('data', data);
    const hello = await window.electron_window.test(data);
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
                  type='hidden'
                  {...register('rows')}
                  className={`form-control ${errors.rows ? 'is-invalid' : ''}`}
                  id='file'
                  data-cy={'file'}
                  autoComplete='buyUrl'
                />
                <CSVReader
                  onUploadAccepted={(results: any) => {
                    console.log('---------------------------');
                    console.log(results);
                    console.log('---------------------------');
                    // check if headers have email, password
                    const headers = results.data[0];
                    if (!headers.includes('email') || !headers.includes('password')) {
                      alert('Invalid file');
                      return;
                    }

                    const data = results.data.slice(1).map((row: any) => {
                      return {
                        email: row[0],
                        password: row[1],
                        first_name: row[2],
                        last_name: row[3],
                        zip: row[4],
                        phone: row[5],
                        proxyInfo: row?.[6] || '',
                      }
                    });

                    // remove empty rows
                    const filteredData = data.filter((row: any) => row.email && row.password);

                    setValue('rows', filteredData, { shouldValidate: true });
                  }}
                >
                  {({
                      getRootProps,
                      acceptedFile,
                      ProgressBar,
                      getRemoveFileProps,
                    }: any) => {
                    return (
                      <>
                        <div className='d-flex'>
                          <button type='button' className='btn btn-outline-primary' {...getRootProps()}>
                            Browse file
                          </button>
                          <div style={{ marginLeft: 20 }}>
                            {acceptedFile && !errors?.rows && acceptedFile.name}
                          </div>
                        </div>
                        <ProgressBar />
                      </>
                    )
                  }}
                </CSVReader>
                {
                  errors.rows && (
                    <div className='invalid-feedback'>{errors.rows?.message}</div>
                  )
                }
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

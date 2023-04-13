import { TestContextAPI } from './testContext';

const context: TestContextAPI = (window as any).electron_window?.testContext;

export default context;

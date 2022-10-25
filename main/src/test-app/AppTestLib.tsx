import {createRoot} from 'react-dom/client';
//because these test files are excluded form typescript config the path config doesn't work so need to use relative urls.
import {TestForm} from '@lib/index';

const container = document.getElementById('root') ?? document.createElement('div');
const root = createRoot(container);

const AppTestLib = () => {
  return <TestForm />;
};
root.render(<AppTestLib />);

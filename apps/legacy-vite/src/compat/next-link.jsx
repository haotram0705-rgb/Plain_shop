import { Link as RouterLink } from 'react-router-dom';

export function Link({ href, ...props }) {
  return <RouterLink to={href} {...props} />;
}

export default Link;

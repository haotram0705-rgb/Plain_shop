import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

export { useParams, useSearchParams };

export function usePathname() {
  return useLocation().pathname;
}

export function useRouter() {
  const navigate = useNavigate();

  return {
    push: (to, options) => navigate(to, options),
    replace: (to) => navigate(to, { replace: true }),
    back: () => navigate(-1),
  };
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PostLoginRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    console.log("here tooo", role);

    if (role) {
      switch (role) {
        case 'OWNER':
          navigate('/salon-registration');
          break;
        case 'CLIENT':
          navigate('/client-dashboard');
          break;
        case 'EMPLOYEE':
          navigate('/employee-dashboard');
          break;
        default:
          navigate('/'); 
      }
    }
  }, [navigate]);

  return <div>Loading...</div>; 
};

export default PostLoginRedirect;

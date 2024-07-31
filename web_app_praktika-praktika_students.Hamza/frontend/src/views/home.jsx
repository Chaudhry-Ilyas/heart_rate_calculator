import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import DeleteUserComponent from './deleteUser';
import InfoUserComponent from './infoUser';
import ChangePasswordComponent from './changeUserPassword';
import HSAnhaltLogo from '../assets/hs_anhalt_logo.png';

const Home = () => {
    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);
    return (
        <div>
            {isLoggedIn() ? <LoggedInView user={user()} /> : <LoggedOutView />}
        </div>
    );
};

const LoggedInView = ({ user }) => {
    return (
        <div>
            <h1>Welcome {user.username}</h1>
            <Link to='/private'>
                <button className='button'>Private</button>
            </Link>
            <Link to='/logout'>
                <button className='button'>Logout</button>
            </Link>
            <DeleteUserComponent />
            <InfoUserComponent />
            <ChangePasswordComponent />
            
        </div>
    );
};

export const LoggedOutView = ({ title = 'Home' }) => {
    return (
        <div>
            <img src={HSAnhaltLogo} alt='HS-Anhalt Logo'/>
            <h1>{title}</h1>
            <Link to='/login'>
                <button className='button'>Login</button>
            </Link>
            <Link to='/register'>
                <button className='button'>Register</button>
            </Link>
        </div>
    );
};

export default Home;
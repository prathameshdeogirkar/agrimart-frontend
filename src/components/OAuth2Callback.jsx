import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

const OAuth2Callback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Save token to local storage
            authService.setToken(token);

            // Notify user
            toast.success('Successfully logged in with Google!');

            // Redirect to home (this will trigger AuthContext to reload user state)
            window.location.href = '/';
        } else {
            toast.error('Google login failed. No token received.');
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold animate-pulse">Authenticating with Google...</p>
            </div>
        </div>
    );
};

export default OAuth2Callback;


import { useSelector } from 'react-redux';

export const usePermission = (required) => {
    const auth = useSelector(s => s.auth);
    console.log('Auth state:', auth);
    const permissions = useSelector(s => s.auth.permissions);
    const role = useSelector(s => s.auth.role_en);

    if (role === 'admin') return true;
    const hasPermission = required.every(p => permissions.includes(p));


    return { hasPermission, role };
};
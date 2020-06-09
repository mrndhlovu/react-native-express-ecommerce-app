import {useContext} from 'react';

import {AuthContext} from './contextUtils';

export const useAuth = () => useContext(AuthContext);

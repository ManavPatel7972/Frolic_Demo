import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },
};

export const instituteService = {
    getAll: async () => {
        const response = await api.get('/institute');
        return response.data.institutes;
    },
    getById: async (id) => {
        const response = await api.get(`/institute/${id}`);
        return response.data.institute;
    },
    create: async (data) => {
        const response = await api.post('/institute', data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/institute/${id}`);
        return response.data;
    },
};

export const departmentService = {
    getAll: async () => {
        const response = await api.get('/departments');
        return response.data.departments;
    },
    getByInstitute: async (instituteId) => {
        const response = await api.get(`/departments/${instituteId}/departments`);
        return response.data.departments;
    },
    create: async (data) => {
        const response = await api.post('/departments', data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/departments/${id}`);
        return response.data;
    },
};

export const userService = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data.users;
    },
    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data.user;
    },
    update: async (id, data) => {
        const response = await api.patch(`/users/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

export const participantService = {
    getAll: async () => {
        const response = await api.get('/participants');
        return response.data.participants;
    },
    create: async (data) => {
        const response = await api.post('/participants', data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/participants/${id}`);
        return response.data;
    }
};

export const groupService = {
    create: async (data) => {
        const response = await api.post('/groups', data);
        return response.data;
    },
    getByEvent: async (eventId) => {
        const response = await api.get(`/groups/event/${eventId}`);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.patch(`/groups/${id}`, data);
        return response.data;
    }
};

export const eventService = {
    getAll: async () => {
        const response = await api.get('/events');
        return response.data.events;
    },
    getById: async (id) => {
        const response = await api.get(`/events/find/${id}`);
        return response.data.event;
    },
    create: async (data) => {
        const response = await api.post('/events', data);
        return response.data.event;
    },
    delete: async (id) => {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    },
    getWinners: async (eventId) => {
        const response = await api.get(`/events/${eventId}/winners`);
        return response.data;
    },
    declareWinner: async (eventId, data) => {
        const response = await api.post(`/events/${eventId}/winners`, data);
        return response.data;
    },
    getGroups: async (eventId) => {
        const response = await api.get(`/events/${eventId}/groups`);
        return response.data.groups;
    },
    removeWinner: async (eventId, sequence) => {
        const response = await api.delete(`/events/${eventId}/winners/${sequence}`);
        return response.data;
    }
};

export default api;

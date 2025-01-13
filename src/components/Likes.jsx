import React from 'react'
import { useEffect } from 'react';
import api from './api';
import { useState } from 'react';
import './likes.css'

export default function Likes() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/likes/get-all-mine');
                if (response.status === 200 && Array.isArray(response.data.data)) {
                    setData(response.data.data);
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
        fetchUsers();
    }, []);
    return (
        <div className="likes-wrap">
            <div className='likes-title'>Liked users</div>
            <div className='likes-cont'>
                {data.map((user, index) => (
                    <div
                        key={user.id}
                        className="liked-user-item"
                    >
                        <div className="liked-first">
                            <img
                                src="https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
                                alt=""
                                className="liked-user-avatar"
                            />
                            <div className="name">
                                {user.firstName} {user.lastName}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

import React from 'react';
import { useSelector } from 'react-redux';
import '../../pages/profile.css';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="user-profile">
      <h2>My Profile</h2>
      <div className="profile-info">
        <div className="info-group">
          <label>Username</label>
          <p>{user.username}</p>
        </div>
        <div className="info-group">
          <label>Email</label>
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

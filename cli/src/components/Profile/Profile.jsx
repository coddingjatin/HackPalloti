import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // State to manage profile fields
  const [name, setName] = useState(localStorage.getItem("name") || "John Doe");
  const [bio, setBio] = useState("AI & Machine Learning Enthusiast");
  const [tags, setTags] = useState(["Python", "Machine Learning", "Data Science"]);

  // Backup states for cancel
  const [backup, setBackup] = useState({ name, bio, tags });

  const toggleEdit = () => {
    if (!isEditing) {
      setBackup({ name, bio, tags }); // Save current before editing
    }
    setIsEditing(!isEditing);
  };

  const saveChanges = () => {
    setIsEditing(false);
    localStorage.setItem("name", name);
    // Send to backend if needed
  };

  const cancelChanges = () => {
    setName(backup.name);
    setBio(backup.bio);
    setTags(backup.tags);
    setIsEditing(false);
  };

  const userStats = {
    completedCourses: 12,
    avgScore: 85,
    totalStudyTime: "45h",
    learningStreak: 15
  };

  const progressData = [
    { topic: 'Python', progress: 75 },
    { topic: 'Machine Learning', progress: 60 },
    { topic: 'Data Structures', progress: 85 },
    { topic: 'Algorithms', progress: 70 }
  ];

  const recentActivities = [
    { date: '2024-02-07', activity: 'Completed Python Basics Quiz', score: 90 },
    { date: '2024-02-06', activity: 'Started Machine Learning Path', score: null },
    { date: '2024-02-05', activity: 'Completed JavaScript Assessment', score: 85 },
    { date: '2024-02-04', activity: 'Updated Learning Goals', score: null }
  ];

  return (
    <div className="container-fluid py-4">
      {/* Profile Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-3 text-center">
                  <div className="position-relative d-inline-block">
                    <img
                      src="/trophy.png"
                      alt="Profile"
                      className="rounded-circle img-thumbnail mb-3"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="ps-md-4">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <textarea
                          className="form-control mb-2"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-control mb-3"
                          value={tags.join(', ')}
                          onChange={(e) =>
                            setTags(e.target.value.split(',').map(tag => tag.trim()))
                          }
                        />
                      </>
                    ) : (
                      <>
                        <h2 className="mb-1">{name}</h2>
                        <p className="text-muted mb-2">{bio}</p>
                        <p className="small text-muted">Member since January 2024</p>
                        <div className="mb-3">
                          {tags.map((tag, idx) => (
                            <span key={idx} className="badge bg-primary me-2">{tag}</span>
                          ))}
                        </div>
                      </>
                    )}

                    {isEditing ? (
                      <>
                        <button className="btn btn-success btn-sm me-2" onClick={saveChanges}>
                          Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={cancelChanges}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-outline-primary btn-sm me-2" onClick={toggleEdit}>
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {[
          { icon: "bi-book", label: "Completed Courses", value: userStats.completedCourses, color: "primary" },
          { icon: "bi-trophy", label: "Average Score", value: `${userStats.avgScore}%`, color: "warning" },
          { icon: "bi-clock", label: "Total Study Time", value: userStats.totalStudyTime, color: "info" },
          { icon: "bi-lightning", label: "Learning Streak", value: `${userStats.learningStreak} days`, color: "danger" }
        ].map((stat, i) => (
          <div className="col-md-3 col-sm-6 mb-3" key={i}>
            <div className="card h-100 shadow-sm text-center">
              <div className="card-body">
                <i className={`bi ${stat.icon} fs-3 text-${stat.color} mb-2`}></i>
                <h5 className="card-title">{stat.value}</h5>
                <p className="card-text text-muted">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Progress */}
      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card shadow h-100">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Learning Progress</h5>
            </div>
            <div className="card-body">
              {progressData.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{item.topic}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${item.progress}%` }}
                      aria-valuenow={item.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow h-100">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Recent Activity</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <p className="mb-1">{activity.activity}</p>
                      {activity.score && (
                        <span className="badge bg-success">{activity.score}%</span>
                      )}
                    </div>
                    <small className="text-muted">{activity.date}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card shadow">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">AI Learning Recommendations</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="col-md-4 mb-3">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="card-title">Recommended Path {item}</h6>
                        <p className="card-text text-muted small">
                          Based on your progress and interests, we recommend exploring this learning path.
                        </p>
                        <a href="/workflow" className="btn btn-outline-primary btn-sm">
  Start Learning
</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

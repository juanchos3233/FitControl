import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { getUserProfile } from '../services/profile';

export default function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [hasGoal, setHasGoal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      const user = auth.currentUser;
      if (!user) {
        if (mounted) {
          setIsAuthed(false);
          setChecking(false);
        }
        return;
      }
      try {
        const p = await getUserProfile(user.uid);
        if (mounted) {
          setIsAuthed(true);
          setProfileCompleted(!!p?.profileCompleted);
          setHasGoal(!!p?.goal);
          setChecking(false);
        }
      } catch {
        if (mounted) {
          setIsAuthed(true);
          setProfileCompleted(false);
          setHasGoal(false);
          setChecking(false);
        }
      }
    };
    run();
    return () => { mounted = false; };
  }, [location.pathname]);

  if (checking) return null;

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!profileCompleted && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }
  if (profileCompleted && !hasGoal && location.pathname !== '/goal') {
    return <Navigate to="/goal" replace />;
  }
  return <Outlet />;
}

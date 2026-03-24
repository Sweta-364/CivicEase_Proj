import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Info, LogOut } from 'lucide-react';
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/useAuth';

export default function DashboardHeader({ title = 'Dashboard', subtitle = 'Your civic workspace overview.' }) {
  const navigate = useNavigate();
  const { appUser } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowInfo(false);
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initial = appUser?.display_name?.charAt(0) || appUser?.email?.charAt(0) || 'U';

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      <div className="relative flex items-center gap-3" ref={menuRef}>
        {/* Info button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-50 transition-colors hover:bg-gray-100"
          aria-label="Info"
          onClick={() => {
            setShowInfo((prev) => !prev);
            setShowProfile(false);
          }}
        >
          <Info className="h-4 w-4 text-gray-700" />
        </button>

        {showInfo && (
          <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            <div className="border-b border-gray-50 bg-gray-50/60 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-800">Dashboard notes</h3>
              <p className="mt-1 text-xs text-gray-500">This is the CivicEase workspace for managing civic issues, community posts, and department resources.</p>
            </div>
            <div className="space-y-3 p-4 text-sm leading-6 text-gray-600">
              <p>Use the left sidebar for main navigation.</p>
              <p>The overview displays your reported issues, available resources, and community post counts.</p>
            </div>
          </div>
        )}

        {/* Profile pill */}
        <div className="relative">
          <div className="flex h-12 items-center gap-3 rounded-full border-2 border-gray-200 bg-gray-50 px-4">
            {/* Notification bell */}
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 text-gray-700" />
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-sky-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            {/* Avatar + name */}
            <button
              className="flex items-center gap-2"
              onClick={() => {
                setShowProfile((prev) => !prev);
                setShowInfo(false);
              }}
            >
              <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-gray-700">
                <div className="flex h-full w-full items-center justify-center bg-sky-500 text-sm font-bold text-white">
                  {initial.toUpperCase()}
                </div>
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-[14px] font-bold text-gray-700">{appUser?.display_name || 'User'}</div>
                <div className="max-w-[140px] truncate text-[10px] text-gray-400">{appUser?.email || ''}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-700" />
            </button>
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="border-b border-gray-50 px-4 py-3">
                <p className="mb-1 text-xs text-gray-500">Signed in as</p>
                <p className="truncate text-sm font-medium text-gray-800">{appUser?.email || 'Guest'}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={async () => {
                    await auth.signOut();
                    setShowProfile(false);
                    navigate('/signin');
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

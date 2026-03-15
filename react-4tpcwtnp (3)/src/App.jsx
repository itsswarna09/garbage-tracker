import React, { useState, useEffect } from 'react';
import {
  Trash2,
  MapPin,
  TrendingUp,
  Zap,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Mail,
  Lock,
  User,
  LogOut,
  Plus,
  Trash,
  Clock,
  MapPinIcon,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  // Load data on startup
  useEffect(() => {
    const savedUsers = localStorage.getItem('garbageTrackerUsers');
    if (savedUsers) setUsers(JSON.parse(savedUsers));

    const savedReports = localStorage.getItem('garbageTrackerReports');
    if (savedReports) setReports(JSON.parse(savedReports));

    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      setCurrentPage('dashboard');
    }
  }, []);

  // FIXED: Improved Nominatim geocoding with better error handling
  const geocodeLocation = async (locationText) => {
    try {
      console.log('Geocoding:', locationText);

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));

      const query = encodeURIComponent(locationText.trim());
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

      console.log('URL:', url);

      const response = await fetch(url);
      const data = await response.json();

      console.log('Response:', data);

      if (data && data.length > 0) {
        const result = data[0];
        const coordinates = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        };
        console.log('Found coordinates:', coordinates);
        return coordinates;
      } else {
        console.log('No results found for:', locationText);
        return null;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Handle signup
  const handleSignup = (email, password, confirmPassword) => {
    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return false;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return false;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return false;
    }
    if (users.find((u) => u.email === email)) {
      alert('Email already registered! Try logging in.');
      return false;
    }

    const newUser = {
      id: Date.now(),
      email: email,
      password: password,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('garbageTrackerUsers', JSON.stringify(updatedUsers));
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    alert('Account created successfully! Welcome!');
    setCurrentPage('dashboard');
    return true;
  };

  // Handle login
  const handleLogin = (email, password) => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return false;
    }
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!foundUser) {
      alert('Invalid email or password!');
      return false;
    }
    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    setCurrentPage('dashboard');
    return true;
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('landing');
  };

  // Handle new report with FIXED geocoding
  const handleAddReport = async (location, status, description) => {
    if (!location || !status) {
      alert('Please fill in location and status');
      return false;
    }

    // Show loading state
    alert('Finding location... please wait');

    // FIXED: Better geocoding
    const coordinates = await geocodeLocation(location);

    if (!coordinates) {
      alert(
        'Location not found. Try: "Mumbai", "Delhi", "Kakinada", "Bengaluru", or "Chennai"'
      );
      return false;
    }

    const newReport = {
      id: Date.now(),
      userId: user.id,
      location: location,
      status: status,
      description: description,
      timestamp: new Date().toISOString(),
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };

    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    localStorage.setItem(
      'garbageTrackerReports',
      JSON.stringify(updatedReports)
    );
    alert('✅ Report submitted successfully at ' + location + '!');
    setShowReportForm(false);
    return true;
  };

  // Delete report
  const handleDeleteReport = (reportId) => {
    const updatedReports = reports.filter((r) => r.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem(
      'garbageTrackerReports',
      JSON.stringify(updatedReports)
    );
    alert('Report deleted!');
  };

  // Get user's reports
  const userReports = reports.filter((r) => r.userId === user?.id);

  // Get statistics
  const stats = {
    total: userReports.length,
    full: userReports.filter((r) => r.status === 'full').length,
    moderate: userReports.filter((r) => r.status === 'moderate').length,
    empty: userReports.filter((r) => r.status === 'empty').length,
  };

  // LANDING PAGE
  const LandingPage = () => (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 50,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trash2 size={24} color="#FFFFFF" />
            </div>
            <span
              style={{ fontWeight: 'bold', fontSize: '20px', color: '#111827' }}
            >
              GarbageTracker
            </span>
          </div>

          <div
            style={{
              display: window.innerWidth > 768 ? 'flex' : 'none',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => setCurrentPage('signup')}
              style={{
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                padding: '8px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section
        style={{
          paddingTop: '120px',
          paddingBottom: '80px',
          paddingLeft: '16px',
          paddingRight: '16px',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#D1FAE5',
                padding: '8px 16px',
                borderRadius: '9999px',
                border: '1px solid #A7F3D0',
                width: 'fit-content',
              }}
            >
              <Zap size={16} color="#10B981" />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#059669',
                }}
              >
                The Smart Way to Track Garbage
              </span>
            </div>

            <h1
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
                color: '#111827',
                lineHeight: '1.1',
              }}
            >
              Smart Waste Tracking Made Simple
            </h1>

            <p
              style={{
                fontSize: '20px',
                color: '#4B5563',
                lineHeight: '1.8',
              }}
            >
              Real-time garbage bin monitoring powered by AI. Optimize
              collection routes, reduce overflow, and track environmental
              impact—all in one platform.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: window.innerWidth > 640 ? 'row' : 'column',
                gap: '16px',
                paddingTop: '16px',
              }}
            >
              <button
                onClick={() => setCurrentPage('signup')}
                style={{
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#10B981';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Start Free Trial
                <ArrowRight size={20} />
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '24px',
                paddingTop: '16px',
                fontSize: '14px',
                color: '#4B5563',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <CheckCircle size={20} color="#10B981" />
                No credit card required
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <CheckCircle size={20} color="#10B981" />
                Free setup
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        style={{
          backgroundColor: '#111827',
          color: '#9CA3AF',
          padding: '48px 16px 32px',
          textAlign: 'center',
          fontSize: '14px',
        }}
      >
        <p>&copy; 2024 GarbageTracker. All rights reserved.</p>
      </footer>
    </div>
  );

  // SIGNUP PAGE
  const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(() => {
        handleSignup(email, password, confirmPassword);
        setLoading(false);
      }, 500);
    };

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F9FAFB',
          padding: '16px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#FFFFFF',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#D1FAE5',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <User size={28} color="#10B981" />
            </div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '8px',
              }}
            >
              Create Account
            </h1>
            <p style={{ color: '#4B5563', fontSize: '14px' }}>
              Join GarbageTracker today
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                }}
              >
                Email Address
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#F3F4F6',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <Mail size={20} color="#9CA3AF" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    color: '#111827',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                }}
              >
                Password
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#F3F4F6',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <Lock size={20} color="#9CA3AF" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    color: '#111827',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                }}
              >
                Confirm Password
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#F3F4F6',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <Lock size={20} color="#9CA3AF" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    color: '#111827',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '16px',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p
            style={{
              textAlign: 'center',
              color: '#4B5563',
              fontSize: '14px',
              marginTop: '24px',
            }}
          >
            Already have an account?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#10B981',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    );
  };

  // LOGIN PAGE
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(() => {
        handleLogin(email, password);
        setLoading(false);
      }, 500);
    };

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F9FAFB',
          padding: '16px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#FFFFFF',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#D1FAE5',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Lock size={28} color="#10B981" />
            </div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '8px',
              }}
            >
              Welcome Back
            </h1>
            <p style={{ color: '#4B5563', fontSize: '14px' }}>
              Sign in to your GarbageTracker account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                }}
              >
                Email Address
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#F3F4F6',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <Mail size={20} color="#9CA3AF" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    color: '#111827',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                }}
              >
                Password
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#F3F4F6',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <Lock size={20} color="#9CA3AF" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    color: '#111827',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '16px',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p
            style={{
              textAlign: 'center',
              color: '#4B5563',
              fontSize: '14px',
              marginTop: '24px',
            }}
          >
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentPage('signup')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#10B981',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    );
  };

  // MAP VIEW COMPONENT
  const MapView = ({ reports }) => {
    const mapRef = React.useRef(null);
    const mapInstanceRef = React.useRef(null);

    React.useEffect(() => {
      if (!mapRef.current || reports.length === 0) return;

      const map = window.L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      mapInstanceRef.current = map;

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      reports.forEach((report) => {
        const color =
          report.status === 'full'
            ? '#EF4444'
            : report.status === 'moderate'
            ? '#F59E0B'
            : '#10B981';

        const markerHtml = `
          <div style="
            width: 30px;
            height: 30px;
            background: ${color};
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            cursor: pointer;
          ">
            📍
          </div>
        `;

        const customIcon = window.L.divIcon({
          html: markerHtml,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        });

        window.L.marker([report.latitude, report.longitude], {
          icon: customIcon,
        })
          .bindPopup(
            `
            <div style="padding: 10px; font-size: 14px;">
              <strong>${report.location}</strong><br/>
              Status: ${
                report.status === 'full'
                  ? '🔴 Full'
                  : report.status === 'moderate'
                  ? '🟡 Moderate'
                  : '🟢 Empty'
              }<br/>
              ${
                report.description ? `<small>${report.description}</small>` : ''
              }
            </div>
          `
          )
          .addTo(map);
      });

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }
      };
    }, [reports]);

    if (reports.length === 0) {
      return (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '32px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#4B5563',
          }}
        >
          <p>No reports yet. Report some bins to see them on the map!</p>
        </div>
      );
    }

    return (
      <div
        style={{
          width: '100%',
          height: '600px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '40px',
        }}
      >
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    );
  };

  // DASHBOARD PAGE
  const DashboardPage = () => {
    return (
      <div>
        {/* Navigation */}
        <nav
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E5E7EB',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#10B981',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trash2 size={24} color="#FFFFFF" />
            </div>
            <span
              style={{ fontWeight: 'bold', fontSize: '18px', color: '#111827' }}
            >
              GarbageTracker
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#4B5563', fontSize: '14px' }}>
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#F9FAFB',
            padding: '40px 16px',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '40px' }}>
              <h1
                style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '8px',
                }}
              >
                Your Garbage Tracking Dashboard
              </h1>
              <p style={{ fontSize: '18px', color: '#4B5563' }}>
                Track and manage garbage bins across India
              </p>
              <p
                style={{ fontSize: '13px', color: '#059669', marginTop: '8px' }}
              >
                ✅ Using FREE OpenStreetMap (Nominatim)
              </p>
              <p
                style={{ fontSize: '12px', color: '#F59E0B', marginTop: '4px' }}
              >
                💡 Try: "Mumbai", "Delhi", "Kakinada", "Bengaluru", "Chennai"
              </p>
            </div>

            {/* View Toggle Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '40px',
              }}
            >
              <button
                onClick={() => setViewMode('list')}
                style={{
                  backgroundColor: viewMode === 'list' ? '#10B981' : '#E5E7EB',
                  color: viewMode === 'list' ? '#FFFFFF' : '#111827',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                📋 List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                style={{
                  backgroundColor: viewMode === 'map' ? '#10B981' : '#E5E7EB',
                  color: viewMode === 'map' ? '#FFFFFF' : '#111827',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                🗺️ Map View
              </button>
            </div>

            {/* Map View */}
            {viewMode === 'map' && (
              <>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '24px',
                  }}
                >
                  Garbage Bins on Map
                </h2>
                <MapView reports={userReports} />
              </>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <>
                {/* Statistics */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      window.innerWidth > 768 ? 'repeat(4, 1fr)' : '1fr',
                    gap: '16px',
                    marginBottom: '40px',
                  }}
                >
                  {[
                    {
                      label: 'Total Reports',
                      value: stats.total,
                      color: '#10B981',
                      icon: '📊',
                    },
                    {
                      label: 'Full Bins',
                      value: stats.full,
                      color: '#EF4444',
                      icon: '🔴',
                    },
                    {
                      label: 'Moderate',
                      value: stats.moderate,
                      color: '#F59E0B',
                      icon: '🟡',
                    },
                    {
                      label: 'Empty',
                      value: stats.empty,
                      color: '#10B981',
                      icon: '🟢',
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        padding: '24px',
                        borderRadius: '12px',
                        border: `2px solid ${stat.color}`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                        {stat.icon}
                      </div>
                      <div
                        style={{
                          fontSize: '32px',
                          fontWeight: 'bold',
                          color: stat.color,
                          marginBottom: '4px',
                        }}
                      >
                        {stat.value}
                      </div>
                      <div style={{ color: '#4B5563', fontSize: '14px' }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div style={{ marginBottom: '40px' }}>
                  <button
                    onClick={() => setShowReportForm(!showReportForm)}
                    style={{
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      padding: '16px 32px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#059669';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#10B981';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <Plus size={20} />
                    {showReportForm ? 'Hide Form' : 'Report New Bin'}
                  </button>
                </div>

                {/* Report Form */}
                {showReportForm && <ReportForm onSubmit={handleAddReport} />}

                {/* Reports List */}
                <ReportsList
                  reports={userReports}
                  onDelete={handleDeleteReport}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // REPORT FORM COMPONENT
  const ReportForm = ({ onSubmit }) => {
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('moderate');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      await onSubmit(location, status, description);
      setLocation('');
      setStatus('moderate');
      setDescription('');
      setLoading(false);
    };

    return (
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '40px',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '24px',
          }}
        >
          Report a Garbage Bin
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
              }}
            >
              Location (try: "Mumbai", "Delhi", "Kakinada")
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F3F4F6',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
              }}
            >
              <MapPin size={20} color="#9CA3AF" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or location"
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  color: '#111827',
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
              }}
            >
              Bin Status
            </label>
            <div
              style={{
                display: 'flex',
                gap: '12px',
              }}
            >
              {['empty', 'moderate', 'full'].map((s) => (
                <label
                  key={s}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    backgroundColor: status === s ? '#D1FAE5' : '#F3F4F6',
                    borderRadius: '8px',
                    border:
                      status === s ? '2px solid #10B981' : '1px solid #E5E7EB',
                    cursor: 'pointer',
                    fontWeight: status === s ? 'bold' : 'normal',
                    color: status === s ? '#10B981' : '#4B5563',
                  }}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={status === s}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  />
                  {s === 'empty'
                    ? '🟢 Empty'
                    : s === 'moderate'
                    ? '🟡 Moderate'
                    : '🔴 Full'}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px',
              }}
            >
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional details..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#F3F4F6',
                fontSize: '16px',
                color: '#111827',
                fontFamily: 'Arial, sans-serif',
                minHeight: '100px',
                resize: 'vertical',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    );
  };

  // REPORTS LIST COMPONENT
  const ReportsList = ({ reports, onDelete }) => {
    if (reports.length === 0) {
      return (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '32px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#4B5563',
          }}
        >
          <AlertCircle
            size={48}
            style={{ margin: '0 auto 16px', color: '#9CA3AF' }}
          />
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>
            No reports yet
          </p>
          <p>Start by reporting a garbage bin in your area!</p>
        </div>
      );
    }

    return (
      <div>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '24px',
          }}
        >
          Your Reports
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
            gap: '16px',
          }}
        >
          {reports.map((report) => (
            <div
              key={report.id}
              style={{
                backgroundColor: '#FFFFFF',
                padding: '24px',
                borderRadius: '12px',
                border: `2px solid ${
                  report.status === 'full'
                    ? '#EF4444'
                    : report.status === 'moderate'
                    ? '#F59E0B'
                    : '#10B981'
                }`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '4px',
                    }}
                  >
                    {report.location}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#4B5563',
                      fontSize: '14px',
                    }}
                  >
                    <Clock size={16} />
                    {new Date(report.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => onDelete(report.id)}
                  style={{
                    backgroundColor: '#FEE2E2',
                    color: '#EF4444',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Trash size={16} />
                </button>
              </div>

              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor:
                    report.status === 'full'
                      ? '#FEE2E2'
                      : report.status === 'moderate'
                      ? '#FEF3C7'
                      : '#D1FAE5',
                  color:
                    report.status === 'full'
                      ? '#EF4444'
                      : report.status === 'moderate'
                      ? '#D97706'
                      : '#10B981',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  marginBottom: '12px',
                }}
              >
                {report.status === 'full'
                  ? '🔴 Full'
                  : report.status === 'moderate'
                  ? '🟡 Moderate'
                  : '🟢 Empty'}
              </div>

              {report.description && (
                <p
                  style={{
                    color: '#4B5563',
                    fontSize: '14px',
                    marginTop: '12px',
                    lineHeight: '1.5',
                  }}
                >
                  {report.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // RENDER PAGES
  return (
    <div>
      {!user ? (
        <>
          {currentPage === 'landing' && <LandingPage />}
          {currentPage === 'signup' && <SignupPage />}
          {currentPage === 'login' && <LoginPage />}
        </>
      ) : (
        <DashboardPage />
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Authentication Service (Generic Third-Party Integration)
// class AuthService {
//   constructor(config) {
//     this.config = config;
//     this.initializeAuth();
//   }
//
//   initializeAuth() {
//     // Placeholder for third-party SDK initialization
//     // In a real app, this would be something like:
//     // firebase.initializeApp(this.config)
//     // or
//     // auth0.init(this.config)
//   }
//
//   async signInWithProvider(providerName) {
//     try {
//       // Simulated third-party authentication
//       // In a real implementation, this would use the specific provider's method
//       const authProvider = this.getAuthProvider(providerName);
//
//       // Trigger provider-specific login flow
//       const result = await authProvider.signIn();
//
//       // Get ID token from third-party provider
//       const idToken = await result.user.getIdToken();
//
//       // Send token to your backend for validation and session creation
//       const response = await this.validateTokenWithBackend(idToken);
//
//       return response;
//     } catch (error) {
//       console.error('Authentication error:', error);
//       throw error;
//     }
//   }
//
//   async validateTokenWithBackend(idToken) {
//     try {
//       // Send token to your backend for validation
//       const response = await axios.post(
//           'https://your-backend-api.com/auth/validate',
//           { idToken },
//           {
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             withCredentials: true
//           }
//       );
//
//       return response.data;
//     } catch (error) {
//       console.error('Backend validation error:', error);
//       throw error;
//     }
//   }
//
//   async fetchUserProfile() {
//     try {
//       const response = await axios.get(
//           'https://your-backend-api.com/user/profile',
//           { withCredentials: true }
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Profile fetch error:', error);
//       throw error;
//     }
//   }
//
//   async logout() {
//     try {
//       // Logout from third-party provider
//       await this.signOutFromProvider();
//
//       // Logout from backend
//       await axios.post(
//           'https://your-backend-api.com/auth/logout',
//           {},
//           { withCredentials: true }
//       );
//
//       // Redirect to login
//       window.location.href = '/login';
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   }
//
//   async signOutFromProvider() {
//     // Placeholder for third-party sign-out
//     // Would be implemented specific to the provider
//   }
//
//   getAuthProvider(providerName) {
//     // In a real app, return the specific provider
//     const providers = {
//       google: {
//         signIn: async () => {
//           // Simulated Google sign-in
//           throw new Error('Not implemented');
//         }
//       },
//       github: {
//         signIn: async () => {
//           // Simulated GitHub sign-in
//           throw new Error('Not implemented');
//         }
//       }
//     };
//
//     return providers[providerName];
//   }
// }

// Configuration for third-party auth
// const authConfig = {
//   // Example configuration (would be specific to your provider)
//   apiKey: 'your-api-key',
//   authDomain: 'your-auth-domain',
//   // Other provider-specific configurations
// };
//
// // Instantiate auth service
// const authService = new AuthService(authConfig);

// Login Page Component
function LoginPage() {
  const [error, setError] = useState(null);

  const handleProviderLogin = async (provider) => {
    try {
      await authService.signInWithProvider(provider);
      // Redirect to dashboard on successful login
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Authentication failed');
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login to Banking App</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
                <div className="text-red-500 mb-4">
                  {error}
                </div>
            )}
            <div className="space-y-4">
              <Button
                  onClick={() => handleProviderLogin('google')}
                  className="w-full"
              >
                Login with Google
              </Button>
              <Button
                  onClick={() => handleProviderLogin('github')}
                  className="w-full"
              >
                Login with GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

// Dashboard Page Component
function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user profile
        const profile = await authService.fetchUserProfile();
        setUserData(profile);
      } catch (err) {
        setError('Unable to load dashboard');
        window.location.href = '/login';
      }
    };

    fetchDashboardData();
  }, []);

  // Error or loading states
  if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen text-red-500">
          {error}
        </div>
    );
  }

  if (!userData) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
    );
  }

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Banking Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h2 className="text-xl">Welcome, {userData.name}</h2>
              <p>Account Balance: ${userData.balance.toFixed(2)}</p>
              <Button
                  variant="destructive"
                  className="w-full"
                  onClick={authService.logout}
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

// Routing (simplified)
function App() {
  const path = window.location.pathname;

  // Simple client-side routing
  if (path === '/login') {
    return <LoginPage />;
  } else if (path === '/dashboard') {
    return <DashboardPage />;
  } else {
    // Default to login
    return <LoginPage />;
  }
}

export default App;
